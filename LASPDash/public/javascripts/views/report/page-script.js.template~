// Page globals
var myLineGraph = [];

// label to category <--> category to label
var collections = [];

function labelToCat(label) {
	return collections[label];
}

function catToLabel(cat) {
	for(var item in collections) {
	  if(!collections.hasOwnProperty(item)) continue;
	  
	  if(collections[item] == cat) {
	  	  return item;
	  }
	}
}

function labelToResource(label) {
    var apiResources = {
	"bathingLabel":               "bathing",
	"communicationLabel":         "communication",
	"cookingLabel":               "cooking",
	"dressingLabel":              "dressing",
	"eatingLabel":                "eating",
	"groomingLabel":              "grooming",
	"houseworkLabel":             "housework",
	"laundryLabel":               "laundry",
	"medication_managementLabel": "medication_management",
	"shoppingLabel":              "shopping",
	"toiletingLabel":             "toileting",
	"transferringLabel":          "transferring",
	"walkingLabel":               "walking" 
	};
	
	return apiResources[label];
}

// var host = "192.168.1.207:8081"; // LOCAL IP TO API
// var host = "107.204.112.61:8081"; // PUBLIC IP TO API (spring hill, TN)
//var host = "192.168.2.107:8081";
var host = "216.186.148.128:8081";

