#!/bin/bash
# Author: Maverick Peppers
# Date: 2/11/2016 @ 10:47 AM
# Description: uses npm to launch the server
# Arguments: "start" and "stop"  
command=$1
if [ -z "$command" ];
  then
    echo "No argument supplied"
elif [ $command = "start" ]
  then
  	npm start
elif [ $command = "stop" ]
  then
  	npm stop
else
    echo "Unknown argument \"$command\" suppied";
fi
