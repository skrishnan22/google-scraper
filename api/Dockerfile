
FROM node:18

# Install Puppeteer dependencies
RUN apt-get update \
 && apt-get install -y chromium \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
    --no-install-recommends


WORKDIR /usr/src/app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium


COPY package*.json ./

COPY prisma ./prisma

EXPOSE 3000

RUN npm install

RUN npx prisma generate

RUN npx prisma migrate deploy

COPY . .

CMD ["node", "index.js"]