// DOM Ready =============================================================
$(document).ready(function() {
	
	// Load the labels
	$.ajax({
	   type: 'GET',
	   url: '/data/labels.txt',
	   dataType: 'json',
	   success: function( data ) {	
		   collections = data; // json object
		   // console.log(collections["bathingLabel"]);
	   },
	   data: {},
	   async: false
	});
				
	$("#info_btn").on('click', function() { 
			$("#myLinegraphModalBtn").trigger("click");
	});
		
	prepareTimelineModal();
	
    var bathing = $.Deferred(), 
        comm = $.Deferred(), 
        cooking = $.Deferred(), 
        dressing = $.Deferred(), 
        eating = $.Deferred(), 
        grooming = $.Deferred(), 
        housework = $.Deferred(), 
        laundry = $.Deferred(),
        mm = $.Deferred(), 
        shopping = $.Deferred(), 
        toileting = $.Deferred(), 
        transferring = $.Deferred(), 
        walking = $.Deferred();

    var time = new Date().getTime();

    $.when(
    bathing,
    comm,
    cooking,
    dressing,
    eating,
    grooming,
    housework,
    laundry,
    mm,
    shopping,
    toileting,
    transferring,
    walking
    ).done(function(bathingRet, commRet, cookingRet, dressingRet, eatingRet, 
                    groomingRet, houseworkRet, laundryRet, mmRet, shoppingRet,
                    toiletingRet, transferringRet, walkingRet) {
 
		var lapsed = new Date().getTime();
	
		console.log("Time to fetch data: " + ((lapsed - time)/1000) + "s");
	
		var factors_array = [bathingRet, commRet, cookingRet, dressingRet, eatingRet,
							 groomingRet, houseworkRet, laundryRet, mmRet, shoppingRet,
							 toiletingRet, transferringRet, walkingRet];
							 
		var factors_labels = [];
		var factors_score = [];
				
		for(var i = 0; i < factors_array.length; i++) {
		    factors_labels.push(factors_array[i].label);	
		    factors_score.push(factors_array[i].score);	
		}
		
		var overallScore = (bathingRet.score * bathingRet.weight) + 
						   (commRet.score * commRet.weight) + 
						   (cookingRet.score * cookingRet.weight) + 
						   (dressingRet.score * dressingRet.weight) + 
						   (eatingRet.score * eatingRet.weight) + 
						   (groomingRet.score * groomingRet.weight) + 
						   (houseworkRet.score * houseworkRet.weight) + 
						   (laundryRet.score * laundryRet.weight) + 
						   (mmRet.score * mmRet.weight) + 
						   (shoppingRet.score * shoppingRet.weight) + 
						   (toiletingRet.score * toiletingRet.weight) + 
						   (transferringRet.score * transferringRet.weight) + 
						   (walkingRet.score * walkingRet.weight);
	
		console.log("building graph...");
		
		// TODO: Make this dynamically read in data from the the API
		// - Reads in labels
		// 
		var radarChartData = {
			labels: factors_labels,
			datasets: [
				{
					label: "30 Day Average Dataset",
					fillColor: "rgba(139, 149, 185, 0.2)",
					strokeColor: "rgba(220,220,220,1)",
					pointColor: "rgba(104, 146, 69, 1)",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(220,220,220,1)",
					data: factors_score
				}
			]
		};
		
		var ctx = $("#canvas").get(0).getContext("2d");
		
		var myRadar = new Chart(ctx).Radar(radarChartData, {
				responsive: true
		});
		
		ctx.font = "48px serif";
        ctx.fillText("Hello world", 0, 0);
        
        // TODO: Change baseLine to a calculated result. Ask Steve;
        var baseLine = 10;
        
        // Depending on the threshold, the score determines the point's color on the graph
        var minYellow = {
        	"bathingLabel"       : baseLine - 2,
        	"communicationLabel" : baseLine - 4,
        	"cookingLabel"       : baseLine - 2,
        	"dressingLabel"      : baseLine - 2,
        	"eatingLabel"        : baseLine - 2,
        	"groomingLabel"      : baseLine - 4,
        	"houseworkLabel"     : baseLine - 4,
        	"laundryLabel"       : baseLine - 2,
        	"medication_managementLabel"    : baseLine - 2,
        	"shoppingLabel"      : baseLine - 4,
        	"toiletingLabel"     : baseLine - 2,
        	"transferringLabel"  : baseLine - 2,
        	"walkingLabel"       : baseLine - 2
        };
  

        for(var i = 0; i < myRadar.datasets[0].points.length; i++) {
        	var point = myRadar.datasets[0].points[i];
        	
        	if(point.value >= baseLine) {
        		point.fillColor =  "lightgreen";
        	} else if(point.value >= minYellow[catToLabel(point.label)]) {
        		point.fillColor =  "yellow";
        	} else {
        		point.fillColor =  "red";
        	}
        	
        	myRadar.datasets[0].points[i] = point;
        }
        
        // Update the chart
        myRadar.update();
 
	    prepareRadarChart(myRadar);
    }); // end then()

    // console.log("about to resolve");
    var units = "30-day moving average";

    bathing.resolve(calculateCategoryCollection("bathing", labelToCat("bathingLabel"), units, 0.09));
    comm.resolve(calculateCategoryCollection("communication", labelToCat("communicationLabel"), units, 0.55));
    cooking.resolve(calculateCategoryCollection("cooking", labelToCat("cookingLabel"), units, 0.09));
    dressing.resolve(calculateCategoryCollection("dressing", labelToCat("dressingLabel"), units, 0.09));
    eating.resolve(calculateCategoryCollection("eating", labelToCat("eatingLabel"), units, 0.09));
    grooming.resolve(calculateCategoryCollection("grooming", labelToCat("groomingLabel"), units, 0.07));
    housework.resolve(calculateCategoryCollection("housework", labelToCat("houseworkLabel"), units, 0.07));
    laundry.resolve(calculateCategoryCollection("laundry", labelToCat("laundryLabel"), units, 0.07));
    mm.resolve(calculateCategoryCollection("medication_management", labelToCat("medication_managementLabel"), units, 0.07));
    shopping.resolve(calculateCategoryCollection("shopping", labelToCat("shoppingLabel"), units, 0.055));
    toileting.resolve(calculateCategoryCollection("toileting", labelToCat("toiletingLabel"), units, 0.09));
    transferring.resolve(calculateCategoryCollection("transferring", labelToCat("transferringLabel"), units, 0.09));
    walking.resolve(calculateCategoryCollection("walking", labelToCat("walkingLabel"), units, 0.07));
});

function calculateCategoryCollection(name, label, value, weight) {
    var ret = {label: label, size: 0, score: 0, value: value, actual: 0.0, weight: weight};
    var details = [];

//    console.log("about to query data");

    /* jQuery AJAX call for JSON LAST 30 DAYS*/
    $.ajax({
       type: 'GET',
       url: 'http://' + host + '/' + name + '/recent/' + 30, 
       dataType: 'json',
       success: function( data ) {
        // For each item in our JSON ... add up the averages
        $.each(data, function(i){
            ret.actual += parseFloat(data[i].Score);
            
//console.log("score: " + data[0].Score);
            ret.size++;

//console.log("actual: " + ret.actual);

            if(ret.size > 0) {
                ret.score = ret.actual / ret.size;
            }

            /*if(Math.random() * 10 > 9.988) {
                var d = ret;
                d.value = "latest";
                details.push(d); // DEMO ONLY
            }*/
        });
       },
       data: {},
       async: false // TODO: Make async and use a callback
     });

     ret.details = details;
     ret.score = ret.score.toFixed(1);

   return ret;
}

