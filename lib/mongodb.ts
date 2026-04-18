import { MongoClient } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var __mongoClientPromise: Promise<MongoClient> | undefined;
}

function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is required`);
  return v;
}

export function getMongoClientPromise(): Promise<MongoClient> {
  const uri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URL ||
    process.env.MONGODB_URL ||
    "";

  // Avoid throwing during build/module load; only throw when actually called.
  if (!uri) {
    throw new Error(
      "MONGODB_URI is required (set it in the container environment)"
    );
  }

  if (process.env.NODE_ENV === "development") {
    if (!global.__mongoClientPromise) {
      global.__mongoClientPromise = new MongoClient(uri).connect();
    }
    return global.__mongoClientPromise;
  }

  return new MongoClient(uri).connect();
}

export function getMongoDbName(): string {
  return (
    process.env.MONGODB_DB ||
    process.env.MONGO_DB ||
    process.env.MONGODB_DATABASE ||
    "dispatch"
  );
}

