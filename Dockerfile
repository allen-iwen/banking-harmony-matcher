
# 第一阶段：构建React应用
FROM node:16 AS build

WORKDIR /app

# 复制package.json和lockfile
COPY package*.json ./
RUN npm install

# 复制源代码并构建
COPY . .
RUN npm run build

# 第二阶段：使用Nginx提供静态文件
FROM nginx:alpine

# 复制构建产物
COPY --from=build /app/dist /usr/share/nginx/html

# 配置Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
