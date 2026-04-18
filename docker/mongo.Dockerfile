# syntax=docker/dockerfile:1

# Custom MongoDB image with init scripts baked in.
# Init scripts run ONLY on first startup when /data/db is empty.
FROM mongo:7

COPY mongo-init.js /docker-entrypoint-initdb.d/mongo-init.js

