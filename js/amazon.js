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