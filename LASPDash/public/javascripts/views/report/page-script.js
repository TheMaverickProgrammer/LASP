// DOM Ready =============================================================
$(document).ready(function() {
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

    /*bathing   = calculateCategoryCollection("bathing", 4, 0.09),
    comm      = calculateCategoryCollection("communication", 4, 0.55),
    cooking   = calculateCategoryCollection("cooking", 4, 0.09),
    dressing  = calculateCategoryCollection("dressing", 4, 0.09),
    eating    = calculateCategoryCollection("eating", 4, 0.09),
    grooming  = calculateCategoryCollection("grooming", 4, 0.07),
    housework = calculateCategoryCollection("housework", 4, 0.07),
    laundry   = calculateCategoryCollection("laundry", 4, 0.07),
    mm        = calculateCategoryCollection("medication_management", 4, 0.07),
    shopping  = calculateCategoryCollection("shopping", 4, 0.055),
    toileting = calculateCategoryCollection("toileting", 4, 0.09),
    transferring = calculateCategoryCollection("transferring", 4, 0.09),
    walking   = calculateCategoryCollection("walking", 4, 0.07)*/
    /*calculateCategoryCollection("bathing", 4, 0.09),
    calculateCategoryCollection("communication", 4, 0.55),
    calculateCategoryCollection("cooking", 4, 0.09),
    calculateCategoryCollection("dressing", 4, 0.09),
    calculateCategoryCollection("eating", 4, 0.09),
    calculateCategoryCollection("grooming", 4, 0.07),
    calculateCategoryCollection("housework", 4, 0.07),
    calculateCategoryCollection("laundry", 4, 0.07),
    calculateCategoryCollection("medication_management", 4, 0.07),
    calculateCategoryCollection("shopping", 4, 0.055),
    calculateCategoryCollection("toileting", 4, 0.09),
    calculateCategoryCollection("transferring", 4, 0.09),
    calculateCategoryCollection("walking", 4, 0.07)*/

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

    // Make med. management easy to read
    mmRet.label = "Medication";

    var factors_array = [bathingRet, commRet, cookingRet, dressingRet, eatingRet,
                         groomingRet, houseworkRet, laundryRet, mmRet, shoppingRet,
                         toiletingRet, transferringRet, walkingRet];

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
   console.log("overallScore: " + overallScore);

    var opts = {
        container: document.getElementById("viz"),
            userdata: { hoverevents : true, factors: factors_array},
	    showLabels : true,
            zoomTime: 1000,
	    healthRange: {
		lower : 50,
		upper : 70
	    },
            overallScore: Math.floor(overallScore)
	};

	console.log(opts);
	graph = new HGraph(opts);
	graph.width = 760;
	graph.height = 602;
	graph.initialize();
        graph.calculateHealthScore();

	$('#viz').on('click', function(e){
            var posX = $(this).position().left,
                posY = $(this).position().top;
                 
            var mx = e.pageX - posX;
            var my = e.pageY - posY;

            console.log(graph.isZoomed)
	    if (graph.isZoomed)
	        graph.zoomOut();
	    else
	        graph.zoomIn(2.2,  $(this).position().left,  $(this).position().right);
	});

	$("#zoom_btn").click(function(){
		var s = graph.isZoomed;
		if(!s){
			$(this).find("span").addClass("zoomed");
			graph.zoomIn();
		}else{
			$(this).find("span").removeClass("zoomed");
			graph.zoomOut();
		}
	});

	$("#connector_btn").click(function(){
		var t = false;
		if(!t){
			$(this).find("span").addClass("toggled");
                        t = true;
		} else {
			$(this).find("span").removeClass("toggled");
                        t = false;
		}
	});

	function focusFeature( f, e ){

		for(var key  in graph.layers){
			var p = graph.layers[key];
			if( e == key ){ 
				p.transition()	
					.duration(120)
					.ease("cubic")
					.attr("opacity",1.0);
					continue;
			}
			p.transition()	
				.duration(120)
				.ease("cubic")
				.attr("opacity",0.1);
		}
		if(f == "points"){
			for(var i in graph[f]){
				graph[f][i]
					.transition()
					.duration(1200)
					.ease("elastic")
					.attr("r",graph.getPointRadius()*1.5);
			}
		} else {
			graph[f].transition()
				.duration(1200)
				.ease("elastic")
				.attr("transform","scale(1.5)");
		}
	};

	function returnToNormal( f ){
		if(f == "points"){
			for(var i in graph[f]){
				graph[f][i]
					.transition()
					.duration(1200)
					.ease("elastic")
					.attr("r",graph.getPointRadius());
			}
		} else {
			graph[f].transition()
				.duration(1200)
				.ease("elastic")
				.attr("transform","scale(1.0)");
		}
	};

	function returnall(){
		for(var key  in graph.layers){
			var p = graph.layers[key];
			p.transition()	
				.duration(120)
				.ease("cubic")
				.attr("opacity",1.0);
		}
	};

	function atEnd( which ){
		var btn = (which > 0) ? "#next_info" : "#prev_info";
		$(".novis").removeClass("novis");
		$(btn).addClass("novis");
	};

	function inMiddle(){
		$(".novis").removeClass("novis");
	};

	$('.graph_nav_opt').on("mousedown",function(){
		$(this).removeClass("grad1").addClass("grad2");
	}).on("mouseup",function(){
		$(this).removeClass("grad2").addClass("grad1");
	});
	//*//

	function closeInfo(){
		returnall();
		returnToNormal("points");
		returnToNormal("overalltxt");
		returnToNormal("ring");	
		c = 0;
		var d = c * (-760);
		$("#info_slider").stop().animate({
			"left":(d+"px")
		},300);
		atEnd(c);
	};

	$("#info_btn").click(function(){
		var r = $(this).hasClass("risen");
		if(!r){
			$("#info_panel").stop().animate({
				"bottom" : "400px"
			},300);
			$(this).addClass("risen");
		} else {
			$("#info_panel").stop().animate({
				"bottom" : "-600px"
			},300);
			closeInfo();
			$(this).removeClass("risen");
		}

	});
    }); // end then()

    // console.log("about to resolve");
    var units = "30-day moving average";

    bathing.resolve(calculateCategoryCollection("bathing", units, 0.09));
    comm.resolve(calculateCategoryCollection("communication", units, 0.55));
    cooking.resolve(calculateCategoryCollection("cooking", units, 0.09));
    dressing.resolve(calculateCategoryCollection("dressing", units, 0.09));
    eating.resolve(calculateCategoryCollection("eating", units, 0.09));
    grooming.resolve(calculateCategoryCollection("grooming", units, 0.07));
    housework.resolve(calculateCategoryCollection("housework", units, 0.07));
    laundry.resolve(calculateCategoryCollection("laundry", units, 0.07));
    mm.resolve(calculateCategoryCollection("medication_management", units, 0.07));
    shopping.resolve(calculateCategoryCollection("shopping", units, 0.055));
    toileting.resolve(calculateCategoryCollection("toileting", units, 0.09));
    transferring.resolve(calculateCategoryCollection("transferring", units, 0.09));
    walking.resolve(calculateCategoryCollection("walking", units, 0.07));
});