function prepareTimelineModal() {
	$modal = $("#myModalLinegraph");
	
	$modal.unbind(); // unbind all events
	
	$modal.on('shown.bs.modal', function() {
		/*
		1 - Generate x number of canvases 
		2 - Use ajax to query for the category data
		3 - Plot the data on an associated graph on the modal
		4 - On hide, empty all html content in the dom
		*/
        
        var html = "";
        
        var i = 0;
        for(var label in collections) {
        	if(!collections.hasOwnProperty(label)) continue;
        	
        	html += "<canvas id='linegraph"+(i+1)+"' height='200' width='450'></canvas>\n<br>\n";
        	i++;
        }
        
        $("#multipleLinegraphs").html(html);
        
        // Wipe all (if any) graph data	
		for(var i = 0; i < myLineGraph.length; i++) {
			if(myLineGraph[i] !== null) { myLineGraph[i].destroy(); }
		}
		
		myLineGraph = [];
	
        // reset i to 0 for next loop
        i = 0;
        for(var label in collections) {
        	if(!collections.hasOwnProperty(label)) continue;
        	
        	console.log($("#linegraph"+(i+1))[0]);
        	console.log(labelToResource(label));
        	
        	loadTimelineModal($("#linegraph"+(i+1))[0].getContext("2d"), labelToResource(label));
        	
        	i++;
        }
	});

	$modal.on('hidden.bs.modal', function() {
		$("#multipleLinegraphs").html(''); // '' effectively empties the DOM Element
	});
}

function prepareCategoryHistory(collection) {
	$modal = $("#myModal");
	
	$modal.unbind(); // unbind all events
	
	$modal.on('shown.bs.modal', function() {
		/*
		  Load history of category onto the modal
		*/
		var $elem = $("#categoryHistory").get(0);
		$elem.toggleClass('active');
		
		loadHistoryModel($elem, collection);
	});
}

// Prepare for `onclick` events
function prepareRadarChart(radarChart) {
	var canvas = $("#canvas");
	
	canvas.on('click', function(evt){
		var activePoints = radarChart.getPointsAtEvent(evt);
		
		if(activePoints !== "undefined") {
			var point = null;
			
			if(activePoints.length > 0) {
				point = activePoints[0];
			} else {
				// Something is wrong. Bail.
				return;
			}
		  
			// point.label is the label for the chart, which is actually
			// our user defined category name provided in `/data/labels.txt`
			// We must find the true label by going from cat -> label
			// Then we must find the corresponding resource name for our API calls
			// by going from label -> resource
			// collection name = cat -> label -> resource
		    var collection = labelToResource(catToLabel(point.label));
		  
		    console.log("collection: " + collection);
		    
		    // prepare the history modal
		    var $elem = $("#categoryHistory");
		    
		    loadHistoryModal($elem, collection);
		  
		    // now invoke the modal
		    $("#myModalBtn").trigger('click');
		}
    });
};

