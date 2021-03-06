/*
Author's note: Alerts = Triggers in the LASP API
*/

// "216.186.148.128" is generated through a bash script. Result is output as "page-script.js".
var host = "216.186.148.128"+":8081"; 

// DOM Ready =============================================================
$(document).ready(function() {
    
    $("[type='checkbox']").bootstrapSwitch();
    
    $('.clockpicker').clockpicker();
    
    var weekLineOpt = {
      dayLabels: ["U", "M", "T", "W", "R", "F", "S"],
      mousedownSel: true,
      startDate: null,
      onChange: null,
      theme: "white"
    };
    
    $("#weekCal").weekLine(weekLineOpt);
		
    // Save alert button click
    $('#btnSaveAlert').on('click', addAlert);

    // Cancel alert button click
    $('#btnCancelAlert').on('click', cancelAlert);
  
    // Cancel conditions modal take care of by bootstrap
    
    // Populate the alert table on initial page load
    populateTable();

    // Register delete button
    registerDeleteButton();
});

// Functions =============================================================

// Prepar conditions viewing modal
function prepareConditionsViewingModal() {

	$("#conditionLink").on('click', function(event) {
			
	  event.preventDefault(); // Do not bring the DOM to the top of the page
	  
	  var content = $(this).find('meta[name=conditionInfo]').attr("content");
	  
	  // Replace modal body with this trigger condition info
	  $("#seeCondition").html(content);
	  
	  // Bring up the modal by triggering a click event on the hidden button
	  $("#btnViewCondition").trigger('click');
	});
}

// Cancel Alert
function cancelAlert(event) {
	// Clear the form inputs
	$('#addAlert input').each(function(index) {
		$(this).val('');
	});
}

function addPillboxAlert() {
    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    if($('#pillboxAlertName').val() === '') { errorCount++; }
    if($('#pillboxAlertChild').val() === '') { errorCount++; }
    if($('#pillboxAlertNumber').val() === '') { errorCount++; }
    if($('#pillboxAlertDeviceID').val() === '') { errorCount++; }
                
    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all alert info into one object   
        var newPillboxAlert = {
        	'type': "pillbox",
            'name': $('#pillboxAlertName').val(),
            'number': $('#pillboxAlertNumber').val(),
            'settings': {
              'child': $('#pillboxAlertChild').val(),
              'deviceID': $('#pillboxAlertDeviceID').val(),
              'notifyOutOfOrder': $('#pillboxAlertNotifyOutOfOrder').is(':checked'),
              'notifyAlreadyTaken': $('#pillboxAlertNotifyAlreadyTaken').is(':checked'),
              'notifyCorrectDay': $('#pillboxAlertNotifyCorrectDay').is(':checked')
            }
        }

        // Use AJAX to post the object to our alert service
        $.ajax({
            type: 'POST',
            data: JSON.stringify(newPillboxAlert),
            url: 'http://' + host + '/triggers/',
            dataType: 'JSON',
            contentType: 'application/json'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#pillbox input').each(function(index) {
                    $(this).val('');
                });
                
                $('#pillbox input:checkbox').removeAttr('checked');

                // Update the table
                populateTable();
                registerDeleteButton();
            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);
            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all the fields for the pill box alert');
        return false;
    }
}

function addAlarmAlert() {
    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    if($('#alarmAlertName').val() === '') { errorCount++; }
    if($('#alarmAlertNumber').val() === '') { errorCount++; }
    if($('#alarmAlertTime').val() === '') { errorCount++; }
                
    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all alert info into one object   
        var newAlarmAlert = {
        	'type': 'alarm',
            'name': $('#alarmAlertName').val(),
            'number': $('#alarmAlertNumber').val(),
            'settings': {
              'time': $('#alarmAlertTime').is(':checked'),
              'days': "",
              'weekly': $('#alarmAlertNotifyWeekly').is(':checked')
            }
        }

        // Use AJAX to post the object to our alert service
        $.ajax({
            type: 'POST',
            data: JSON.stringify(newAlarmAlert),
            url: 'http://' + host + '/triggers/',
            dataType: 'JSON',
            contentType: 'application/json'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#alarm input').each(function(index) {
                    $(this).val('');
                });
                
                $('#alarm input:checkbox').removeAttr('checked');

                // Update the table
                populateTable();
                registerDeleteButton();
            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);
            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all the fields for the alarm alert');
        return false;
    }
}

function addFallsAlert() {
	// Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    if($('#fallingAlertName').val() === '') { errorCount++; }
    if($('#fallingAlertChild').val() === '') { errorCount++; }
    if($('#fallingAlertNumber').val() === '') { errorCount++; }
    if($('#fallingAlertDeviceID').val() === '') { errorCount++; }
    if($('#fallingAlertResponseTime').val() === '') { errorCount++; }
                
    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all alert info into one object   
        var newFallingAlert = {
        	'type': 'falling',
            'name': $('#fallingAlertName').val(),
            'number': $('#fallingAlertNumber').val(),
            'settings': {
              'responseTime': $('#fallingAlertResponseTime').val(),
              'child': $('#fallingAlertChild').val(),
              'deviceID': $('#fallingAlertDeviceID').val()
            }
        }

        // Use AJAX to post the object to our alert service
        $.ajax({
            type: 'POST',
            data: JSON.stringify(newFallingAlert),
            url: 'http://' + host + '/triggers/',
            dataType: 'JSON',
            contentType: 'application/json'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#falling input').each(function(index) {
                    $(this).val('');
                });

                // Update the table
                populateTable();
                registerDeleteButton();
            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);
            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all the fields for the falling alert');
        return false;
    }
}

// Add Alert
function addAlert(event) {
    event.preventDefault();
    
    console.log("saving alert");
    
    // determine which alert is created
    var tabUrl = $("ul.nav-tabs > li.active > a").get(0) + "";
    var poundLoc = tabUrl.indexOf("#");
    var selectedTabStr = tabUrl.substring(poundLoc+1, tabUrl.length);
    console.log(selectedTabStr);
    
    switch(selectedTabStr) {
		case "pillbox":
			return addPillboxAlert();
		break;
		case "alarm":
			return addAlarmAlert();
			break;
		case "falling":
			return addFallsAlert();
			break;
	}
};

// Delete Alert
function deleteAlert(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this alert?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our DELETE /alerts/{name}
        $.ajax({
            type: 'DELETE',
            url: 'http://' + host + '/triggers/' + $(this).find("#linkdeletealert").first().attr('name')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();
        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( 'http://' + host + '/triggers/list', function( data ) {

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            alertsListData = data;
            tableContent += '<tr>';
            tableContent += '<td class="col-sm-1 name">' + this.name + '</a></td>';
            tableContent += '<td class="col-sm-1">' + '<a id="conditionLink" href="#"><meta name="conditionInfo" content=' + JSON.stringify(this) + '>click to view</a>' + '</td>';
            tableContent += '<td class="col-sm-2"><div class="delete btn btn-danger"><meta id="linkdeletealert" name="' + this.name + '">delete</meta></div></td>';
            tableContent += '<td class="col-sm-2"><input type="checkbox" data-role="flipswitch" name="switch" id="switch"></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#alertsList table tbody').html(tableContent);
         
        // Turn checkboxes into switches
        /*$("input[type=checkbox]").switchButton({
		  checked: false
		});*/
		
		// Prepare the condition viewing modal
		prepareConditionsViewingModal();
    });
};

// Register delete buttons
function registerDeleteButton() {
    // unbind all events from the cue
    $('tbody').unbind();

    // Delete Pillbox button click
    $('tbody').on('click', '.delete', deleteAlert);
}
