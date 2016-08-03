angular.module('phonecatFilters', []).filter('checkmark', function() {
  return function(input) {
	  var acc=input[0].statuses[input[0].statuses.length-1].fte;
	  input["acc"]=acc;
    return input;
  };
});