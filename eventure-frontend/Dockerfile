# Stage 1
FROM node:18.16.0-alpine3.17 AS build
WORKDIR /app
COPY package*.json .
COPY yarn*.lock .
RUN yarn install
COPY . .
RUN yarn build

# Stage 2
FROM nginx:1.19.0
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/dist .
ENTRYPOINT ["nginx", "-g", "daemon off;"]
