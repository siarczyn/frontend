FROM node:20

WORKDIR /app

COPY package.json package-lock.json ./
COPY tsconfig.json tsconfig.json
COPY public public

RUN npm install
COPY . .

EXPOSE 3000

# Start the app
CMD ["npm", "start"]
