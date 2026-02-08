FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

# Using --port 3000 and --host to make it accessible outside the container
CMD ["npm", "run", "preview", "--", "--port", "3000", "--host", "0.0.0.0"]
