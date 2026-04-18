# Deploy Suprihub / Dispatch Landing on Kubernetes (AWS)

This guide walks through containerizing the Next.js app with Docker, pushing to **Amazon ECR**, and running it on **Amazon EKS** (or any Kubernetes cluster in AWS).

---

## Prerequisites

- AWS account with permissions for ECR, EKS, IAM, and (optional) ACM + Route 53
- [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) configured (`aws configure`)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Docker](https://docs.docker.com/get-docker/) (or build in CI)
- An **EKS cluster** (create one if needed: [EKS getting started](https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html))
- `kubectl` context pointing at your EKS cluster: `aws eks update-kubeconfig --region REGION --name CLUSTER_NAME`

---

## Step 1 — Build the Docker image locally (optional smoke test)

From the project root:

```bash
docker build -t dispatch-landing:local .
```

Run locally:

```bash
docker run --rm -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL="https://usttlxggoxkttikrrhil.supabase.co" \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_MKkVuoFGaFIcxBEBFsuruA_NKpcw9WO" \
  -e NEXT_PUBLIC_SITE_URL="http://localhost:3000" \
  dispatch-landing:local
```

Open http://localhost:3000.

**Build with Supabase baked in at build time (optional):**  
If you need `NEXT_PUBLIC_*` values fixed in the client bundle at build time, use build args:

```bash
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="your-key" \
  --build-arg NEXT_PUBLIC_SITE_URL="https://your-domain.com" \
  -t dispatch-landing:local .
```

For this app, the lead API reads env at **runtime**, so supplying env in Kubernetes (Step 6) is usually enough without rebuild.

---

## Step 2 — Create an Amazon ECR repository

Replace `REGION` and `ACCOUNT_ID` (12 digits).

```bash
export AWS_REGION=us-east-1
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

aws ecr create-repository \
  --repository-name dispatch-landing \
  --region $AWS_REGION \
  --image-scanning-configuration scanOnPush=true
```

Note the repository URI, e.g.  
`ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/dispatch-landing`

---

## Step 3 — Authenticate Docker to ECR

```bash
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
```

---

## Step 4 — Tag, push the image

```bash
export ECR_URI=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/dispatch-landing

docker tag dispatch-landing:local $ECR_URI:latest
docker push $ECR_URI:latest
```

(If you skipped local build, build and tag in one line:)

```bash
docker build -t $ECR_URI:latest .
docker push $ECR_URI:latest
```

---

## Step 5 — EKS node / IRSA (image pull)

- If nodes are in the same account, default node IAM often already allows ECR pull.
- If pull fails with `ImagePullBackOff`, attach an IAM policy that allows `ecr:GetAuthorizationToken` and `ecr:BatchGetImage` / `ecr:GetDownloadUrlForLayer` on your repo to the **node role** or use a dedicated pull secret.

---

## Step 6 — Create the Kubernetes Secret (env vars)

Never commit real secrets. Create the secret in the cluster:

```bash
kubectl create secret generic dispatch-landing-secrets \
  --from-literal=NEXT_PUBLIC_SUPABASE_URL='https://YOUR_PROJECT.supabase.co' \
  --from-literal=NEXT_PUBLIC_SUPABASE_ANON_KEY='your-anon-key' \
  --from-literal=NEXT_PUBLIC_SITE_URL='https://your-public-url.com'
```

Or edit `k8s/secret.example.yaml`, save as `k8s/secret.yaml` (gitignored), and apply:

```bash
kubectl apply -f k8s/secret.yaml
```

---

## Step 7 — Update Deployment image URI

Edit `k8s/deployment.yaml` and replace:

`REPLACE_WITH_ECR_URI:latest`

with your full ECR image URI, e.g.  
`123456789012.dkr.ecr.us-east-1.amazonaws.com/dispatch-landing:latest`

---

## Step 8 — Apply manifests

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl rollout status deployment/dispatch-landing
kubectl get pods -l app=dispatch-landing
```

---

## Step 9 — Expose the app (choose one)

### Option A — Temporary access with `kubectl port-forward`

```bash
kubectl port-forward svc/dispatch-landing 8080:80
```

Open http://localhost:8080

### Option B — AWS Load Balancer Controller + Ingress (recommended for production)

1. Install the [AWS Load Balancer Controller](https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html) on EKS.
2. Request an ACM certificate in the same region as the ALB.
3. Edit `k8s/ingress-alb.yaml`: set `host`, `certificate-arn`, subnets, security groups as needed.
4. Apply:

```bash
kubectl apply -f k8s/ingress-alb.yaml
kubectl get ingress dispatch-landing
```

Use the **ADDRESS** from the Ingress (ALB DNS) or point your DNS CNAME to it.

### Option C — `Service` type `LoadBalancer`

Change `k8s/service.yaml` to:

```yaml
spec:
  type: LoadBalancer
```

Apply again. AWS provisions an NLB/ELB (behavior depends on your EKS cloud controller). For HTTPS and host-based routing, prefer Option B.

---

## Step 10 — Verify

```bash
kubectl logs -l app=dispatch-landing --tail=50
curl -sI http://<your-alb-or-lb-dns>/
```

Submit the lead form and confirm rows in Supabase.

---

## Operations checklist

| Task | Command / action |
|------|-------------------|
| New image deploy | Build, push new tag, update `image:` in deployment, `kubectl apply -f k8s/deployment.yaml` |
| Scale | `kubectl scale deployment dispatch-landing --replicas=3` |
| Rolling restart | `kubectl rollout restart deployment/dispatch-landing` |
| Logs | `kubectl logs -f deployment/dispatch-landing` |
| Secrets rotation | `kubectl delete secret dispatch-landing-secrets` then recreate; rollout restart |

---

## CI/CD (optional)

- **GitHub Actions / CodePipeline**: build image on push, push to ECR, `kubectl set image` or apply manifests with the new tag.
- Pin image **digests** or **semver tags** (`:v1.2.3`) instead of only `:latest` for reproducible rollbacks.

---

## Files added for containers / K8s

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage production build (Next.js `standalone`) |
| `.dockerignore` | Smaller, faster builds |
| `next.config.js` | `output: "standalone"` for minimal runtime image |
| `k8s/deployment.yaml` | Pods + probes + resources |
| `k8s/service.yaml` | ClusterIP on port 80 → container 3000 |
| `k8s/ingress-alb.yaml` | Example ALB Ingress (AWS LBC) |
| `k8s/secret.example.yaml` | Template for env secrets |

---

## Troubleshooting

| Symptom | What to check |
|---------|----------------|
| `ImagePullBackOff` | ECR login, image URI, node IAM for ECR |
| `CrashLoopBackOff` | `kubectl logs`; missing env in Secret |
| 502 from ALB | Health checks, target group, pods `Ready` |
| Form fails in prod | Secret keys match Supabase; RLS policies allow anon insert |

This completes a standard **Docker + ECR + EKS** path for the dispatch landing application on AWS.
