var SITE = "Local";
var SITENAME = "Local dev";
DBSERVER = "https://priodev.northeurope.cloudapp.azure.com/priorest";
USERSERVER = "https://priodev.northeurope.cloudapp.azure.com/priouser";
var PRIVATECLOUD = "true";
var SSO = "NOSSO";

//Test env. 3 tier with Cosmos DB service
if (window.location.href.indexOf("priocloudtest") > -1) {
    SITENAME = "Test";
    DBSERVER = "https://priocloudbackendtest.azurewebsites.net/mongorest/rest";
    USERSERVER = "https://priocloudbackendtest.azurewebsites.net/mongorest/user";

    //Dev with 2 tiers Frontend-Ubuntu with Backend and Mongo DB in dockers.  Or frontend docker in 1 tier   
} else if (window.location.href.indexOf("prioclouddevfrontend") > -1) {
    SITENAME = "Dev";
    DBSERVER = "https://priodev.northeurope.cloudapp.azure.com/priorest";
    USERSERVER = "https://priodev.northeurope.cloudapp.azure.com/priouser";
    SSO = "SSO";

    //localhost - docker running locally
} else if (window.location.href.indexOf("localhost") > -1) {
    SITENAME = "Docker dev";
    DBSERVER = "/priorest";
    USERSERVER = "/priouser";
    SSO = "NOSSO";

    //Dev No SSO 3 dockers on Ubuntu 
} else if (window.location.href.indexOf("priodev.northeurope") > -1) {
    SITENAME = "Docker%SSO";
    DBSERVER = "https://priodev.northeurope.cloudapp.azure.com/priorest";
    USERSERVER = "https://priodev.northeurope.cloudapp.azure.com/priouser";
    SSO = "NOSSO";

    //Prod with 2 tiers, Frontend-Ubuntu with Backend and Mongo DB in dockers. 
} else if (window.location.href.indexOf("priocloud") > -1) {
    SITENAME = "PrioCloud 2.1";
    DBSERVER = "https://priocloud.westeurope.cloudapp.azure.com/priorest";
    USERSERVER = "https://priocloud.westeurope.cloudapp.azure.com/priouser";
    SSO = "SSO";
}
