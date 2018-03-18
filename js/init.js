var LoadedEvent;


/* initialisation of events */
$(document).ready(function() {

    $('.event-click').on('click',  function (e) {
        e.preventDefault();

        /* getting action from param */
        var action = $(this).data("action");
        var func = "event_call_" + action;

        try {
            /* call of funciton */
            window[func]($(this));

        } catch (e) {

            throw new Error('function not exists: ' + func + ' message: ' + e.message);
            return false;
        }
    });
});


(function($){
  $(function(){

    $('.button-collapse').sideNav();

    $('.datepicker').pickadate({
          selectMonths: true, // Creates a dropdown to control month
          selectYears: 15, // Creates a dropdown of 15 years to control year,
          today: 'Today',
          clear: 'Clear',
          close: 'Ok',
          format: 'dd.mm.yyyy',
          closeOnSelect: false // Close upon selecting a date,
    });

    $.getJSON( "events.json", function( data ) {
        LoadedEvent = data;
        generateSelect("#event_type");
        $("#progress").hide();
        $("#generated-content").toggleClass("hide");
    });



  }); // end of document ready
})(jQuery); // end of jQuery name space


function generateSelect(id) {
    var options="";
    var i = 0;
    $.each( LoadedEvent.events, function( key, event ) {
        options += "<option value=\""+ i +"\">"+ event.name +"</option>";
        i++;
    });
    console.log(id);
    $(id).html(options);
    $('select').material_select();

}


$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

function event_call_submit(self){

    var settings;
    var data;

    /* processing if from is defined */
    var form = self.data("form");
    var method = self.data("function");

    console.log($(form));

    if(typeof form !== "undefined"){
        data = $(form).serializeObject();
        settings = {displayErrorMessage: $(form+"-error")};

        if(!$(form)[0].checkValidity()){
            settings.displayErrorMessage.html("Please fill all fields");
            return false;
        }else{
            //alert(1);
        }

    }
    
    /* dynamicaly call method in api based on attribute method */
    var res = window[method](data, settings);
}





function calendarGenerate(data, settings){

    var event = LoadedEvent.events[data.event_type];
    event.date = data.event_date;
    event.name = data.event_name;

    //console.log(event.date);

    var cal = ics();





    $.each( event.deadlines, function( key, deadline ) {
        var momentEvent = moment(event.date, "DD.MM.YYYY");
        //console.log(momentEvent.format());
        var date = momentEvent.relativeTime(deadline.date).format();;
        //console.log(deadline.title, date);
        cal.addEvent("["+event.name+"]"+deadline.title, deadline.steps, "", date, date);
    });
    //cal.download(event.name);
    //var momentEvent = moment(event.date, "dd.mm.yyyy");


}