ARG NODE_VERSION=24.8.0-alpine3.22
ARG NGINX_VERSION=alpine3.22

# Use a lightweight Node.js image for building (customizable via ARG)
FROM node:${NODE_VERSION} AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package-related files first to leverage Docker's caching mechanism
COPY package.json package-lock.json ./

# Install project dependencies using npm ci (ensures a clean, reproducible install)
RUN --mount=type=cache,target=/root/.npm npm ci
RUN npm i @angular/cli

# Copy the rest of the application source code into the container
COPY . .

# Build the Angular application
RUN npm run build 


FROM node:${NODE_VERSION}

# Copy only what’s needed from build
COPY --from=builder /app/dist/*/ /app/dist
COPY --from=builder /app/package*.json /app/

# If you want, create a non-root user (for security)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose the SSR port (adjust if different)
EXPOSE 4000

# Set environment (optional)
ENV NODE_ENV=production

# Start the SSR server
CMD ["node", "app/dist/server/server.mjs"]
