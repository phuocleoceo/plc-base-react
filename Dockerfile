FROM node:18-alpine as builder

WORKDIR /app
COPY . /app

RUN npm install
RUN npm run build

FROM nginx:1.25
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]