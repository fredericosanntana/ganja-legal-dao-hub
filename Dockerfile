# Use an official Bun image as a parent image
FROM oven/bun:1 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and bun.lockb
COPY package.json bun.lockb ./

# Install dependencies
# Use --frozen-lockfile to ensure reproducible builds if bun.lockb is present and up-to-date
RUN bun install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN bun run build

# Stage 2: Serve the application
FROM oven/bun:1-slim AS final

WORKDIR /app

# Copy built assets from the build stage
COPY --from=build /app/dist ./dist
COPY package.json ./

# Install only production dependencies for preview, if any, or just vite for previewing
# Since vite is a devDependency, and we need it for preview, we install it here.
# A more optimized approach might be to use a static web server like nginx or caddy if `vite preview` is not strictly needed for production.
RUN bun add vite

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
# Use --host to expose the server on all network interfaces within the container
CMD ["bun", "run", "preview", "--host", "0.0.0.0", "--port", "8080"]
