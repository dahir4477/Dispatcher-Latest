# Dispatch landing — Kubernetes manifests (MongoDB + Web)

This folder deploys the app as **two pods**:

- **MongoDB**: StatefulSet (persistent)
- **Web**: Next.js Deployment

## Files

- `00-namespace.yaml`
- `01-configmap.yaml`
- `02-secrets.example.yaml` (copy to `02-secrets.yaml` and set real values)
- `09-mongo-pv.yaml` (static PV; adjust `hostPath` for your nodes)
- `10-mongo-pvc.yaml` (claim `mongo-data`)
- `11-mongo-statefulset.yaml` (pod mounts that PVC at `/data/db`)
- `12-mongo-service.yaml`
- `20-web-deployment.yaml`
- `21-web-service.yaml`
- `30-ingress.yaml`

## Apply

```bash
kubectl apply -f k8s/00-namespace.yaml
kubectl apply -f k8s/01-configmap.yaml
kubectl apply -f k8s/02-secrets.yaml
kubectl apply -f k8s/09-mongo-pv.yaml
kubectl apply -f k8s/10-mongo-pvc.yaml
kubectl apply -f k8s/12-mongo-service.yaml
kubectl apply -f k8s/11-mongo-statefulset.yaml
kubectl apply -f k8s/20-web-deployment.yaml
kubectl apply -f k8s/21-web-service.yaml
kubectl apply -f k8s/30-ingress.yaml
```

## Notes

- Replace `REPLACE_WITH_WEB_IMAGE:latest` with your built image (ECR recommended).
- MongoDB pods mount PVC `mongo-data` (see `volumes` + `volumeMounts` in `11-mongo-statefulset.yaml`), which binds to `09-mongo-pv.yaml` when using `storageClassName: manual`.

