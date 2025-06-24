FROM nginx:1.27.5

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /var/cache/nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]