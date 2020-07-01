/**
 * Login script that handles user creation and session based login on a server.
 * 
 * 	<script src="login.js"></script>
 * 
 * A login form will appear in the upper right corner. You can also create a new user. After a successful login
 * a logout link will appear.
 * 
 * You can disable buttons on a public page by using the class loginrequired.
 * 
 * To hide entire divs give them the class loginrequired.
 */

var loginusername="";
var timeout;
var loggedin=false;

//public function so the app can logout if session has timed out
function displayForms(loggedin){
	$("#logincreate").hide();
	$("#loginlogin")[0].reset();
	$("#logincreate")[0].reset();
	if(loggedin){
		$('div.loginrequired').fadeIn('slow');
		$('.loginrequired').prop('disabled', false);;
		$("#loginlogin").hide();
		if(loginusername) {$("#loginusername").text(loginusername);}
		$("#loginlogout").show();
	}else{
		$('div.loginrequired').hide(); 
		$('.loginrequired').prop('disabled', 'disabled');;
		$("#loginlogin").show();
		$("#loginlogout").hide();
		$("#loginlogin [name=name]").focus();
	}
}
function msg(message){
	try{
		popup(message);	//use nice popup if loaded
	}catch(e){
		alert(message);	//fallback to alerts
	};
}

function makeNewTimeout(loginfo){
	if (timeout){
		console.log("user action - clearing timer!");
		clearTimeout(timeout);
	}
	console.log("setting timer!");
	timeout = setTimeout(function () {
		if(loggedin){
			console.log("logout here!");
			$.post( "login", {action:'logout'});	//tell the server
			displayForms(false);	//tell the page
			msg("You have been logged out due to inactivity.");	//tell the user
		}
	}, (loginfo.timeout*1000));
}

function createLogin(loginfo){
	console.log(loginfo);
	if(loginfo && loginfo.timeout){
		console.log("got a timeout: " + loginfo.timeout);
		$("body").bind('input propertychange', function () { //auto save after 3 seconds idle
			makeNewTimeout(loginfo);
		});
		makeNewTimeout(loginfo);
	}
}

createLogin({"timeout":1800});	//default timeout

//this is done to avoid initial flicker on the page before the session login is checked
//$('head').prepend('<style type="text/css">div.loginrequired{display: none}</style>');
$('head').prepend('<style type="text/css">a {text-decoration:none;color:silver;float:right;margin:4px 4px 0px 0px;} a:hover {text-decoration:underline;color:black} div#loginstuff{float: right;background: #eee;border:1px solid #ddd;padding:5px;border-radius:4px; };</style>');
	
$(document).ready(function (){
	console.log('login.js loading');
	function printForms(){
		$("body").prepend("<div id='loginstuff'>" +
				"<form id='loginlogin' method='post' action='login'><input type='hidden' name='action' value='login'>" +
				"<input type='text' placeholder='name' name='name' required><br>" +
				"<input type='password' placeholder='password' name='password' required><br>" +
				"<input type='submit' value='login'>" +
					"<a class='createlink' href='#'>Create account</a>" +
				"</form>" +
				"<form id='loginlogout' method='post' action='login'><div id='loginusername'></div><input type='hidden' name='action' value='logout'><input type='submit' value='logout'></form>" +
				"<form id='logincreate' method='post' action='login'>Create account:<br><input type='hidden' name='action' value='create'>" +
				"<input type='text' placeholder='name' name='name' pattern='[\\S]+' title='No spaces please' required><br>" +
				"<input type='password' placeholder='password' name='password' pattern='[\\S]{5,50}' title='Minimum 5 characters, no spaces' required><br>" +
				"<input type='submit' value='create'>" +
				"<a class='createlink' href='#'>Login</a>" +
				"</form>" +
				"</div>" +
				//"<form id='logincheck' method='post' action='login'><input type='hidden' name='action' value='check'><input type='submit' value='check'></form>" + 
				"");
	}
	printForms();
	$(".createlink").click(function e(){
		$("#logincreate").animate({height:'toggle'});
		$("#loginlogin").animate({height:'toggle'});
	});
	$("form").submit(function (a,b,c){
		console.log('post');
		var target=a.delegateTarget.id;
		$.post( "login", $( this ).serialize())
			.done(function( data,b,c ) {
				loggedin=data.loggedin;
				console.log(loggedin);
				if(target=='loginlogin' && !loggedin){
					msg("Incorrect login!");
				}
			})
			.always(function( data ) {
				console.log(data);
				if(data.message){
					msg(data.message);
				}
				loginusername=$("#loginlogin [name=name]").val();
				//TODO: stay on create form if failed
				displayForms(loggedin);
			})
		;
		return false;
	});
	//let us see if the user is already logged in (session exists on server)
	$.post( "login", {action:'check'})
		.done(function( data,b,c ) {
			loggedin=data.loggedin;
			console.log(loggedin);
		})
		.always(function( data ) {
			displayForms(loggedin);
		})
	;

});