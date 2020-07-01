/*
	popup.js: Will display a popup that automatically disappears on the top of the screen. If multiple popups they will be placed below each other.
	
<script src="//tools.ttsoftware.dk/popup.js"></script>
You can optionally set how long time it is displayed and how long time it should fadeout over. Default display time is 1 second with a 2 second fadeout
You can override the styles if you do not like the default values, i.e: .popupmessage {background: silver;}
KNOWN BUGS: The width of the popup is dependent on the other popups???

examples:
	popup("Default popup");
	popup("Quick stop",1000,1);
	popup("5 second display",5000);
*/

function popup(msg, displaytime, removetime){
	if(!displaytime){displaytime=1000;}
	if(!removetime){removetime=2000;}
	var p=$("<div class='popupmessage'></div>");
	$("#popuparea").append(p);
	p.show();
	p.text(msg);
	console.log(msg);
	setTimeout(function() {
		p.fadeTo( removetime , 0, function() {
			p.animate({height:'toggle'}, function(e){$(this).remove();});
		});
	},displaytime);
}

$(document).ready(function e(){
	$('head').prepend('<style type="text/css">#popuparea {position: absolute; top: 30px; left: 40px;}</style>');
	$('head').prepend('<style type="text/css">.popupmessage {background: orange; color: white; position: relative; font-size: 22pt; border-radius: 7px; padding: 5px; margin: 5px;}</style>');
	$("body").prepend("<div id='popuparea'></div>");
});