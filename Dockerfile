# =====================================================
# Step 1: Build Stage (compiles the Go backend)
# =====================================================
FROM golang:1.26-alpine AS builder

# Install build dependencies
RUN apk add --no-cache git

# Set working directory in container
WORKDIR /app

# Copy the Backend go dependency definitions first to utilize caching
COPY Backend/go.mod Backend/go.sum ./Backend/

# Navigate to the Backend folder and download dependencies
WORKDIR /app/Backend
RUN go mod download

# Copy the rest of the Backend source files
WORKDIR /app
COPY Backend/ ./Backend/

# Build a statically linked Go binary
WORKDIR /app/Backend
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# =====================================================
# Step 2: Runtime Stage (lightweight alpine container)
# =====================================================
FROM alpine:latest  

# Add security updates and timezone settings
RUN apk --no-cache add ca-certificates tzdata

WORKDIR /app

# Copy the compiled binary from the build environment
COPY --from=builder /app/Backend/main .

# Copy the env file optionally if present
COPY --from=builder /app/Backend/.env* ./

# Expose Go server port
EXPOSE 8080

# Execute the application binary
ENTRYPOINT ["./main"]
