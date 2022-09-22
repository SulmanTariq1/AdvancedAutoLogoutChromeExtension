function LogOutAllOptions() {
//Log out from all websites
	var r = confirm("You are about to logout out of ALL websites, are you sure?");
	if (r == true) {
			chrome.cookies.getAll({}, function(cookies) {
			for(var i=0; i<cookies.length;i++) {
				chrome.cookies.remove({url: "https://" + cookies[i].domain  + cookies[i].path, name: cookies[i].name});
			}
		});
	}
}

function LogOutSpecificSites(){
	var URLProvided=document.getElementById('NameOfWebsites').value
	if(document.getElementById("TimeInMins").value!="0"){
		
		var timeInMins=document.getElementById("TimeInMins").value;
		alert("You will be logged out of the site '"+URLProvided+"' in approximately "+timeInMins+" minute(s).");
		chrome.alarms.create(URLProvided,{delayInMinutes: parseInt(timeInMins),periodInMinutes:1 });
			
		chrome.alarms.onAlarm.addListener(function(alarm){
			  console.log("Alarm Elapsed Name "+alarm.name);
			  console.log("This is Over");
			  chrome.alarms.clear("My First Alarm");
			URLProvided=URLProvided.replace("www.","");
			URLProvided=URLProvided.replace("outlook.","");
			
			if(URLProvided.toLowerCase().indexOf("yahoo.com") > -1)
			{
				URLProvided="yahoo.com";
			}
			if(URLProvided.toLowerCase().indexOf("web.facebook.com")> -1 )
			{
				URLProvided="facebook.com";
			}
			if(URLProvided!=null || URLProvided!=""){
				var domainsProvided=ExtractDomain(URLProvided);
				chrome.cookies.getAll({domain: domainsProvided}, function(cookies) {
				  for(var i=0; i<cookies.length;i++) {
					chrome.cookies.remove({url: "https://" + cookies[i].domain  + cookies[i].path, name: cookies[i].name});
					}
				  });	
			}
			  
		});
	}
	else if ( document.getElementById("NameOfWebsites").value!='' ) {
			URLProvided=URLProvided.replace("www.","");
			URLProvided=URLProvided.replace("outlook.","");
			if(URLProvided.toLowerCase().indexOf("yahoo.com") > -1)
			{
				URLProvided="yahoo.com";
			}
			if(URLProvided.toLowerCase().indexOf("web.facebook.com")> -1 )
			{
				URLProvided="facebook.com";
			}
			if(URLProvided!=null || URLProvided!=""){
				var domainsProvided=ExtractDomain(URLProvided);
				chrome.cookies.getAll({domain: domainsProvided}, function(cookies) {
				  for(var i=0; i<cookies.length;i++) {
					chrome.cookies.remove({url: "https://" + cookies[i].domain  + cookies[i].path, name: cookies[i].name});
					}
				  });	
			}
			alert("You are now Logged out of the site : "+ URLProvided);
	}
}
/*chrome.alarms.onAlarm.addListener(function( alarm ) {
  console.log("Got an alarm!", alarm);
});*/
function ExtractDomain(url) {
    var domain;
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }

    domain = domain.split(':')[0];

    return domain;
}
/*
function createAlarm() {
     chrome.alarms.create(alarmName, {
       delayInMinutes: 0.1, periodInMinutes: 0.1});
}
*/
function LoadCurrentTab(){
//	chrome.tabs.create({'url': chrome.extension.getURL('pages/popup.html')}, function(tab) {});
	chrome.tabs.getSelected(null, function(tab) {
		var tabUrl = tab.url;
		tabUrl=ExtractDomain(tabUrl);
		document.getElementById("NameOfWebsites").value=tabUrl;
		
    });
}

var checkLoad = function() {   
    document.readyState !== "complete" ? setTimeout(checkLoad,11) : LoadCurrentTab();   
};  
checkLoad();  


chrome.windows.onCreated.addListener(function() {
	chrome.windows.getAll(function(windows) {
		if(localStorage["AutoLogoutAll"]=="Y" && windows.length==1)
		{
			chrome.cookies.getAll({}, function(cookies) {
				for(var i=0; i<cookies.length;i++) {
					chrome.cookies.remove({url: "https://" + cookies[i].domain  + cookies[i].path, name: cookies[i].name});
				}
			});
		}
		else if(localStorage["AutoLogoutAllWebSitesList"]!="" && localStorage["AutoLogoutAllWebSitesList"]!=null && windows.length==1){
			var AutoLogoutWebsitesList=localStorage["AutoLogoutAllWebSitesList"].split(";");
			for (var i = 0; i < AutoLogoutWebsitesList.length; i++) {
				if(AutoLogoutWebsitesList[i]!=null && AutoLogoutWebsitesList[i]!=""){
					LogoutWebsitesUsingURL(AutoLogoutWebsitesList[i]);
				}
			}
		}
	});
});
function LogoutWebsitesUsingURL(URLProvided){
	URLProvided=URLProvided.replace("www.","");
	URLProvided=URLProvided.replace("outlook.","");
	if(URLProvided.toLowerCase().indexOf("yahoo.com") > -1)
	{
		URLProvided="yahoo.com";
	}
	if(URLProvided!=null || URLProvided!=""){
		var domainsProvided=ExtractDomain(URLProvided);
		chrome.cookies.getAll({domain: domainsProvided}, function(cookies) {
		for(var i=0; i<cookies.length;i++) {
			chrome.cookies.remove({url: "https://" + cookies[i].domain  + cookies[i].path, name: cookies[i].name});
		}
		});	
	}	
}

function funcAddToLogOutList(){
	var r = confirm("Are you sure you want to add this site to log out list?");
	if (r == true) {
		localStorage["AutoLogoutAllWebSitesList"]+=document.getElementById('NameOfWebsites').value+";";
	}
}
document.getElementById('LogoutAll').addEventListener('click', LogOutAllOptions);
document.getElementById('LogoutSpecific').addEventListener('click', LogOutSpecificSites);
document.getElementById('AddToLogOutList').addEventListener('click', funcAddToLogOutList);
