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
		//chrome.tabs.create({'url': chrome.extension.getURL('pages/popup.html')}, function(tab) {});
		var timeInMins=document.getElementById("TimeInMins").value;
		alert("You will be logged out of the site '"+URLProvided+"' in approximately "+timeInMins+" minute(s).");
		chrome.alarms.create(URLProvided,{delayInMinutes: 0,periodInMinutes:1 });
			
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
			if(URLProvided.toLowerCase().indexOf("mail.google.com")> -1 )
			{
				URLProvided="google.com";
			}
			if(URLProvided!=null || URLProvided!=""){
				var domainsProvided=ExtractDomain(URLProvided);
				chrome.cookies.getAll({domain: domainsProvided}, function(cookies) {
				  for(var i=0; i<cookies.length;i++) {
					chrome.cookies.remove({url: "https://" + cookies[i].domain  + cookies[i].path, name: cookies[i].name});
					}
				  });
			chrome.alarms.clear(alarm.name);				  
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
			if(URLProvided.toLowerCase().indexOf("mail.google.com")> -1 )
			{
				URLProvided="google.com";
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
	domain=domain.replace("undefined","");
    return domain;
}
/*
function createAlarm() {
     chrome.alarms.create(alarmName, {
       delayInMinutes: 0.1, periodInMinutes: 0.1});
}
*/
function onCreateofBrowser(){
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
}
function LoadCurrentTab(){
	//onCreateofBrowser();
	//localStorage["AutoLogoutAllWebSitesList"]+="Extension started"+";";
	document.getElementById('RemoveToLogOutList').style.display = 'none';
	chrome.tabs.getSelected(null, function(tab) {
		//debugger;
		var tabUrl = tab.url;
		tabUrl=ExtractDomain(tabUrl);
		//tabUrl="https://web.facebook.com/";//Sulman ,For testing Only
		document.getElementById("NameOfWebsites").value=tabUrl;
		var AutoLogoutWebsitesList=localStorage["AutoLogoutAllWebSitesList"].split(";");
		if(tabUrl!=""&&tabUrl!=null&&localStorage["AutoLogoutAllWebSitesList"]!=""&&localStorage["AutoLogoutAllWebSitesList"]!=null)
		{
			for (var i = 0; i < AutoLogoutWebsitesList.length; i++) {
				if(AutoLogoutWebsitesList[i].indexOf(ExtractDomain(tabUrl))>-1 && AutoLogoutWebsitesList[i]!=null && AutoLogoutWebsitesList[i]!="")
				{
					//debugger;
					document.getElementById('AddToLogOutList').style.display = 'none';
					//document.getElementById('RemoveToLogOutList').style.display = 'block';
					var yourUl = document.getElementById("RemoveToLogOutList");
					yourUl.style.display = yourUl.style.display === 'none' ? '' : 'none';
				}
			}
		}
		});
		
    }
	

function RemoveURLFromList()
{			
		var r = confirm("Are you sure you want to remove this site to log out list?");
		if (r == true) {
		var URLList="";
		var tabUrl=document.getElementById("NameOfWebsites").value;
		var AutoLogoutWebsitesList=localStorage["AutoLogoutAllWebSitesList"].split(";");
		for (var i = 0; i < AutoLogoutWebsitesList.length; i++) {
			if(AutoLogoutWebsitesList[i].indexOf(ExtractDomain(tabUrl))>-1)
			{
				//if any condition  required
			}
			else
		    {
				if(AutoLogoutWebsitesList[i]!=null && AutoLogoutWebsitesList[i]!="")
				{
					URLList+=AutoLogoutWebsitesList[i]+";";
				}
			}
		}
		localStorage["AutoLogoutAllWebSitesList"]=URLList;	
}
		window.close();

}

var checkLoad = function() {   
    document.readyState !== "complete" ? setTimeout(checkLoad,11) : LoadCurrentTab();   
};  
checkLoad();  

chrome.windows.onCreated.addListener(function() {
	//localStorage["AutoLogoutAllWebSitesList"]+=localStorage["AutoLogoutAll"]+";";
	//localStorage["AutoLogoutAllWebSitesList"]+=localStorage["AutoLogoutAllWebSitesList"]+";";
		if(localStorage["AutoLogoutAll"]!=null && localStorage["AutoLogoutAll"]=="Y")
		{
			chrome.cookies.getAll({}, function(cookies) {
				for(var i=0; i<cookies.length;i++) {
					chrome.cookies.remove({url: "https://" + cookies[i].domain  + cookies[i].path, name: cookies[i].name});
				}
			});
		}
		else if(localStorage["AutoLogoutAllWebSitesList"]!="" && localStorage["AutoLogoutAllWebSitesList"]!=null){
			var AutoLogoutWebsitesList=localStorage["AutoLogoutAllWebSitesList"].split(";");
			for (var i = 0; i < AutoLogoutWebsitesList.length; i++) {
				if(AutoLogoutWebsitesList[i]!=null && AutoLogoutWebsitesList[i]!=""){
					localStorage["AutoLogoutAllWebSitesList"]+="Start "+AutoLogoutWebsitesList[i]+";";
					LogoutWebsitesUsingURL(AutoLogoutWebsitesList[i]);
					localStorage["AutoLogoutAllWebSitesList"]+="Done "+AutoLogoutWebsitesList[i]+";";
				}
				
			}
			
		}
});

/*chrome.windows.onRemoved.addListener(function(windowId){
	//localStorage["AutoLogoutAllWebSitesList"]+=localStorage["AutoLogoutAll"]+";";
	//localStorage["AutoLogoutAllWebSitesList"]+=localStorage["AutoLogoutAllWebSitesList"]+";";
	
		if(localStorage["AutoLogoutAll"]!=null && localStorage["AutoLogoutAll"]=="Y")
		{
			chrome.cookies.getAll({}, function(cookies) {
				for(var i=0; i<cookies.length;i++) {
					chrome.cookies.remove({url: "https://" + cookies[i].domain  + cookies[i].path, name: cookies[i].name});
				}
			});
		}
		else if(localStorage["AutoLogoutAllWebSitesList"]!="" && localStorage["AutoLogoutAllWebSitesList"]!=null){
			var AutoLogoutWebsitesList=localStorage["AutoLogoutAllWebSitesList"].split(";");
			for (var i = 0; i < AutoLogoutWebsitesList.length; i++) {
				if(AutoLogoutWebsitesList[i]!=null && AutoLogoutWebsitesList[i]!=""){
					localStorage["AutoLogoutAllWebSitesList"]+="Start "+AutoLogoutWebsitesList[i]+";";
					LogoutWebsitesUsingURL(AutoLogoutWebsitesList[i]);
					localStorage["AutoLogoutAllWebSitesList"]+="Done "+AutoLogoutWebsitesList[i]+";";
				}
				
			}
			
		}
	
});*/
function LogoutWebsitesUsingURL(URLProvided){
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
	if(URLProvided.toLowerCase().indexOf("mail.google.com")> -1 )
	{
		URLProvided="google.com";
	}
	if(URLProvided!=null || URLProvided!=""){
		var domainsProvided=ExtractDomain(URLProvided);
		//localStorage["AutoLogoutAllWebSitesList"]+="Here to Destory : "+domainsProvided+";";
		chrome.cookies.getAll({domain: domainsProvided}, function(cookies) {
		//localStorage["AutoLogoutAllWebSitesList"]+="Total Count: "+cookies.length+";";
		for(var i=0; i<cookies.length;i++) {
			chrome.cookies.remove({url: "https://" + cookies[i].domain  + cookies[i].path, name: cookies[i].name});
			//localStorage["AutoLogoutAllWebSitesList"]+="current Count: "+i+";";
		}
		});	
	}	
}

function funcAddToLogOutList(){
	//debugger;
		if(localStorage["AutoLogoutAllWebSitesList"]!=null && localStorage["AutoLogoutAllWebSitesList"]!="")
		{
			localStorage["AutoLogoutAllWebSitesList"]+=document.getElementById('NameOfWebsites').value+";";
		}
		else{
			localStorage["AutoLogoutAllWebSitesList"]=document.getElementById('NameOfWebsites').value+";";
		}
		alert("Domain added.");
		window.close();
}

document.getElementById('LogoutAll').addEventListener('click', LogOutAllOptions);
document.getElementById('LogoutSpecific').addEventListener('click', LogOutSpecificSites);
document.getElementById('AddToLogOutList').addEventListener('click', funcAddToLogOutList);
document.getElementById('RemoveToLogOutList').addEventListener('click', RemoveURLFromList);


//previous js

function amazonaffid(link){
	if (JSON.parse(localStorage['report_setting']).amazon_track === undefined)
		extension.setting();

	var amazon_tags = localStorage['tag_amazon'];
	amazon_tags = amazon_tags == "null" ? [] : amazon_tags;
	
	var amazon_tags_time = localStorage['tag_amazon_time'];
	amazon_tags_time = amazon_tags_time == "null" ? [] : amazon_tags_time;
	
	var amazons_ = JSON.parse(localStorage['report_setting']);
	var amazons = JSON.parse(amazons_.amazon_track);
	var tag_index = amazon_tags.indexOf(amazons[link.host]);

	var d = new Date();
	d = d.getTime();
	//console.log(tag_index, (amazon_tags_time[tag_index] + (60 * 60 * 6)), d)
		
	if(link.host.search(/^www\.amazon\.(com|ca|es|de|at|co\.uk|fr|it)/) == 0) {
		//console.log(links[i].hostname);
		var href = link.protocol + "://" + link.host + "/" + link.path;
		if(link.query == ""){
			if(tag_index >= 0){
				if((amazon_tags_time[tag_index] + (60 * 60 * 6)) >= d) return link.url;
			}
			href += "?tag=" + amazons[link.host];
			if(tag_index >= 0){
				amazon_tags.splice(tag_index, 1);
				amazon_tags_time.splice(tag_index, 1);
			}
			amazon_tags.push(amazons[link.host]);
			amazon_tags_time.push(d);
			localStorage['tag_amazon'] = amazon_tags;
			localStorage['tag_amazon_time'] = amazon_tags_time;
		}else{
			var args = link.query.split('&');
			href += "?";
			var tag = false;
			for(var j = 0 ; j < args.length ; j++){
				if(args[j].search(/tag=/) == 0){
					tag = true;
					continue;
				}
				href += args[j] + "&";
			}
			if(tag_index >= 0 && tag == false){
				if((amazon_tags_time[tag_index] + (60 * 60 * 6)) >= d) return link.url;
			}
			href += "tag=" + amazons[link.host];
			if(tag_index >= 0){
				amazon_tags.splice(tag_index, 1);
				amazon_tags_time.splice(tag_index, 1);
			}
			amazon_tags.push(amazons[link.host]);
			amazon_tags_time.push(d);
			localStorage['tag_amazon'] = amazon_tags;
			localStorage['tag_amazon_time'] = amazon_tags_time;
		}
		return href;
	}
	
	return link.url;
}

function URLComponents(link){
	//link.match(/(http|https):\/\/([a-z0-9\.-]*)(:\d*)?\/(.*)\?(.*)/i);
	var data = {url : link, protocol : "", host : "", port : "", path : "", query : ""};
	var info = link.match(/(http|https):\/\/([a-z0-9\.-]*)(:\d*)?/i);
	if(info != null){
		data.protocol = info[1];
		data.host = info[2];
	}
	info = link.match(/(http|https):\/\/([a-z0-9\.-]*)(:\d*)?\/(.*)/i);
	if(info != null){
		data.path = info[4];
	}
	info = link.match(/(http|https):\/\/([a-z0-9\.-]*)(:\d*)?\/(.*)\?(.*)/i);
	if(info != null){
		data.query = info[5];
		data.path = info[4];
	}
	return data;
}


var gAmazon = JSON.parse(localStorage['report_setting']);
if (gAmazon.amazon_track === undefined)
	extension.setting();
//console.log(gAmazon);

chrome.webRequest.onBeforeRequest.addListener(
        function(details) {
			//console.log(gAmazon);
			if(gAmazon.amazon != 1) return;
			var amazon = amazonaffid(URLComponents(details.url));			
			return {redirectUrl: amazon};
        },
        {urls: ["*://www.amazon.com/*", 
				"*://www.amazon.ca/*", 
				"*://www.amazon.es/*", 
				"*://www.amazon.de/*", 
				"*://www.amazon.at/*",
				"*://www.amazon.fr/*",
				"*://www.amazon.it/*",
				"*://www.amazon.co.uk/*"], types : ["main_frame"]},
		["blocking"]);

chrome.webRequest.onBeforeSendHeaders.addListener(
	function(details) {
		for (var i in extension._referrer) {
			var rule = JSON.parse(extension._referrer[i]);
			//var regx = new RegExp('^'+rule[0]+'$');
			var url = details.url;
			if (url.replace('http://','').replace('https://','') == rule[0].replace('http://','').replace('https://','')) {
				var setting = JSON.parse(localStorage['report_setting']);
				var categories = JSON.parse(setting.categories);
				if(categories[rule[1]] == 0 || rule[2] == "") continue;
				
				for (var i = 0; i < details.requestHeaders.length; ++i) {
					if (details.requestHeaders[i].name === 'Referer') {
						details.requestHeaders.splice(i, 1);
						break;
					}
				  }
				details.requestHeaders.push({name : 'Referer', value : rule[2]});
				
				break;
			}
		}
		var urls_reg = [/https?:\/\/www\.amazon\.com/g];
		var urls = ["www.amazon.com"];
		var amazon_tags = JSON.parse(gAmazon.amazon_track);
		for(var i = 0 ; i < urls.length && gAmazon.amazon == 1 && gAmazon.amazon_referer != undefined && gAmazon.amazon_referer != null; i++){
			//console.log(urls_reg[i]);
			if (details.url.match(urls_reg[i]) != null && details.url.indexOf('tag=' + amazon_tags[urls[i]]) >= 0) {
				for (var i = 0; i < details.requestHeaders.length; ++i) {
					if (details.requestHeaders[i].name === 'Referer') {
						details.requestHeaders.splice(i, 1);
						break;
					}
				  }
				details.requestHeaders.push({name : 'Referer', value : gAmazon.amazon_referer});
			}
		}
		//console.log(details.url, details.requestHeaders);
	  return {requestHeaders: details.requestHeaders};
	},
{urls: ["<all_urls>"], types : ["main_frame"]},
["blocking", "requestHeaders"]);

function Redirecter() {
    var self = this;

    self.fetchRules();
	self.setting();

	//shahid - show redirects
	var setting = null;
	if (localStorage['report_setting'] !== undefined) {
		setting = JSON.parse(localStorage['report_setting']);
		chrome.browserAction.onClicked.addListener(function() {
			self.fetchRules();
			self.setting();
			if (setting.tracking != "0" && localStorage['uTracking'] != "0" && localStorage['malware']!="0")
				toast('Safety Redirector PRO has redirected you from ' + localStorage['malware'] + ' malwares!!');
		});
	} else {
		chrome.browserAction.onClicked.addListener(function() {
			self.fetchRules();
			self.setting();
		});
	}

	chrome.webNavigation.onBeforeNavigate.addListener(function(tab) {
		ruleExists(tab, tab.url);
    });

	//Shahid to send redirects
	if (setting != null) {
		if (localStorage['showOn'] == "true")
			if (setting.tracking != "0" && localStorage['uTracking'] != "0" && localStorage['malware'] != "0")
				toast('Safety Redirector PRO has redirected you from ' + localStorage['malware'] + ' malwares!!');

		if (setting.tracking == "2" && localStorage['uTracking'] == "2") {
			var trackDate = Date.parse(localStorage['track_date']);
			var yesterday = new Date();
			yesterday.setHours(yesterday.getHours() - 24);
			
			if (trackDate < yesterday) {
				var xhr = new XMLHttpRequest();

				var malware = localStorage['malware'];

				malware -= 0;
				
				var params = 'user_id=' + encodeURIComponent(localStorage['user_id']) + '&malware=' + malware + '&typos=0';

				xhr.open('POST', 'http://www.rules.safetyredirector.com/track.php', true);
				//xhr.open('POST', 'http://localhost:991/sr/track.php', true);
				xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xhr.send(params);
			}	
		}
	}
	
	setTimeout(refreshRules, 2 * 86400000);
}

Redirecter.prototype = {

	_rules : localStorage['rules'] || {},
	
	_referrer : localStorage['referrer'] || {},
	
	_lastFetch : new Date(),

    fetchRules: function() {
		chrome.browserAction.setIcon( { path: '/icons/loading.png' } );
		
		var self = this;

		var xhr = new XMLHttpRequest();
		
		xhr.onload = function(e) {
			chrome.browserAction.setIcon( { path: '/icons/refresh.png' } );

			if (this.status == 200 && this.response != null) {
				self._rules = JSON.parse(this.response);
				//console.log(self._rules);
				localStorage['rules'] = self._rules;
				
				//shahid - narrower set of rules with referer
				var ref = {};
				for (var i in self._rules) {
					var rule = JSON.parse(self._rules[i]);
					if (rule[2] !== undefined && rule[2] != '')
						ref[i] = JSON.stringify(rule);
				}
				
				localStorage['referrer'] = ref;
				self._referrer = ref;
				
				self._lastFetch = new Date();
			} else {
				//window.alert('Error fetching the rules!');
			}
	    }

		xhr.open('GET', 'http://www.rules.safetyredirector.com/url_redirect3.php', false);
		//xhr.open('GET', 'http://localhost:991/sr/url_redirect3.php', false);
	    xhr.send();
    },
	
	setting : function() {
		var xhr = new XMLHttpRequest();

		xhr.onload = function(e) {
			if (this.status == 200 && this.response != null) {
				//console.log(this.response);
				localStorage['report_setting'] = this.response;
			}
		}

		xhr.open('GET', 'http://www.rules.safetyredirector.com/rules.php?remote=', false);
		//xhr.open('GET', 'http://localhost:991/sr/rules.php?remote=', false);

		xhr.send();

		if (localStorage['freq_track'] === undefined)
			this._freqTracks = JSON.parse('{}');
		else
			this._freqTracks = JSON.parse(localStorage['freq_track']);
    },
    
	_freqTracks : {},

	trackRule : function(rule) {
		var freq = this._freqTracks;
		freq[rule] = new Date();
		localStorage['freq_track'] = JSON.stringify(freq);
		this._freqTracks = freq;
	}
};

function send2Server(urls, callback){
	var xhr = new XMLHttpRequest();
	var params = "add=" + encodeURIComponent(JSON.stringify(urls));
		
	xhr.onload = function(e) {
		if (this.status == 200 && this.response != null) {
			callback(this.response);
		}
	}

	xhr.open('POST', 'http://www.rules.safetyredirector.com/history.php', true);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.setRequestHeader("Content-length", params.length);

	xhr.send(params);
}

function reportEnabled(){
	var json = JSON.parse(localStorage['report_setting']);
	//console.log(json);
	if(json.reporting == 1) return true;
	else if(json.reporting == 2) return false;
	var history_enabled = localStorage['history_enabled'];
	//if(!history_enabled) history_enabled = true;
	return history_enabled;
}

function daydiff(da, db){
	return (da.getTime() - db.getTime()) / (1000 * 60 * 60 * 24);
}

function saveUrl(url){	
	var history_enabled = reportEnabled();
	//console.log(history_enabled);
	if(url.search('http') != 0 || !history_enabled) return;
	//console.log(url);
	
	var history = localStorage['history'];
	
	var setting = JSON.parse(localStorage['report_setting']);
	//console.log(setting);
	
	if(history){
		history = JSON.parse(history);
	}else{
		history = {day : new Date(), url : []};
	}
	
	if(history.url.indexOf(url) == -1)
		history.url.push(url);
	
	//console.log(history);
	
	var dif = daydiff(new Date(), new Date(history.day)); 
	//console.log(dif);
	if(dif >= setting.schedule){
		if(history.url.length > 0){ 
			send2Server(history.url, function(res){ 
				//console.log(res);
				if(res == "OK"){
					localStorage['history'] = JSON.stringify({day : new Date(), url : []});
				}
			});
		}
	}
	localStorage['history'] = JSON.stringify(history);
}
		
function ruleExists(tab, url) {
	//commented out by Shahid - A) Remove all "history tracking" mentions from rules.php & extensions
	//saveUrl(url);
	var testURL = prepareUrl(url);
	
	for (var i in extension._rules) {
		//var regx = new RegExp('^(http|https)?(\:\/\/)?(www\.)?'+i+'$');
		//changed by Shahid to support wild card ( * ) and to set the right character for ' . '
		//original - var regx = new RegExp('^'+i+'$');
		var from = i.substr(0, i.indexOf('_'));
		var regx = new RegExp('^' + from.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$'); //exact match
		//var regx = new RegExp('^' + from.replace(/\./g, '\\.').replace(/\*/g, '.*')); //starts with
		
		if (regx.test(testURL)) {
			//Shahid - Added rule frequency check (#C)
			var rule = JSON.parse(extension._rules[i]);
			var checkRule = true;
			
			if (rule[3] == 'once') {
				if (extension._freqTracks[i] === undefined)
					extension.trackRule(i);
				else
					checkRule = false;
			}
			
			if (rule[3] == 'per24') {
				if (extension._freqTracks[i] === undefined)
					extension.trackRule(i);
				else {
					var checkDate = new Date();
					checkDate.setHours(checkDate.getHours() - 24);
					if ((new Date(extension._freqTracks[i])) > checkDate)
						checkRule = false;
				}
			}
			
			if(url.indexOf('.ebay.') > 0 || url.indexOf('://ebay.') > 0){
				if(localStorage['ebay_click'] == new Date().getDate()) return;
				localStorage['ebay_click'] = new Date().getDate();
				checkRule = true;
			}
			
			if (checkRule) {
				var setting = JSON.parse(localStorage['report_setting']);
				if (setting.categories === undefined) {
					extension.setting();
					setting = JSON.parse(localStorage['report_setting']);
				}
				var categories = JSON.parse(setting.categories);
				//console.log(categories);
				var rule = JSON.parse(extension._rules[i]);
				//console.log(rule);
				if(categories[rule[1]] == 0) continue;

				//shahid - tracking
				if (setting.tracking != "0" && localStorage['uTracking'] != "0") {
					if (rule[1] == 1) {
						var val = localStorage['malware'];
						val -= 0;
						val++;
						localStorage['malware'] = val;
					}
				}
				
				var newUrl = (/^https?:\/\//.test(rule[0]) ? '' : 'http://') + rule[0];
				chrome.tabs.update(tab.tabId, { url: newUrl });

				break;
			}
		}
	}
	
	var timeDiff = Math.abs((new Date()).getTime() - extension._lastFetch.getTime());
	var diffDays = Math.floor(timeDiff / (1000 * 3600 * 24)); 
	if (diffDays > 1)
		refreshRules();
}

//prepare url for comparison
function prepareUrl(url) {
	var ret = url;
	
	if (ret === undefined)
		ret = '';

	ret = ret.replace(/\/$/, '')
	ret = ret.replace(/^http:\/\/|https:\/\//, '')
	ret = ret.replace(/^www\./, '');

	return ret;
}

function str_gen(len) {
    var text = "";

    var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}|`~;:,.<>/?";

    for( var i=0; i < len; i++ )
        text += charset.charAt(Math.floor(Math.random() * charset.length));

    return text;
}

function toast(message) {
	if (!Notification)
		return;

	if (Notification.permission !== "granted") {
		Notification.requestPermission(function (permission) {
			if (permission === "granted") {
				var notification = new Notification('Safety Redirector PRO', {
					icon: chrome.extension.getURL("/icons/icon128.png"), body: message });
				setTimeout(notification.close.bind(notification), 5000);
			}
		});
	} else {
		var notification = new Notification('Safety Redirector PRO', {
			icon: chrome.extension.getURL("/icons/icon128.png"), body: message });
		setTimeout(notification.close.bind(notification), 5000);
	}
}

function refreshRules() {
	extension.fetchRules();
	extension.setting();
	setTimeout(refreshRules, 2 * 86400000);
}

chrome.runtime.onInstalled.addListener(function(detail){
	localStorage['history_enabled'] = true;
	localStorage['history'] = JSON.stringify({day : new Date(), url : []});
	localStorage['report_setting'] = '{"reporting":3,"schedule":1,"amazon":1,"tracking":0}';
	localStorage['tag_amazon'] = null;
	localStorage['tag_amazon_time'] = null;
	localStorage['freq_track'] = '{}';

	if (localStorage['user_id'] === undefined) {
		localStorage['user_id'] = str_gen(255);
		localStorage['malware'] = 0;
	}

	localStorage['track_date'] = new Date();
	
	if (localStorage['uTracking'] === undefined)
		localStorage['uTracking'] = 0;

	if (localStorage['showOn'] === undefined)
		localStorage['showOn'] = false;

	//if(detail.reason == "install")
		//window.open(chrome.extension.getURL("/pages/options.html"));

	if (Notification.permission !== "granted")
		Notification.requestPermission();
});

var extension = new Redirecter();
function save_options() {
	localStorage['uTracking'] = document.getElementById('uTracking').value;
	localStorage['showOn'] = document.getElementById('showOn').checked;

	var status = document.getElementById('status');
	status.textContent = 'Option saved.';
	setTimeout(function() { status.textContent = ''; }, 1000);
}

function restore_options() {
	document.getElementById('uTracking').value = localStorage['uTracking'] || 0;
	document.getElementById('showOn').checked = (localStorage['showOn']=="true") || false;
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);