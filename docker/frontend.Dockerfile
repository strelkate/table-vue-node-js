FROM nginx:1.23.1-alpine

COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/conf.d /etc/nginx/conf.d

COPY ./frontend/dist/ /var/www/