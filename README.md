# Simple internet speed Monitor

This is a *very* simple Speed monitor for your Internet-connection.
I'm using Javascript, [ChartJS](https://github.com/chartjs/Chart.js), HTML and CSS (+Bootstrap) for the frontend
and MySQL, nodeJS and the Linux Shell for the backend.

I will add more functionality when I feel like it.

## Setup

### backend nodeJS-server
+ After donwloading the Newest version from Github navigate to the Server-Folder and run "npm install" to install all dependencies
```shell
cd server
npm install
```

+ Now you can change your Server-Settings in the "config.json"-file in the Server-Folder

### backend shell-script

+ Make "logger.sh" executable 
```shell
chmod +x logger.sh
```
+ Change the Config at the beginning of logger.sh

### backend misc

+ You need to have NodeJS, MySQL and speedtest-cli installed on your machine
```shell
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
apt-get install -y speedtest-cli mysql-server build-essential nodejs
```

+ When setting up  MySQL, make shure the User(s) in the config-files match the one(s) you add

### frontend

+ As you may have guessed, there's also a config for the frontend: it's at the beginning of server/public/js/main.js

## Notes

After following the Setup-Procedure it should work. Or maybe it won't. You can ask me for help but I can't guarantee I'll help you. (But it's worth a try)

I maybe should add that this software wasn't tested that much. It's based on something I have running on my Rasperry Pi, but I made a hand full of changes bevore putting it on Github.