#! /bin/bash

#Config:
dbHost="localhost"
dbUser="userName"
dbPassword="-pPassword" #Add -p in to the beginning of your password.
dbName="internetspeed"

res=$(speedtest --format=json --unit=Mibps)

res1=$(echo "$res" | jq '.ping.latency')
res2=$(expr $(echo "$res" | jq '.upload.bandwidth') / 131072)
res3=$(expr $(echo "$res" | jq '.download.bandwidth') / 131072)

em=" "

date=$(date "+%Y-%m-%d")$em$(date "+%H:%M:%S")
#echo "$date"

mysql -h $dbHost  -u $dbUser $dbPassword $dbName << EOF
INSERT INTO internetspeed.log (ID, measureTime, ping, up, down) VALUES (NULL, '$date', '$res1', '$res2', '$res3');
EOF
