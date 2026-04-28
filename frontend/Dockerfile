# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

# Valeur par défaut (docker-compose). En K8s: BACKEND_UPSTREAM=backend-service:5000
ENV BACKEND_UPSTREAM=backend:5000

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]