FROM alpine:3.16

RUN apk add --no-cache --update nodejs npm && \
    addgroup -S node && adduser -S node -G node

USER node

WORKDIR /home/node/app

COPY --chown=node:node backend/ ./
RUN npm ci

CMD ["node", "index.js"]
