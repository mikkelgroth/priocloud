var SITE = "Local";
var SITENAME = "Local dev";
DBSERVER = "/priorest";
USERSERVER = "/priouser";
var PRIVATECLOUD = "true";
var SSO = "NOSSO";

//Production
if (window.location.href.indexOf("priocloud") > -1) {
    SITENAME = "PrioCloud 2.1";
}
