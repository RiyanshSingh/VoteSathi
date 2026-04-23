# Stage 1: Build the React app
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Add build arguments for Vite environment variables
ARG VITE_GEMINI_API_KEY
ARG VITE_GROQ_API_KEY

# Set them as environment variables so Vite can pick them up during build
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY
ENV VITE_GROQ_API_KEY=$VITE_GROQ_API_KEY

RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Add custom Nginx config to handle SPA routing (redirect all to index.html)
RUN echo 'server { \
    listen 8080; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
