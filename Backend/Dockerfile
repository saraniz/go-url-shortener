# =====================================================
# Step 1: Build Stage
# =====================================================
FROM golang:1.26-alpine AS builder

# Install build dependencies
RUN apk add --no-cache git

# Set working directory
WORKDIR /app

# Copy dependency files first for caching
COPY go.mod go.sum ./

# Download all Go module dependencies
RUN go mod download

# Copy the entire backend directory source files
COPY . .

# Build a static, lightweight compiled binary for Linux
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# =====================================================
# Step 2: Production Execution Stage
# =====================================================
FROM alpine:latest  

# Add security updates and ca-certificates for safe HTTPS requests
RUN apk --no-cache add ca-certificates tzdata

WORKDIR /app

# Copy the compiled binary from the build environment
COPY --from=builder /app/main .

# Copy the env file optionally (glob avoids failing if env is injected by host)
COPY --from=builder /app/.env* ./

# Expose Go API Server default port
EXPOSE 8080

# Execute the application binary
ENTRYPOINT ["./main"]