function loadTimelineModal(ctx, collection) {
	
	/* 
	 - Plot the most recent week (7 points)
	 - Plot the moving avg of the month (7 point)
	 - Plot the moving avg of the year  (7 points)
	 */
	
	var year = "365"; 
	
	var year_items  = [];
	var month_items = [];
	var week_items  = [];
			
	var items       = [];
	var item_labels = [];
	
	 /* jQuery AJAX call for JSON */
	 
    $.ajax({
       type: 'GET',
       url: 'http://' + host + '/' + collection + '/recent/' + year, 
       dataType: 'json',
       success: function( data ) {
       	   // For each item in our JSON ... plot it in the graph
       	   $.each(data, function(i){
       	       items.push(data[i].Score);
       	       item_labels.push(data[i].Time);
       	   });
       	   
       	   // Take the 365 points and turn it into the graph detailed above.
       	   var res = generateReadableGraphData(items, item_labels);
       	   year_items  = res.new_year_items;
       	   month_items = res.new_month_items;
       	   week_items  = res.new_week_items;
       	   item_labels = res.new_item_labels;
       	   
       },
       data: {},
       async: false // TODO: Make async and use a callback
    });
    	   
    // Create a line graph using the data
	var lineGraphData = {
	labels: item_labels,
	datasets: [
				{
					label: "Moving Avg. Year Dataset",
					fillColor : "rgba(0,255,0,0.2)",
					strokeColor : "rgba(0,255,0,1)",
					pointColor : "#4DA6D6",
					pointStrokeColor : "#fff",
					pointHighlightFill : "#f00",
					pointHighlightStroke : "rgba(220,220,220,1)",
					data: year_items
				},
				{
					label: "Moving Avg. Month Dataset",
					fillColor : "rgba(255,255,0,0.2)",
					strokeColor : "rgba(255,255,0,1)",
					pointColor : "#4DA6D6",
					pointStrokeColor : "#fff",
					pointHighlightFill : "#f00",
					pointHighlightStroke : "rgba(220,220,220,1)",
					data: month_items
				},
				{
					label: "Week Dataset",
					fillColor : "rgba(225,0,0,0.2)",
					strokeColor : "rgba(225,0,0,1)",
					pointColor : "#4DA6D6",
					pointStrokeColor : "#fff",
					pointHighlightFill : "#f00",
					pointHighlightStroke : "rgba(220,220,220,1)",
					data: week_items
				}
			]
		};
		
	var myLineChart = new Chart(ctx).LineAlt(lineGraphData, {
	  showTooltips: false,
	  responsive: false
	});
	
	for(var i = 0; i < myLineChart.datasets[0].points.length; i++) {
		var point = myLineChart.datasets[0].points[i];
		
		// make it hidden
		point.fillColor =  "rgba(0,0,0,0)";
		
		myLineChart.datasets[0].points[i] = point;
	}
	
	for(var i = 0; i < myLineChart.datasets[1].points.length; i++) {
		var point = myLineChart.datasets[1].points[i];
		
		// make it hidden
		point.fillColor =  "rgba(0,0,0,0)";
		
		myLineChart.datasets[1].points[i] = point;
	}
	
	myLineGraph[myLineGraph.length] = myLineChart;
}

function loadHistoryModal($elem, collection) {
	
	/* 
	 - Display the most recent events in the tables (9 recent entries)
	 */
	
	var recentAmt = "9"; 
	
	 /* jQuery AJAX call for JSON */
    $.ajax({
       type: 'GET',
       url: 'http://' + host + '/' + collection + '/recent/' + recentAmt, 
       dataType: 'json',
       success: function( data ) {	
       	   var newHTML = "<h4>"+labelToCat(collection+"Label")+"</h4>";
       	   newHTML += "<table>";
	
       	   // For each item in our JSON ... plot it in the graph
       	   $.each(data, function(i){
       	       var html = "<tr><td class='col-sm-2'>" + data[i].Time + "</td>";
       	       html += "<td class='col-sm-1'>" + data[i].Score + "</td></tr>";
       	       
       	       newHTML += html; // append strings
       	   });
       	   
       	   newHTML += "</table>"; // table terminate tag
       	   
       	   // $elem.toggleClass('active'); // Stop spinner from spinning
       	   
       	   $elem.html(newHTML);
       },
       data: {},
       async: false // TODO: Make async and use a callback
    });
}

