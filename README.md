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