function calculateCategoryCollection(name, value, weight) {
    var ret = {label: name, size: 0, score: 0, value: value, actual: 0, weight: weight};
    var details = [];

//    console.log("about to query data");

    /* jQuery AJAX call for JSON */
    $.ajax({
       type: 'GET',
       url: 'http://localhost:3000/' + name + '/list', 
       dataType: 'json',
       success: function( data ) {
        // For each item in our JSON ... add up the averages
        $.each(data, function(){
            ret.actual += parseInt(data[0].Score);
//console.log("score: " + data[0].Score);
            ret.size++;

//console.log("actual: " + ret.actual);

            if(ret.size > 0) {
                ret.score = ret.actual / ret.size;
            }

            if(Math.random() * 10 > 9.988) {
                var d = ret;
                d.value = "latest";
                details.push(d); // DEMO ONLY
            }
        });
       },
       data: {},
       async: false
     });

     ret.details = details;
     //ret.value = "30 day avg";
       
     // Get the latest update as the fine detail for hGraph
/*
     ret.details = []; 
     var detail = {label: name, score: 0, actual: 0, value: "latest score"};

    // jQuery AJAX call for JSON 
    $.ajax({
       type: 'GET',
       //url: 'http://localhost:3000/' + name + '/latest', 
       url: 'http://localhost:3000/' + name + '/latest', 
       dataType: 'json',
       success: function( data ) {
        
        // For each item in our JSON ... add the details
        if(data !== null) { 
            detail.score = parseInt(data.Score);
            detail.value = detail.score + detail.value;
            ret.details.push(detail);
        }

        console.log(JSON.stringify(data));
       },
       data: {},
       async: false
     });
       */

   // console.log("recieved data");

   return ret;
}
