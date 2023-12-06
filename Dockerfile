FROM node:18-alpine as builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

FROM nginx:1.25

# Copy config nginx
COPY --from=builder /app/.nginx/nginx.conf /etc/nginx/conf.d/default.conf

# nginx static assets workdir
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy production build into nginx
COPY --from=builder /app/dist .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]