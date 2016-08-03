angular.module('riskApp.controllers')
.controller('ProjectCtrl', ['$scope','$rootScope', '$filter', 'restService', '$location', '$routeParams', 'stateService', function ($scope, $rootScope, $filter, restService, $location, $routeParams, stateService) {
	console.log("Project controller initialized");

	$scope.formatStupidDate = function(){
		debugger
		console.log("some one changed the date: ");
	}
	
    $scope.doStuff = function(poid){
    	$scope.directProject(poid);
    }
    
    
    
    
    

/*    
$scope.barrender = function(mi){
    var s=new Date(Date.parse(mi.date));
    var e=new Date(Date.parse(mi.enddate));
    var start=0;
    var end=100;
    var thisyear=new Date();
    var base=new Date();
    base.setFullYear(thisyear.getFullYear(), 0, 1);
    var today = Math.round(((thisyear.getTime()-base.getTime())/86400000)*100/365);
    var oneday = today+1;
    if(today==100){ today=99; oneday=100;}
    
    //Hack
    today=today-75;
    oneday=today+1;
                

    //hack
    var sinrange = false;
    var sbeforerange = false;
    var safterrange = false;
    var einrange = false;
    var ebeforerange = false;
    var eafterrange = false;
    sinrange = (s.getTime()-base.getTime())/86400000*100/365>75&&(s.getTime()-base.getTime())/86400000*100/365<175;
    sbeforerange = (s.getTime()-base.getTime())/86400000*100/365<75;
    safterrange = (s.getTime()-base.getTime())/86400000*100/365>175;
    einrange = (e.getTime()-base.getTime())/86400000*100/365>75&&(e.getTime()-base.getTime())/86400000*100/365<175;
    ebeforerange = (e.getTime()-base.getTime())/86400000*100/365<75;
    eafterrange = (e.getTime()-base.getTime())/86400000*100/365>175;
    
    
    if(sinrange)start=Math.round(((s.getTime()-base.getTime())/86400000)*100/365)-75;
    if(einrange)end=Math.round(((e.getTime()-base.getTime())/86400000)*100/365)-75;
    if(start==end && end!=100)end=end+1;
    if(start==100)start--;
    
    
    var color="grey";
        
    var ret = "#fff";
    if(start<end){
    if(today<=start){    
        ret = "linear-gradient(to right, #fff "+today+"%, "+color+" "+today+"%, "+color+" "+oneday+"%, #fff "+oneday+"%, #fff "+start+"%, "+mi.risklevel+" "+start+"%, "+mi.risklevel+" "+end+"%, #fff "+end+"%)";
    }
        
if(today>start && today<=end){    
        ret = "linear-gradient(to right, #fff "+start+"%, "+mi.risklevel+" "+start+"%, "+mi.risklevel+" "+today+"%, "+color+" "+today+"%, "+color+" "+oneday+"%, "+mi.risklevel+" "+oneday+"%,"+mi.risklevel+" "+end+"%, #fff "+end+"%)";
    }
        
if(today>end){ 
    if((mi.state=="Progress"||mi.state=="Target"||mi.state=="Qualified")) color="red";
        ret = "linear-gradient(to right, #fff "+start+"%, "+mi.risklevel+" "+start+"%, "+mi.risklevel+" "+end+"%, #fff "+end+"%, #fff "+today+"%, "+color+" "+today+"%, "+color+" "+oneday+"%, #fff "+oneday+"%)";

    }
        if(sbeforerange && ebeforerange){
            var dist = Math.round(today/2);
            if((mi.state=="Progress"||mi.state=="Target"||mi.state=="Qualified")) color="red";
            ret = "linear-gradient(to right, "+mi.risklevel+" 0%, #fff "+dist+"%, #fff "+today+"%, "+color+" "+today+"%, "+color+" "+oneday+"%, #fff "+oneday+"%)";
        }
        if(safterrange && eafterrange){
            var dist = 100-Math.round((100-today)/2);
            ret = "linear-gradient(to right, #fff "+today+"%, "+color+" "+today+"%, "+color+" "+oneday+"%, #fff "+oneday+"%, #fff "+dist+"%, "+mi.risklevel+" 100%)";
        }
    
    }
        //debug consol
        if(ret==null)console.log(mi.title + " - " + ret + " Start: " + start + " End: " + end + " Today: " +today+ " Oneday: " +oneday+" color: "+color );
        
        //return
        return {background: ret}

    }
*/
    $scope.barrender = function(mi){
    var s=new Date(Date.parse(mi.date));
    var e=new Date(Date.parse(mi.enddate));
    var start=0;
    var end=100;
    var thisyear=new Date();
    var base=new Date();
    base.setFullYear(thisyear.getFullYear(), 0, 1);
    var today = Math.round(((thisyear.getTime()-base.getTime())/86400000)*100/365);
    var oneday = today+1;
    if(today==100){ today=99; oneday=100;}
                
    if(thisyear.getFullYear()==s.getFullYear()) start=Math.round(((s.getTime()-base.getTime())/86400000)*100/365);
    if(thisyear.getFullYear()==e.getFullYear()) end=Math.round(((e.getTime()-base.getTime())/86400000)*100/365);        
    if(start==end && end!=100)end=end+1;
    if(start==100)start--;
    var color="grey";
    var colorlevel="Red";
    if(mi.risklevel!=null&&mi.risklevel!=""&&mi.effort!=null&&mi.effort!=""){
    var val=mi.risklevel*mi.effort;
        if(val<=12)colorlevel="Orange";
        if(val<=6)colorlevel="Yellow";
        if(val<=3)colorlevel="Green"; 
    }
        
        
    var ret = "#f6f1d3";
    if(start<end){
    if(today<=start){    
        ret = "linear-gradient(to right, #f6f1d3 "+today+"%, "+color+" "+today+"%, "+color+" "+oneday+"%, #f6f1d3 "+oneday+"%, #f6f1d3 "+start+"%, "+colorlevel+" "+start+"%, "+colorlevel+" "+end+"%, #f6f1d3 "+end+"%)";
    }
        
if(today>start && today<=end){    
        ret = "linear-gradient(to right, #f6f1d3 "+start+"%, "+colorlevel+" "+start+"%, "+colorlevel+" "+today+"%, "+color+" "+today+"%, "+color+" "+oneday+"%, "+colorlevel+" "+oneday+"%,"+colorlevel+" "+end+"%, #f6f1d3 "+end+"%)";
    }
        
if(today>end){ 
    if((mi.state=="Progress"||mi.state=="Target"||mi.state=="Qualified")) color="red";
        ret = "linear-gradient(to right, #f6f1d3 "+start+"%, "+colorlevel+" "+start+"%, "+colorlevel+" "+end+"%, #f6f1d3 "+end+"%, #f6f1d3 "+today+"%, "+color+" "+today+"%, "+color+" "+oneday+"%, #f6f1d3 "+oneday+"%)";

    }
        if(thisyear.getFullYear()>s.getFullYear() && thisyear.getFullYear()>e.getFullYear()){
            var dist = Math.round(today/2);
            if((mi.state=="Progress"||mi.state=="Target"||mi.state=="Qualified")) color="red";
            ret = "linear-gradient(to right, "+colorlevel+" 0%, #f6f1d3 "+dist+"%, #f6f1d3 "+today+"%, "+color+" "+today+"%, "+color+" "+oneday+"%, #f6f1d3 "+oneday+"%)";
        }
        if(thisyear.getFullYear()<s.getFullYear() && thisyear.getFullYear()<e.getFullYear()){
            var dist = 100-Math.round((100-today)/2);
            ret = "linear-gradient(to right, #f6f1d3 "+today+"%, "+color+" "+today+"%, "+color+" "+oneday+"%, #f6f1d3 "+oneday+"%, #f6f1d3 "+dist+"%, "+colorlevel+" 100%)";
        }
    
    }
        //debug consol
        if(ret==null)console.log(mi.title + " - " + ret + " Start: " + start + " End: " + end + " Today: " +today+ " Oneday: " +oneday+" color: "+color );
        
        //return
        return {background: ret}

    }
    
    
$scope.sizerender = function(kpi){
        ret="rad6";
        if(kpi!=null){
            if(kpi=='No dependency')ret="rad0";
            if(kpi=='Minor dependency')ret="rad2";
            if(kpi=='Major dependency')ret="rad4";
        }
        
        //return
        return ret;

    } 

$scope.kpisizerender = function(kpi){
        ret="rad0";
        if(kpi!=null){
            if(kpi=='0')ret="rad0";
            if(kpi=='10')ret="rad1";
            if(kpi=='20')ret="rad2";
            if(kpi=='40')ret="rad3";
            if(kpi=='50')ret="rad4";
            if(kpi=='70')ret="rad5";
            if(kpi=='80')ret="rad6";
            if(kpi=='100')ret="rad7";
            
        }
        
        //return
        return ret;

    } 

$scope.riskbarrender = function(kpi){
        ret="Red";
        if(kpi!=null){
            if(kpi==1)ret="Green";
            if(kpi==2)ret="Yellow";
            if(kpi==3)ret="Orange";
        }
        
        //return
        return ret;

    }
$scope.valuebarrender = function(kpi){
        ret="Green";
        if(kpi!=null){
            if(kpi==1)ret="Red";
            if(kpi==2)ret="Orange";
            if(kpi==3)ret="Yellow";
        }
        
        //return
        return ret;

    }

$scope.skillrender = function(kpi){
        ret="Red";
        if(kpi!=null){
            if(kpi=='Ok')ret="Green";
            if(kpi=='Minor issue')ret="Yellow";
            if(kpi=='Major issue')ret="Orange";
        }
        
        //return
        return ret;

    }
$scope.csrender = function(kpi){
        ret="Red";
        if(kpi!=null){
            if(kpi==8||kpi==7||kpi==6)ret="Green";
            if(kpi==5||kpi==4)ret="Yellow";
            if(kpi==3||kpi==2)ret="Orange";
        }
        
        //return
        return ret;

    }


    $scope.directProjectFromRisk = function(risk){
    	$scope.directProject(risk.projectoid);
        closeport();
    }

    $scope.directProjectFromMile = function(mile){
        $scope.directProject(mile.projectoid);
        closeport();
    }

    $scope.directProject=function (poid){
	        angular.forEach(stateService.getProjects(), function(project) {
	    		if(poid==project._id.$oid){
	    			$scope.editProject(project);
	    		}
	    	});
	        closeport();	
    }
    
    $scope.directRiskLink = function(risk){
    	$scope.editRisk(risk);
    	showhide(5,5);
    	showhidepop(5,true);
        closeport();
    }

    $scope.directMilestoneLink = function(mile){
        $scope.editMile(mile);
    	showhide(4,5);
        showhidepop(4,true);
        closeport();
    }
    



	$scope.$watch('myfilter', function() {
		$scope.projects=stateService.getProjects();
		//Do filter here - remove unwanted projects
	});


	$rootScope.$watch('company', function() {
		console.log("------------ company changed");
		$scope.company=stateService.getCompany();
	});
	$rootScope.$watch('projects', function() {
		console.log("------------ projects changed");
		$scope.project=stateService.getProject();
		if($scope.project){
			new minipie('#kpi1', $scope.project.kpi1);
			new minipie('#kpi2', $scope.project.kpi2);
			new minipie('#kpi3', $scope.project.kpi3);
		    new minipie('#kpi4', $scope.project.kpi4);
			new minipie('#kpi5', $scope.project.kpi5);
			new minipie('#kpi6', $scope.project.kpi6);
		    new minipie('#kpi7', $scope.project.total);
            $scope.logProject(false, "Project viewed");
            saveProjectRedirect();
		}

		if($scope.project.statuses.length>0){
			$scope.editstatus=angular.copy($scope.project.statuses[$scope.project.statuses.length-1]);
			$scope.saveStatusEnabled=true;
		}
		$scope.projects=stateService.getProjects();
		console.log($scope.projects.length);

        
		//join all risks in one obj
		$scope.allrisks=[];
        angular.forEach(stateService.getProjects(), function(project) {
        	if(project.state!="Closed"){
                var risklist=[];
            angular.forEach(project.risks, function(risk) {
            	risk['projecttitle']=project.title;
            	risk['acname']=(risk.acc!=null)?risk.acc.name:'TBD';
            	risk['wtotal']=Math.round(project.total*risk.prob*25*risk.impact*25/1000); 
            	risk['pitotal']=Math.round(risk.prob*25*risk.impact*25/100); 
            	risk['wtotalprob']=Math.round(project.total*risk.prob*25/100); 
            	risk['wtotalimpact']=Math.round(project.total*risk.impact*25/100); 
            	risk['projectstate']=project.state;
            	risk['projectoid']=project._id.$oid;
            	risk['buname']=project.bu.name;
            	risk['pkpi1']=project.kpi1;
            	risk['pkpi2']=project.kpi2;
            	risk['pkpi3']=project.kpi3;
            	risk['pkpi4']=project.kpi4;
            	risk['pkpi5']=project.kpi5;
            	risk['pkpi6']=project.kpi6;
            	risk['ptotal']=project.total;
            	risk['ab']=project.statuses[project.statuses.length-1].ab;
            	risk['EtC']=project.statuses[project.statuses.length-1].EtC;
            	risk['fte']=project.statuses[project.statuses.length-1].fte;
            	risklist=risklist.concat(risk);
            });
        	$scope.allrisks=$scope.allrisks.concat(risklist);
            }
        });
       
		
        //join all risks in one obj
		$scope.allMilestones=[];
        angular.forEach(stateService.getProjects(), function(project) {
            if(project.state!="Closed"){
        	var milestonelist=[];
            angular.forEach(project.milestones, function(milestone) {
            	milestone['projectoid']=project._id.$oid;
            	milestone['projecttitle']=project.title;
            	milestone['buname']=project.bu.name;
                milestone['acname']=(milestone.acountable!=null)?milestone.acountable.name:'TBD';
            	milestonelist=milestonelist.concat(milestone);
            });
        	       $scope.allMilestones=$scope.allMilestones.concat(milestonelist);
            }
        });
        
        //$scope.drawMilestones();

	});
	
    
    
    
//	if($scope.projects){console.log("got projects: " + $scope.projects.length)}else{console.log("No data found")}
//	console.log("EDIT> "+$scope.project);

	//ignore links if we are not logged in
	if (!($scope.user && $scope.user.authenticated)) {
		$rootScope.$watch('user', function() {
		    if ($scope.user && $scope.user.authenticated) {
		    	console.log("user changed");
		        //setup rest and load todolist when user logs in
//		        restService.setApplication($scope.user.auid, $rootScope.user.uuid);
//		        //loadCompany();
//				$scope.company=stateService.loadCompany();
//				$scope.users=stateService.loadUsers();
//		        $scope.projects=//stateService.loadProjects();
		        console.log($scope.projects);
		    }else{
				$location.path('/');
		    }
		});
	}
	//status
	$scope.newStatus = function() {
		console.log('newStatus');
        var newdate=(new Date()).toISOString();
		$scope.project.statuses.push({});
		$scope.editstatus={};
        $scope.editstatus.demodate=newdate;
        $scope.editstatus.apo="Not evaluated"; 
        $scope.editstatus.title="No title"; 
        $scope.editstatus.statusstate="Draft";
        $scope.editstatus.active=true;
		$scope.saveStatusEnabled=true;
	}
	$scope.newCloneStatus = function(status) {
		console.log('newCloneStatus');
        $scope.editstatus = angular.copy(status);
		$scope.project.statuses.push($scope.editstatus);
        $scope.editstatus=$scope.project.statuses[$scope.project.statuses.length-1];
        $scope.editstatus.apo="Not evaluated"; 
        $scope.editstatus.title="No title"; 
        $scope.editstatus.statusstate="Draft";
        $scope.editstatus.active=true;
		$scope.saveStatusEnabled=true;
	}
	$scope.viewStatus = function(status) {
		//console.log('VIEW STATUS');
		var last=$scope.project.statuses.indexOf(status)==$scope.project.statuses.length-1;
		$scope.saveStatusEnabled=last;
		$scope.editstatus=status;
	}
    $scope.removeStatus = function(status){
		$scope.project.statuses.splice($scope.project.statuses.indexOf(status), 1);
		saveProjectRedirect();		//save project without redirect
	}
	
$scope.saveStatus = function() {
		//console.log('SAVE STATUS');
		//TODO: change datepickr to be integrated with angular objects
		//date extractor bugfix thingy:
        var ed = new Date();
        if(ed instanceof Date && !isNaN(ed.valueOf())){$scope.editstatus.date=ed;}
        var dd = new Date($("#demodate")[0].value);
        if(dd instanceof Date && !isNaN(dd.valueOf())){$scope.editstatus.demodate=dd.toISOString();}
        
        
        
		//end of date thing
    //set approved to blank if PM changes status
    if($scope.project.pm.email==$scope.user.email){
        $scope.editstatus.apo="Not evaluated";   
    }
    
    if(($scope.project.po.email==$scope.user.email||$scope.user.admin) && ($scope.editstatus.statusstate=="Final"||$scope.editstatus.apo=="Approved")){
        $scope.editstatus.apo="Approved";
        $scope.editstatus.statusstate="Final";
        $scope.editstatus.active=false;
    }
    
    
    
		if($scope.project.statuses.length==0){
			$scope.project.statuses.push($scope.editstatus);
		}else{
			$scope.project.statuses[$scope.project.statuses.length-1]=$scope.editstatus;
		}
        $scope.logProject(true, "Status saved");
		saveProjectRedirect();		//save project without redirect
	}

	//milestone
	$scope.saveMilestones = function() {
        var md = new Date($("#miledate")[0].value);
        if(md instanceof Date && !isNaN(md.valueOf())){$scope.editmile.date=md.toISOString();}
        
		var med = new Date($("#mileenddate")[0].value);
        if(med instanceof Date && !isNaN(med.valueOf())){$scope.editmile.enddate=med.toISOString();}
        
        $scope.editmile.wsjf=Math.floor(($scope.editmile.bena*$scope.editmile.sena)/
            ($scope.editmile.effort*$scope.editmile.risklevel)*100/16);
        
		//console.log('saveMilestones md ' +md+' editmile '+$scope.editmile.date);
        $scope.logProject(true, "Milestone saved");
		saveProjectRedirect();		//save project without redirect
	}
	$scope.newMilestone = function() {
		//console.log('newMilestone');
        var newdate=(new Date()).toISOString();
		$scope.project.milestones.push({});
        $scope.editmile=$scope.project.milestones[$scope.project.milestones.length-1];
        $scope.editmile.date=newdate;
        $scope.editmile.enddate=newdate;
        $scope.editmile.status='Green';
        $scope.editmile.state='Target';
	   $scope.editmile.audience='Project';
	   $scope.editmile.acountable='TBD';
	}
	$scope.removeMilestone = function(milestone){
		$scope.project.milestones.splice($scope.project.milestones.indexOf(milestone), 1);
		saveProjectRedirect();		//save project without redirect
	}
	//risk
	$scope.newRisk = function() {
		$scope.editrisk={};
		$scope.editrisk.freq={};
		$scope.editrisk.freq.kpi1=0;
		$scope.editrisk.freq.kpi2=0;
		$scope.editrisk.freq.kpi3=0;
        $scope.editrisk.prob=1;
        $scope.editrisk.impact=1;
        $scope.editrisk.total=1;
        $scope.editrisk.response='Accept';
        $scope.editrisk.acc='TBD';
        $scope.editrisk.audience='Project';
        $scope.editrisk.status='Green';
        $scope.editrisk.state='New';
        $scope.editrisk.prob=1;
        $scope.editrisk.impact=1;
	}
	$scope.removeRisk = function(risk){
		$scope.project.risks.splice($scope.project.risks.indexOf(risk), 1);
		saveProjectRedirect();		//save project without redirect
	}
	$scope.editRisk = function(risk){
		$scope.editrisk=risk;
	}
	$scope.editMile = function(mile){
		$scope.editmile=mile;
	}
	$scope.saveRisk = function(){
        $scope.editrisk.total=$scope.editrisk.prob*$scope.editrisk.impact;
		//console.log($scope.project);
		if(!$scope.editrisk.freq){
			$scope.editrisk.freq={};
			$scope.editrisk.freq.kpi1=0;
			$scope.editrisk.freq.kpi2=0;
			$scope.editrisk.freq.kpi3=0;
		}
		if($scope.project.risks.indexOf($scope.editrisk)==-1){
			$scope.project.risks.push($scope.editrisk);	//new item
		}
        $scope.logProject(true, "Risk saved");
		saveProjectRedirect();		//save project without redirect
		$scope.editrisk={};
	}
	//BU
	$scope.newBU = function() {
		//console.log('add BU');
		$scope.bus.push({});
	}
	$scope.removeBU = function(bu){
		restService.deleteData('bu',angular.fromJson(bu)).success(function(dataResponse) {
			console.log('removed bu');
			$scope.bus.splice($scope.bus.indexOf(bu), 1);
		}).error(function(dataResponse) {console.log('ERROR ...');});
	}
	$scope.saveBus = function() {
		console.log('save BU');
		//console.log($scope.bus);
        angular.forEach($scope.bus, function(bu) {
    		//console.log(bu);
    		if(bu.ownerbu && bu._id == bu.ownerbu._id){
    			alert("Du kan ikke have en BU der peger på sig selv!!!");
    			return;
    		}
			if(bu._id){	//update
				restService.updateData('bu',angular.fromJson(bu)).success(function(dataResponse) {
					console.log('updated');
				}).error(function(dataResponse) {console.log('ERROR ...');});
			}else{	//add
				restService.saveData('bu',angular.fromJson(bu)).success(function(dataResponse) {
					$scope.bus[$scope.bus.indexOf(bu)]=dataResponse;	//update the oid via angular
					console.log('saved');
				}).error(function(dataResponse) {console.log('ERROR ...');});
			}
        });
	}
	//company
	$scope.saveCompany = function() {
		console.log('save Company');
		if($scope.company._id){	//update
			restService.updateData('company',angular.fromJson($scope.company)).success(function(dataResponse) {
				//stateService.loadCompany();
				//$location.path('/dashboard');
				alert('updated');
			}).error(function(dataResponse) {console.log('ERROR ...');});
		}else{	//add
				
			restService.saveData('company',angular.fromJson($scope.company)).success(function(dataResponse) {
				$scope.company=dataResponse;	//update the oid via angular
				//add a BU with company name 
				var bu={name:$scope.company.name};
				restService.saveData('bu',angular.fromJson(bu)).success(function(dataResponse) {
					$scope.bus[0]=dataResponse;
				});
				//$location.path('/dashboard');
				alert('saved');
			}).error(function(dataResponse) {console.log('ERROR ...');});
		}
	}
	$scope.newProject = function(np) {
		$scope.project={};
        $scope.project.title=np.title;
        $scope.project.bu=np.bu;
        $scope.project.pm=np.pm;
        $scope.project.po=np.po;
        $scope.project.state='Proposed';
        	$scope.project.kpi1=0;
			$scope.project.kpi2=0;
			$scope.project.kpi3=0;
			$scope.project.kpi4=0;
			$scope.project.kpi5=0;
			$scope.project.kpi6=0;
        $scope.project.total=0;
		
        $scope.project.statuses=[];
        $scope.project.statuses.push({});
		$scope.project.statuses[0].date=new Date();
        $scope.project.statuses[0].fte=np.fte;
        $scope.project.statuses[0].EtC=np.ab;
        $scope.project.statuses[0].ab=np.ab;
        $scope.project.statuses[0].status='Green';
        $scope.project.statuses[0].title='Project created';
        
        stateService.setProject($scope.project);
        saveProjectRedirect();
	}
	$scope.logProject = function(save, description) {		
		if(!$scope.project.logWatch){
            $scope.project.logWatch=[];
            $scope.project.logWatch.push({});
            $scope.project.logWatch[0].date=new Date();
            $scope.project.logWatch[0].username=$scope.user.name;
            $scope.project.logWatch[0].desc="View Log created";
            $scope.project.logSave=[];
            $scope.project.logSave.push({});
            $scope.project.logSave[0].date=new Date();
            $scope.project.logSave[0].username=$scope.user.name;
            $scope.project.logSave[0].desc="Save Log created";
            
        }
            if(save){
                $scope.project.logSave.unshift({});
                $scope.project.logSave[0].date=new Date();
                $scope.project.logSave[0].username=$scope.user.name;
                $scope.project.logSave[0].desc=description;
                if($scope.project.logSave.length>20)$scope.project.logSave.pop();
            }else{
                $scope.project.logWatch.unshift({});
                $scope.project.logWatch[0].date=new Date();
                $scope.project.logWatch[0].username=$scope.user.name;
                $scope.project.logWatch[0].desc=description;
                if($scope.project.logWatch.length>20)$scope.project.logSave.pop();
            }
	}
    
$scope.editProject = function(project) {
		closeport();
        stateService.setProject(project);
        
		$location.path('/project');
		//$scope.$apply();	//http://stackoverflow.com/questions/11784656/angularjs-location-not-changing-the-path
	}
	$scope.deleteProject = function(project) {
		restService.deleteData('project',angular.fromJson(project)).success(function(dataResponse) {
			var index=$scope.projects.indexOf(project);
		    $scope.projects.splice(index, 1);
			//stateService.loadProjects();
		    //$scope.drawScatter();
		    //$scope.drawRiskScatter();
		}).error(function(dataResponse) {console.log('ERROR DELETE PROJECT');});
	}
	$scope.saveProject = function() {
		
        $scope.project.total=
            Math.round((parseInt($scope.project.kpi1)+
             parseInt($scope.project.kpi2)+
             parseInt($scope.project.kpi3)+
             parseInt($scope.project.kpi4)+
             parseInt($scope.project.kpi5)+
             parseInt($scope.project.kpi6))/6);
        //console.log('SAVE PROJECT total=' + $scope.project.total);
        $scope.logProject(true,"Project saved");
		saveProjectRedirect(); //no redirect
	}

	
	saveProjectRedirect = function(redirect) {
		$scope.projecthaschanged=false;	//reset save button colour
        
		if($scope.project._id){	//update
			restService.updateData('project',angular.fromJson($scope.project)).success(function(dataResponse) {
				stateService.setProject(dataResponse);//$scope.project=dataResponse;
				//stateService.loadCompany();
				if(redirect){
					$location.path(redirect);
				}
			}).error(function(dataResponse) {console.log('ERROR ...');});
		}else{	//add
			$scope.project.kpi1=0;
			$scope.project.kpi2=0;
			$scope.project.kpi3=0;
			$scope.project.kpi4=0;
			$scope.project.kpi5=0;
			$scope.project.kpi6=0;
			$scope.project.total=0;
			restService.saveData('project',angular.fromJson($scope.project)).success(function(dataResponse) {
				stateService.setProject(dataResponse);
				$scope.project=dataResponse;	//update the oid via angular
				stateService.addProject(dataResponse);
				if(redirect){
					$location.path(redirect);
				}
			}).error(function(dataResponse) {console.log('ERROR ...');});
		}
	}

}]);
