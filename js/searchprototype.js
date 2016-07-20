$(function() {
	var protoTypeSearchJS=function(event){
	  event.preventDefault();
	  var q = $("#searchPrototypeInput").val();
	  var postdata = 'q=' + encodeURIComponent(q);
	  postdata += '&searchfrom=ls';
	  var lastError = null;
	  var lastErrorStr = null;
	  $.ajax({
        url: 'inc/csodSearch',
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        async: false,
        cache: false,
        timeout: 90000, /* 90 seconds */
        data: postdata,
		dataType: 'json',
        error:   function (request, status, error) {
                   if (window.console) console.log(status + ': ' + request.responseText);
                   lastError = error;
                   lastErrorStr = 'Server Error: ' + status + ': ' + request.responseText;
				   alert(request.responseText);
                 }, //end error
        success: function(jsonResponse) {
                    lastError = 0;
                    lastErrorStr = '';
                    alert(jsonResponse.status + ': ' + jsonResponse.message);
                 } //end success
      }); //end ajax

	};
	$('#searchPrototypeButton').click(protoTypeSearchJS);
	$("#searchPrototypeInput").keypress(function(e) {
      if(e.which == 13) {
		$('#searchPrototypeButton').click();
      } //end if
    });
});