<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%><!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"> 
	<script type="text/javascript" src="https://code.jquery.com/jquery-2.1.0.min.js"></script>
	<script src="popup.js"></script>
	<script src="login.js"></script>
	<script src="//ttsoftware.dk/util.js"></script>
	<style type="text/css">.popupmessage {background: silver;}</style>	<!-- override popup style -->
	
<script type="text/javascript">
	$(document).ready(function e() {
		console.log("ready");
		$("#logout").click(function e() {
			displayForms(false);	//logout
			popup("You have been logged out!");
			return false;
		});
		$("#output").on('click', "li", function() {
			var json=JSON.parse($(this).html());
			$("#oid").val(json._id.$oid);
			$("#data").val(JSON.stringify(json, null,4));
		});
		$("button.loginrequired").click(function e() {
			console.log("click: " + $(this).text());
			url="rest/restdb/"+$("#collection").val()+"/";
			data="";
			type=$(this).text();
			if ($("#oid").val().trim()!="") {
				url+=$("#oid").val();
			}
			if ($(this).text()=='POST' || $(this).text()=='PUT') {
				data=$("#data").val();
			}
			if ($(this).text()=='GET') {	//clear existing results
				$("#output").html("");
			}
			$.ajax({
				url : url,
				type: type,
				contentType: "application/json; charset=utf-8",
				data: data,
				context : document.body
			}).done(function(data) {
				$("#data").val("");
				$("#oid").val("");
				if(data){
					var items = [];
					$.each(data, function(i, item){
						items.push( "<li id='" + i + "'>" + JSON.stringify(item) + "</li>" );
					});
					$( "<ul/>", {
						html: items.join( "" )
					}).appendTo( "#output" );
				}
			}).error(function e(err){
				console.log(err);
				if(err.responseText=="SESSIONTIMEOUT"){
					console.log("Session timeout - reload page!");
					displayForms(false);	//logout
					popup("You have been logged out due to inactivity!");
					return;
				}
				alert("Error! " + err.statusText);
			});
		});
		popup("Alt er vist loaded som det skal...");
	});
</script>
</head>
<body>
	<h2>REST DEMO!</h2>
	<div class="loginrequired">
		<button class="loginrequired">GET</button>
		<button class="loginrequired">POST</button>
		<button class="loginrequired">PUT</button>
		<button class="loginrequired">DELETE</button>
		<hr>
		<input id="collection" value="player"><input id="oid" placeholder="oid"><textarea id="data" style="height:220px;width:400px"></textarea>
		<hr>
		<pre id="output"></pre>
	</div>
	<button id="logout">Simulate logout</button>
	lsdvmp<br>lsdvmp<br>lsdvmp<br>lsdvmp<br>lsdvmp<br>lsdvmp<br>lsdvmp<br>lsdvmp<br>lsdvmp<br>lsdvmp<br>lsdvmp<br>lsdvmp<br>lsdvmp<br>lsdvmp<br>lsdvmp<br>lsdvmp<br>lsdvmp<br>lsdvmp<br>lsdvmp<br>lsdvmp<br>lsdvmp<br>lsdvmp<br>lsdvmp<br>lsdvmp<br>lsdvmp<br>lsdvmp<br>lsdvmp<br>lsdvmp<br>lsdvmp<br>lsdvmp<br>lsdvmp<br>lsdvmp<br>lsdvmp<br>lsdvmp<br>lsdvmp<br>
</body>
</html>
