FROM node:18-alpine as builder

WORKDIR /app

RUN npm install -g pnpm

COPY package*.json ./

RUN pnpm install --force

COPY . .

RUN pnpm run build

EXPOSE 4000

CMD ["pnpm", "run", "dev"]
