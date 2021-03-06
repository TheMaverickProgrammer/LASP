// Assign process name as an argument
process.title = process.argv[2];

/**
* Tests: 
  1) One trigger fetched                           -- YES. SongBird analyzes conditions.
  2) Trigger target exist                          -- YES. SongBird collects data and fires events.
  3) Trigger target doesn't exist                  -- YES. SongBird does not fire any events.
  4) Multiple triggers concurrently                -- TBD.
  5) Triggers with multiple condition requirements -- TBD.
  6) Triggers alert Twilio as well as fires events -- NO.
  7) SongBird allocates small memory on machine    -- TBD.
  8) Longest recorded SongBird uptime              -- 12 hours @ 7 triggers
*/

var request = require('request');
var fs      = require('fs');
var async   = require('async');
var twilio = require('twilio');
var twilioClient = twilio("AC41529d81bef2187807214c1def578206", "129d1b92a386618570bfaf2c1b1ed58d");

// var localhost = "localhost:8081"; 
var host = "216.186.148.128"+":8081";
var twilioNumber = "+17325080582";

// anonymous object SongBird.
({
	 // use Twilio to make calls
	 makeCall: function(url, number) {
	  
	   // Contact Twilio
       twilioClient.makeCall({
         url: url,
	     to: number,
	     from: twilioNumber
       }, function(err, data) {
       	 if (err) {
	       console.error('Could not make call.');
	       console.error(err);
	     } else {
	       console.log('Call completed to #' + data.to);
	     }
       });	 
	 },
	 
     // SongBird log
     log: function(buffer, from) {
 
          // TODO: Make this useful
          return;


          var filepath = "logs/songbird_logs.txt";

          oldBuffer = buffer + "\n\n";
   
          buffer = "========================================\n";
          buffer += "Time at " + new Date().toDateString() + " | system time: " + new Date().getTime() + "\n";
          if(from !== undefined){ buffer += "Logged from " + from + "\n" };
          buffer += "========================================\n";
          buffer += oldBuffer;

          if(!fs.existsSync(filepath)) {
              fs.closeSync(fs.openSync(filepath, 'w'));
              fs.writeFileSync(filepath, buffer);
          
              return;
          }

          // Otherwise append
          fs.appendFileSync(filepath, buffer);
     },
     
     checkPillboxTrigger: function(triggerData) {
     	var that = this;
     	
     	var triggerName = triggerData.name;
     	
     	var deviceID = triggerData.settings.deviceID;
     	
     	request.get('http://' + host + '/events/' + triggerName + '/today',
     	   {timeout: 100000}, 
     	   function (error, response, body) {
		     if (!error && response.statusCode == 200) {
		       var data = JSON.parse(body);
	           console.log("GET request data: " + body);
			 
			   if(data.length == 0) {
			   	 // No events, so fire
			     console.log("Event entry for pillbox not found. This will be the first time it has fired today.", "function checkCondition");
			     
			       request.get('http://' + host + '/pillboxes/' + deviceID + '/today',
			         {timeout: 100000}, 
			         function (error, response, body) {
			           if (!error && response.statusCode == 200) {
			             var data = JSON.parse(body);
			             console.log("GET request data: " + body);
			           
			           	   // Condition met
			           	   
			           	   var child = triggerData.settings.child;
			           	   var number = triggerData.number;
			           	   var notifyOutOfOrder   = triggerData.settings.notifyOutOfOrder;
			           	   var notifyAlreadyTaken = triggerData.settings.notifyAlreadyTaken;
				           var notifyCorrectDay   = triggerData.settings.notifyCorrectDay;
				
				           console.log("\nOUT: " + notifyCorrectDay);
				           
						   if(notifyCorrectDay == true) { 
						   	   console.log("checking to notify for today");
						   	   
						     var d = new Date();
							 var weekday = new Array(7);
							 weekday[0]=  "Sunday";
						     weekday[1] = "Monday";
							 weekday[2] = "Tuesday";
							 weekday[3] = "Wednesday";
							 weekday[4] = "Thursday";
							 weekday[5] = "Friday";
							 weekday[6] = "Saturday";
							 							
							 var n = weekday[d.getDay()];
							 
							 var fire = false;
							 
							 if(body.m == "1" && n == "Monday") { fire = true; }
							 else if(body.t == "1" && n == "Tuesday") { fire = true; }
							 else if(body.w == "1" && n == "Wednesday") { fire = true; } 
                             else if(body.r == "1" && n == "Thursday") { fire = true; }
							 else if(body.f == "1" && n == "Friday") { fire = true; }
							 else if(body.s == "1" && n == "Saturday") { fire = true; }
							 else if(body.u == "1" && n == "Sunday") { fire = true; }
							 
                             if(fire === true) {
								 // Make the call
								 that.makeCall('http://' + host +"/twilio/pillbox/taken/"+encodeURI(child)+"/"+n, number);
								 
								 // Log the event entry
								 var event = {
									 "name": name,
									 "timestamp": new Date().getTime()
								 };
								 
								 request({url: 'http://' + host + '/events/', method: "POST", json: event}, 
								   function (error, response, body) {
									 if (!error && response.statusCode == 200) {
										 console.log("event logged");
									 } else {
										 console.log("there was a problem logging the event");
									 }
								   }
								 );
						     } 
						     else 
						     {
                             	 that.makeCall('http://' + host +"/twilio/pillbox/wrongday/"+encodeURI(child), number);
						     }
					       }
					   } else {
					   	console.log("no events fired today");   
					   }
					 }
				  );
			   }
			 }
		   }
		 );
									
     },
     
     checkMovement: function(deviceID, number, child, eventName) {
       console.log("--checking for movement--");
     	 
       request.get('http://' + host + '/falls/' + deviceID + '/',
         {timeout: 100000}, 
     	 function (error, response, body) {
		   if (!error && response.statusCode == 200) {
		     var data = JSON.parse(body);
		     
		     console.log("GET request data check movement: " + body);
				 
		     if(data.length == 0) {
			   console.log("Falling entry not found. Trigger condition cannot be met.", "function checkCondition");
										
		       // Condition not met
		     }else {
			   // Condition met
			   
			   // Check if orientation is in motion
			   // orient = 0, when child has fallen
			   // orient = 1, when child is in motion
			   
			   if(data.orient === 0) {
			     // A period of time has passed, the child is still
			     // on the ground
			     // make call 
			     that.makeCall('http://' + host +"/twilio/fallen/"+encodeURI(child), number);
			     
				// Log the event entry
				 var event = {
					 "name": eventName,
					 "timestamp": new Date().getTime()
				 };
				 
				 request({url: 'http://' + host + '/events/', method: "POST", json: event},
				   function (error, response, body) {
					 if (!error && response.statusCode == 200) {
						 console.log("event logged");
					 } else {
						 console.log("there was a problem logging the event");
					 }
				   }
				 );
			   }
	         }
	       }
	     }
	   );
     },
     
     checkFallingTrigger: function(triggerData) {
     	 var that = this;
     	 
     	 var deviceID = triggerData.settings.deviceID;
     	 
     	 request.get('http://' + host + '/falls/' + deviceID + '/unchecked',
     	   {timeout: 100000}, 
     	   function (error, response, body) {
		     if (!error && response.statusCode == 200) {
				 var data = JSON.parse(body);
				 console.log("GET request data falling: " + body);
				 
				 if(data.length == 0) {
				   console.log("Falling entry not found. Trigger condition cannot be met.", "function checkCondition");
										
				   // Condition not met
				 }else {
					 // Condition met
					 
					 var eventName = triggerData.name;
					 var child = triggerData.settings.child;
					 var number = triggerData.number;
					 var responseTime = triggerData.settings.responseTime;
					 
					 console.log("== response time: " + responseTime + " ==");
					 
					 // Set a timer to check to see if the child has moved before we make a call
					 if(responseTime === 'undefined' || responseTime == 0) {
					   console.log(">>> CALLING NOW <<<");
						// make call NOW
					   that.makeCall('http://' + host +"/twilio/fallen/"+encodeURI(child), number)
					 } else {
						 // Wait to see if child stands up (NOTE: responeTime is in seconds)
						 // Convert to milliseconds
						 setTimeout(function() {
						   that.checkMovement(deviceID, number, child, eventName);
						 },
						   responseTime*1000
						 );
					 }
					 
					 // flag the fall as already checked
					 request.post('http://' + host + '/falls/' + deviceID + '/check', 
					   {timeout: 100000},
					   function(error, response, body) {
						   if(!error && response.statusCode == 200) {
							   console.log("posted");
						   }
					   }
					 );
					 
					 // Log the event entry
					 var event = {
						 "name": eventName,
						 "timestamp": new Date().getTime()
					 };
					 
					 request({url: 'http://' + host + '/events/', method: "POST", json: event},
					   function (error, response, body) {
						 if (!error && response.statusCode == 200) {
							 console.log("event logged");
						 } else {
							 console.log("there was a problem logging the event");
						 }
					   }
					 );
			     }
			 }
		   });
     },
     
     checkAlarmTrigger: function(triggerData) {
     	 
     },
     
     // types = [pillbox, falls, alarm]
     checkTrigger: function(triggerData, buffer) {
         var type = triggerData.type;
         
         switch(type) {
         case "pillbox":
         	 return this.checkPillboxTrigger(triggerData);
         	 break;
         case "falling":
         	 return this.checkFallingTrigger(triggerData);
         	 break;
         case "alarm":
         	 return this.checkAlarmTrigger(triggerData);
         	 break;
         }
         
         return false;
     },

     // Go through each trigger in the response. Log data.
     checkTriggers: function(JSONdata) {
         var data = JSON.parse(JSONdata);

         if(data.length == 0) {
             this.log("Collection was empty. No Triggers to check.", "function checkTriggers");
             return;
         }

         console.log("checking triggers...");
         console.log(JSON.stringify(data));

         var buffer = "";
         
         for(var i = 0; i < data.length; i++) {
             if(this.checkTrigger(data[i], buffer)) {
             	 // log the event
				var data = {"triggerName": data[i].name, "timestamp": new Date().getTime().toString()};
				console.log(JSON.stringify(data));
				request.post({url: 'http://' + host +'/events', form: data}, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						buffer += "Logged event\n";
						console.log("logged event...");
					}
				 });	 
             }
         }

         this.log(buffer, "function checkTriggers");
     },

    // function to poll the API. This is the heartbeat of SongBird.
    tick: function() {
        var that = this;
        request.get('http://' + host + '/triggers/list', {timeout: 100000}, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // console.log(JSON.stringify(body)) // Show the JSON response
                var JSONdata = body;
                that.checkTriggers(JSONdata);
                that.log("statusCode 200", "function tick");

                console.log("should be passing off the work...");
            }

            if (error && error.code === 'ETIMEDOUT') {
                var msg = 'Time out for GET http://' + host + '/triggers/list';
                console.log(msg);
                that.log(msg, "function tick");
            }

            // Another one every 1 second
            setTimeout(that.tick(), 50000);
        });
     }
}).tick(); //.makeCall(host+"/twilio/pillbox/wrongday/Mason", "3342216912"); 
