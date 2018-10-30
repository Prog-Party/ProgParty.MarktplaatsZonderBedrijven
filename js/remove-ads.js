class RemoveMarktplaatsAds {
	
	constructor() {
		this.amountTries = 10;
		this.timeout = 500;
	}
	
	tryRemoveSearch() {
		
		//remove the top ad
		this.tryRemove("#adsense-top");
		
		//remove banner rubrieks
		this.tryRemove("#banner-rubrieks-dt");
		
		//remove banner on top of page
		this.tryRemove("iframe[id^='google_ads_iframe']");
		this.tryRemove("div[id^='google_ads_iframe']");
		this.tryRemove("#banner-top-dt");
		
		//remove ad at left side of the page
		//this.tryRemove("#ad_unit");
		this.tryRemove(".sticky-banner");
		
		//remove banner in the middle of the search results
		this.tryRemove(".adsense-for-shopping-srp-container");
		
		//remove the ads with a link
		this.tryRemoveParent(".seller-link > .juiceless-link", "ARTICLE");
		
		//remove bottom cas ads
		this.tryRemoveParentByClass(".seller-link > .juiceless-link", "bottom-listing");
		//remove bottom cas ads header
		this.tryRemove("div > span:contains('Advertenties door Admarkt')");
		
		//this.tryRemove("#adsense-bottom");
		
		this.tryRemove("div.location-name:contains('Bezorgt in')");
		
		this.tryRemoveParent("a[href$='.html?lr_snippet=horizontalRichSnippet']", "ARTICLE");
		
		this.tryRemoveCompaniesByUrl();
	}
	
	tryRemoveCompaniesByUrl()
	{
		var allLinks = [];
		$(".seller-name a").each(function(i, o) {
			var href = $(o).attr("href");
			if(allLinks.indexOf(href) == -1)
				allLinks.push(href);
		});
		
		console.log("Start with sellers: " + $(".seller-name a").length);
		var verkoperLinksToRemove = [];
		for(var i = 0; i < allLinks.length; i++)
		{
			var verkoperLink = allLinks[i];
			$.get(verkoperLink,
				function(data) {
					if(data.indexOf("verkopers-profiel") >= 0)
					{
						var firstIndex = data.indexOf("https://www.marktplaats.nl/verkopers/");
						var secondIndex = data.indexOf(".html", firstIndex);
						var url = data.substring(firstIndex, secondIndex) + ".html";
						console.log("Found some url: " + url);
						_removeMarktplaatsAds.tryRemoveParent(".seller-name a[href='" + url + "']", "ARTICLE");
					}
				}
			);
		}

		//todo: add those companies to some local storage so that we can use that as a lookup
		//todo: send those companies once every .... to some api of ourselves, so that we can distrubute those
	}
	
	tryRemove(selector, count)
	{
		if(count === undefined) { count = _removeMarktplaatsAds.amountTries; }
		else if(count <= 0) { return; }
		
		var elem = $(selector);
		if(elem.length == 0)
		{
			console.log("Try remove.... " + selector);
			count--;
			setTimeout(function(s,c) {_removeMarktplaatsAds.tryRemove(s, c);}, _removeMarktplaatsAds.timeout, selector, count);
		} else {
			console.log("Removed ad: " + selector);
			elem.each(function(i, o) { $(o).remove(); });
		}
	}
	
	tryRemoveParent(selector, parentSelector, count)
	{
		if(count === undefined) { count = _removeMarktplaatsAds.amountTries; }
		else if(count <= 0) { return; }
		
		var col = $(selector);
		if(col.length == 0)
		{
			console.log("Try remove.... " + selector);
			count--;
			setTimeout(function(s,p,c) { tryRemoveParent(s, p, c); },_removeMarktplaatsAds.timeout, selector, parentSelector, count);
		} else {
			console.log("Try removing ad by tagname: " + selector);
			col.each(function(i, o) { 
				var parentElem = $(o).parent();
				while(parentElem != undefined && parentElem.length != 0)
				{
					if(parentElem.prop("tagName") == parentSelector) {
						console.log("Removed by tagname: parentElem: " + parentElem.prop("tagName"));
						$(parentElem).remove();
						break;
					}
					parentElem = $(parentElem).parent();
				}
			});
		}
	}
	
	tryRemoveParentByClass(selector, parentClass, count)
	{		
		if(count === undefined) { count = _removeMarktplaatsAds.amountTries; }
		else if(count <= 0) { return; }
		
		var col = $(selector);
		if(col.length == 0)
		{
			console.log("Try remove.... " + selector);
			count--;
			setTimeout(function(s,p,c) { _removeMarktplaatsAds.tryRemoveParentByClass(s, p, c); }, _removeMarktplaatsAds.timeout, selector, parentClass, count);
		} else {
			console.log("Try removing ad by class: " + selector);
			col.each(function(i, o) { 
				var parentElem = $(o).parent();
				while(parentElem != undefined && parentElem.length != 0)
				{
					if($(parentElem).hasClass(parentClass)) {
						console.log("Removed by class: parentElem: " + parentElem.class);
						$(parentElem).remove();
						break;
					}
					parentElem = $(parentElem).parent();
				}
			});
		}
	}
	
	doRemove() {
		
	}
}

var _removeMarktplaatsAds = new RemoveMarktplaatsAds();