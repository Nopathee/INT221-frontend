FROM nginx:alpine
 
COPY dist/ /usr/share/nginx/html/
COPY web-server.conf /etc/nginx/conf.d/default.conf