FROM node:18.16-alpine3.16

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json yarn.lock ./

# Install app dependencies
RUN apk add --no-cache git \
    && yarn install --frozen-lockfile \
    && yarn cache clean

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN yarn build

EXPOSE 3000

# Start the server using the production build
CMD ["yarn", "start"]
