#!/bin/bash
# Author: Maverick Peppers
# Date: 2/11/2016 @ 10:39 AM
# Description: Pass the IP address as the first script argument $1
#              and replace all instances of %IP_ADDRESS% in "*.js.template"
#              files with the assigned IP address. Creates a new file called
#              "app.js" to be run with npm
ip="\"$1\""

if [ -z "$ip" ]
  then
    echo "No argument supplied"
else
    sed "s/%IP_ADDRESS%/$ip/g" index.js.template > index.js
fi
