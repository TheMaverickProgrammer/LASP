var request = require('request');
var fs      = require('fs');
var step    = require('step');

// anonymous object SongBird.
({
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
     
     checkCondition: function(conditionData, triggerName, buffer) {
         var rate  = conditionData.rate;
    
         var status = false; // Condition has not been met
        
         // If the trigger timer has reached it's timeout
         step(function() {                 
         var isTimeToFire = false;

         request.get('http://localhost:3000/events/' + triggerName + '/latest', {timeout: 10000}, function (error, response, body) {

             if (!error && response.statusCode == 200) {


                 var data = JSON.parse(body);
 
                 if(data.length == 0) {
                     console.log("Event not found. Should be first time firing if conditions met.", "function checkCondition");
                     isTimeToFire = true;
                     return true;
                 }

                 // undetermined
                 if(!isTimeToFire) {
                     // Check time stamp
                     var lastFireTime = data.timestamp;
 
                     // Now - then = time passed. Has enough time passed to fire an event?
                     var lapsed = new Date().getTime() - lastFireTime;

                     console.log(lapsed);

                     if(lapsed >= rate) { 
                         isTimeToFire = true;
                     }
                 }
             }
       });      

             return isTimeToFire;
 }, function(err, res) {
                 var isTimeToFire = res;

                 console.log("next step isTimeToFire:" + isTimeToFire);

                 // Last check
                 if(isTimeToFire) {
			 // Otherwise...
		         // Now that we know we should fire, continue checking if the conditions are met...

				 var collection = conditionData.collection;
				 var property   = conditionData.property;
				 var operator   = conditionData.operator;
				 var value      = conditionData.value;

				 if(collection == "pillboxes") {
				     var deviceUID = conditionData.deviceUID;             

				     // Build an API query using the conditions
				     request.get('http://localhost:3000/' + collection + '/' + deviceUID + '', {timeout: 10000}, function (error, response, body) {

					if (!error && response.statusCode == 200) {
					    var data = JSON.parse(body);
			 
					    if(data.length == 0) {
						console.log("Pillbox not found. Trigger condition cannot be met.", "function checkCondition");
						return;
					    }

					    if(operator === "=") { 
						// console.log(JSON.stringify(data[0][property]));

						if(data[0][property] == value) {
                                                     status = true; // condition met...
                                                     return true;
						}
					    }
					}
				     });     
				 } 
                 }
                 else
                 {
                     console.log("Not time to fire...");
                     return false;
                 }
             }
         );

       // else { /* Problem with the HTTP call */ }
         //});

         return status;
     },

     // Grab individual trigger info and check conditions, aggregate log info, and fire events
     checkTrigger: function(triggerData, buffer) {
         buffer += "Trigger name captured: " + triggerData.name + "\n";

         var conditions = triggerData.conditions; // array

         /* Conditions take the following example structure.
          * 
          * { "collection": "pillboxes", 
          *   "deviceUID" : "333",
          *   "property"  : "m",
          *   "operator"  : "=",
          *   "value"     : "true"
          *         ... 
          * }
          */

         var matchedCount = 0;

         // console.log("There are " + conditions.length + " conditons");

         for(var i = 0; i < conditions.length; i++) {
             step (
                 this.checkCondition(conditions[i], triggerData.name, buffer),
                 function check(err, res) {
                     if(err) {console.log("err"); return;}

                     if(res == true) {
                         matchedCount++;
                     }
                 }
              )
         }

         // If the query values match the condition rules, log an event
         if(matchedCount == conditions.length) {

            var data = {"triggerName": triggerData.name, "timestamp": new Date().getTime().toString()};
            console.log(JSON.stringify(data));
            request.post({url: 'http://localhost:3000/events', form: data}, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    buffer += "Logged event\n";
console.log("logged event...");
                }

                 // Contact RestComm
             });
         }
     },

     // Go through each trigger in the response. Log data.
     checkTriggers: function(JSONdata) {
         var data = JSON.parse(JSONdata);

         if(data.length == 0) {
             this.log("Collection was empty. No Triggers to check.", "function checkTriggers");
             return;
         }

         console.log("checking triggers...");

         var buffer = "";
         
         for(var i = 0; i < data.length; i++) {
             this.checkTrigger(data[i], buffer);
         }

         this.log(buffer, "function checkTriggers");
     },

    // function to poll the API. This is the heart of SongBird.
    tick: function() {
        var that = this;
        request.get('http://localhost:3000/triggers/list', {timeout: 10000}, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // console.log(JSON.stringify(body)) // Show the JSON response
                var JSONdata = body;
                that.checkTriggers(JSONdata);
                that.log("statusCode 200", "function tick");

                //console.log("should be passing off the work...");
            }

            if (error && error.code === 'ETIMEDOUT') {
                var msg = 'Time out for GET http://localhost:3000/triggers/list';
                console.log(msg);
                that.log(msg, "function tick");
            }

            // Another one
            that.tick();
        });
     }
}).tick();