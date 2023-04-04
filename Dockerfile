FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 3001

CMD ["pnpm", "run", "start"]