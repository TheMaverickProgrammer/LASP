#!/bin/bash
echo "=====   CONFIGURE LASP   ====="
# Fetch IP
echo "      FETCHING GLOBAL IP      "
echo "THIS MAY TAKE SEVERAL MINUTES " 
ip=$(curl ipecho.net/plain)
# Run scripts to assign IP to js templates
echo "        RUNNING SCRIPTS       "
$(cd ./LASP/LASPAPI/ ; sh ./REPLACE_IP.sh $ip)
echo "  LASP API           DONE     "
$(cd ./LASP/LASPDash/ ; sh ./REPLACE_IP.sh $ip)
echo "  LASP Dash          DONE     "
$(cd ./LASP/LASPSongBird/ ; sh ./REPLACE_IP.sh $ip)
echo "  LASPSongBird       DONE     "
# Generate new js files
echo "        JS GENERATED          "
echo "=====  CONFIG COMPLETE   ====="
$SHELL
