# syntax=docker/dockerfile:1

# I copied and edited the dockerfile here:
# https://docs.docker.com/guides/nodejs/

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# This Dockerfile uses Docker Hardened Images (DHI) for enhanced security.
# For more information, see https://docs.docker.com/dhi/

# ---------- Build frontend ----------
FROM dhi.io/node:24-alpine3.23-dev AS frontend-build
WORKDIR /client

# Install dependencies as a separate step to take advantage of Docker's
# caching. Leverage a cache mount to /root/.npm to speed up subsequent
# builds. Leverage a bind mount to package.json to avoid having to copy
# it into this layer.
RUN --mount=type=cache,target=/root/.npm \
    --mount=type=bind,source=client/package.json,target=package.json \
    --mount=type=bind,source=client/package-lock.json,target=package-lock.json \
    npm ci

# Copy the source code into the container and compile TypeScript.
COPY ./client ./
RUN npm run build

# ---------- Build backend ----------
FROM dhi.io/node:24-dev AS backend-build
WORKDIR /server
RUN --mount=type=cache,target=/root/.npm \
    --mount=type=bind,source=server/package.json,target=package.json \
    --mount=type=bind,source=server/package-lock.json,target=package-lock.json \
    npm ci

# Copy the source code into the container and compile TypeScript.
COPY ./server ./
RUN npm run build

# ---------- Get only production-needed dependencies ----------
FROM dhi.io/node:24-dev AS prod-dependencies
WORKDIR /prod
RUN --mount=type=cache,target=/root/.npm \
    --mount=type=bind,source=server/package.json,target=package.json \
    --mount=type=bind,source=server/package-lock.json,target=package-lock.json \
    npm ci --omit=dev

# ---------- minimal runtime image with compiled app and production deps ----------
FROM dhi.io/node:24-dev AS runner
WORKDIR /app

COPY --from=prod-dependencies --chown=node:node /prod/node_modules ./server/node_modules

WORKDIR /app/server
ENV PLAYWRIGHT_BROWSERS_PATH=/app/server/ms-playwright
RUN npx playwright install --with-deps firefox && \
    chown -R node:node ${PLAYWRIGHT_BROWSERS_PATH}

WORKDIR /app
COPY --from=frontend-build --chown=node:node /client/dist ./client/dist
COPY --from=backend-build --chown=node:node /server/dist ./server/dist

USER node

# Expose the port that the application listens on.
EXPOSE 8000

# Run the application.
CMD ["node", "server/dist/main.js"]