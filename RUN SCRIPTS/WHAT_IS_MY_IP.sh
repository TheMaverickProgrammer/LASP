#! /bin/bash
echo "===== FETCHING GLOBAL IP ====="
echo " THIS MAY TAKE SEVERAL MINUTES"
ip=$(curl ipecho.net/plain)
echo "           DONE               "
echo "     IP IS $ip                "
$SHELL
