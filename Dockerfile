FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN yarn
COPY . .
EXPOSE 3000
CMD ["node", "dist/main.js"]
