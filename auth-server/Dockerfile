FROM node:alpine AS build
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run compile

FROM node:alpine AS production
WORKDIR /app
COPY package*.json .
RUN npm ci --only=production
COPY --from=build /app/build ./dist
EXPOSE 8080
CMD ["node", "dist/src/index.js"]