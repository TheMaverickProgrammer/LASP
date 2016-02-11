########################################################                                                  
#                                                      #
#  .        .    .-. .--.                         .    #
#  |       / \  (   )|   )               o       _|_   #
#  |      /___\  `-. |--'   .,-. .--..-. . .-. .-.|    #
#  |     /     \(   )|      |   )|  (   )|(.-'(   |    # 
#  '---''       ``-' '      |`-' '   `-' | `--'`-'`-'  #
#                           |            ;             #
#                           '         `-'              #
#                                                      #
########################################################
# Author: Maverick Peppers
# Date: 2/11/2016 @ 1:04 PM
# Description: This project was rather complex.
#              It has been accompanied by startup scripts
#              that can be executed by congregated scripts
#              on the desktop. This README demonstrates
#              how to configure, run, stop, and make 
#              minor configurations to LASP for demo
#              purposes.
#
#              If you have any questions or would like
#              to use any code, please contact
#
#              bmpeppers@gmail.com

////////////////////////////////////////////////////////
TO RUN A SCRIPT:
  - Maverick has configured the startup scripts to 
    execute when double-clicked. A dialog box will pop
    up.
  - Click "Open in Terminal". 
  - DO NOT CLOSE the window until the script is done.
  - DO NOT CLOSE the window for "run_LASP.sh" script.
    This window is required to stay open to run 
    the 3 servers. Closing this window prematurely 
    can cause future problems.
  - RUN "stop_LASP.sh" script before 
    closing "run_LASP.sh" window

////////////////////////////////////////////////////////
BEFORE YOU DO ANYTHING. TAKE NOTE:
  - CALL MAVERICK on GOOGLE HANGOUTS when the server is 
    configured so he can set the IP address for the server 
    on Twilio. Otherwise calls will not be made.
  - RUN the program "WHAT_IS_MY_IP.sh" found on the desktop.
  - Tell Maverick what the output says. 
  - Engineers MUST configure their devices to send API calls
    to this IP. 

////////////////////////////////////////////////////////
FIRST YOU MUST CONFIGURE THE LASP ENVIRONMENT:
  - RUN the program "config_LASP.sh" found on the desktop

////////////////////////////////////////////////////////
2ND TO START LASP:
  - RUN the program "run_LASP.sh" found on the desktop.
  - Open firefox web browser found at the top of the 
    screen. 
  - Point your browser to "http://localhost:3030" for
    the dashboard
  - Point your browser to "http://localhost:8081" for
    the API
  - SongBird runs quietly in the background

////////////////////////////////////////////////////////
3RD TO STOP LASP:
  - RUN the program "stop_LASP.sh" found on the desktop.

////////////////////////////////////////////////////////
TO EDIT CHART LABELS:
  - Right-click and edit "link to labels.txt"
  - Only edit the text on the right-side of the file
  - You must include quotes
  - Save and exit
  - Refresh your browser
  - Changes should take place immediately 


