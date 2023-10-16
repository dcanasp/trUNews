FROM node:18-alpine
#a donde va, no de donde viene
WORKDIR /trunews

COPY . .

RUN npm run init

EXPOSE 3005

CMD npm run production