/*
  Returns a JSON object `res` = { `new_items`, `new_item_labels` };
*/
function generateReadableGraphData(items, item_labels) {
		
	/* 
	 - Keep the most recent week (7 points)
	 - Calculate the moving avg of the month (7 point)
	 - Calculate the moving avg of the year  (7 points)
	 */
	 
	 var WINDOW_SIZE = 7;
	 
	 var res = {new_year_items: [], new_month_items: [], new_week_items: [], new_item_labels: []};
	 
	 	 	 
	 // Seperate the recent year
	 var year_items = items;
	 var year_labels = item_labels;
	 
	 // Calculate the moving avg 
	 // Window size 7 (returns array)
	 year_items = calculateMovingAverage(year_items, WINDOW_SIZE);
	 
	  // Keep only 7*2 points (for smoothness)
	 var skip = Math.floor(year_items.length / (WINDOW_SIZE*2));
	 
	 var new_year_items = [];
	 var new_year_labels = [];
	 
	 // We select evenly-spaced out year points
	 var i = 0;
	 
	 for(i = 0; i < year_items.length; i += skip) {
	   new_year_items.push(year_items[i]);
	   new_year_labels.push(year_labels[i]);
	 }
	 
	 console.log("skip: " + skip + ". i: " + i);
	 
	 // Seperate the recent month
	 var month_items  = items.slice(0, 29);
	 var month_labels = item_labels.slice(0,29);
	 
	 // Calculate the moving avg 
	 // Window size 7 (returns array)
	 month_items = calculateMovingAverage(month_items, WINDOW_SIZE);
	 
	 // Keep only 7*2 points (for smoothness)
	 skip = Math.floor(month_items.length / (WINDOW_SIZE*2));
	 
	 var new_month_items = [];
	 var new_month_labels = [];
	 
	 // Pad month array with null values from year length
	 // NOTE: This is purposefully done for the LineGraph from the ChartJS lib
	 for(var i = 0; i < new_year_items.length; i++) {
	 	 new_month_items.push(null);
	 }
	 
	 // Now that the arrays are padded with the correct amount of null values,
	 // fill in the rest of the month arrays with month data (moving avg. data)
	 var j = 0;
	 for(var i = 0; i < month_items.length; i += skip) {
	   new_month_items[j + new_year_items.length] = month_items[i];
	   new_month_labels[j] = month_labels[i];
	   
	   j++;
	 }
	 
	 // Seperate the recent week
	 var week_items  = items.slice(0, 6);
	 var week_labels = item_labels.slice(0, 6);
	 
	 console.log("week_items: " + JSON.stringify(week_items));
	 
	 var new_week_items = [];
	 var new_week_labels = [];
	 
	 // Pad week array with null values from month length 
	 // REMEMBER: month length is year length + original month data length
	 for(var i = 0; i < new_month_items.length; i++) {
	 	 new_week_items.push(null);
	 }
	 
	 // NOTE: We do not skip through the code,
	 // we need ALL of the week
	 for(var i = 0; i < week_items.length; i += 1) {
	   new_week_items[i + new_month_items.length] = week_items[i];
	   new_week_labels[i] = week_labels[i];
	 }
	 
	 console.log("new_week_items: " + JSON.stringify(new_week_items));
	 
	 // span the new labels TODO: Remove this
	 var label_length = new_week_items.length;
	 

	 var new_labels = Array.apply(null, Array(new_year_labels.length + new_month_labels.length + new_week_labels.length)).map(String.prototype.valueOf,"");
	 
	 /*new_labels[0] = new_year_labels[0];
	 new_labels[new_year_labels.length-1] = new_year_labels[new_year_labels.length-1];
	 new_labels[new_year_labels.length-1] = new_year_labels[new_year_labels.length-1];
	 new_labels[new_year_labels.length] = new_month_labels[0];
	 new_labels[new_year_labels.length + (new_month_labels.length-1)] = new_month_labels[new_month_labels.length-1];
	 
	 for(var i = 0; i < new_week_labels.length; i++) {
	   new_labels[new_year_labels.length + new_month_labels.length + i] = new_week_labels[i];	 
	 }*/
	 
	 // Store them in the result
	 res.new_year_items  = new_year_items;
	 res.new_month_items = new_month_items;
	 res.new_week_items  = new_week_items;
	 
	 // Finally, the labels
	 res.new_item_labels = new_labels;
		 
	 // Return
	 return res;
}

function calculateMovingAverage(items, item_window_size) {
	
	if(item_window_size <= 0)
	{
		return [];
	}
	
	var index = 0;
	
	var res_items = [];
	
	while(index + item_window_size < items.length) {
		
		var total = 0;
		
		// Add up the items in this buffer (window)
		// Number of items will be `item_window_size`
		for(var counter = 0; counter < item_window_size; counter++) {
			total += items[counter+index];
		}
		
		res_items.push(total / item_window_size);
		
		index++; // Move the window over to the right by one item
	}
	
	return res_items;
}