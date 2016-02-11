#!/bin/bash
echo "===== SHUTTING DOWN LASP ====="
$(cd ./LASP/LASPAPI/ ; sh ./NODE_SCRIPT.sh stop)
echo "    LASP API        STOPPED   "
$(cd ./LASP/LASPDash/ ; sh ./NODE_SCRIPT.sh stop)
echo "    LASP Dashboard  STOPPED   "
$(cd ./LASP/LASPSongBird/ ; sh ./NODE_SCRIPT.sh stop)
echo "    LASP SongBird   STOPPED   "
echo "                              "
echo "=====   LASP STOPPED     ====="
$SHELL
