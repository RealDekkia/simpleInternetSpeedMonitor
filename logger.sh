#! /bin/bash

#Config:
dbHost="localhost"
dbUser="userName"
dbPassword="-pPassword" #Add -p in to the beginning of your password.
dbName="internetspeed"

res=$(speedtest-cli --simple)

res1=$(echo "$res" | sed -n '1p'| cut -d" " -f2)
res2=$(echo "$res" | sed -n '2p'| cut -d" " -f2)
res3=$(echo "$res" | sed -n '3p'| cut -d" " -f2)

em=" "

date=$(date "+%Y-%m-%d")$em$(date "+%H:%M:%S")
#echo "$date"

#endRes=$date$res1$d$res2$d$res3

#echo "$endRes" >> speedLog/logFile.csv

mysql -h $dbHost  -u $dbUser $dbPassword $dbName << EOF
INSERT INTO internetspeed.log (ID, measureTime, ping, up, down) VALUES (NULL, '$date', '$res1', '$res2', '$res3');
EOF
