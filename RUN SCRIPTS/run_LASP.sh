#!/bin/bash
echo "===== BOOTING LASP ====="
node ./LASP/LASPAPI/bin/www LaspAPIApp &
echo "    LASP API       OK   "
node ./LASP/LASPDash/bin/www LASPDashApp &
echo "    LASP Dashboard OK   "
node ./LASP/LASPSongBird/index.js SongBirdApp &
echo "    LASP SongBird  OK   "
echo "                        "
echo "===== LASP RUNNING ====="
$SHELL
