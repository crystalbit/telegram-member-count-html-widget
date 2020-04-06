# telegram-member-count-html-widget
It is created for Russian 3d makers against covid19 community

There are several telegram groups for different regions.

Task is to watch the member count of each group and to provide embed html code to be put on external website.

NodeJS, express.js and MongoDB

# parts
* consumer - a telegram bot, which should be an administrator of telegram chats. Monitors member count, writes to database.
* server - express.js server providing embed html code with a map.

# commands
start consumer: `npm run consumer`

start server: `npm run server`

# nginx config for using with ssl
```
server {
        listen 80 default_server;
        listen [::]:80 default_server;

        location / {
                return 301 https://$host$request_uri;
        }
}

server {
        listen 443 ssl default_server;
        listen [::]:443 ssl default_server;

        ssl_certificate ...;
        ssl_certificate_key  ...;

        root /var/www/html;

        index index.html index.htm index.nginx-debian.html;

        server_name _;

        location / {
                proxy_set_header  X-Real-IP $remote_addr;
                proxy_pass http://localhost:8000;
        }
}
```
