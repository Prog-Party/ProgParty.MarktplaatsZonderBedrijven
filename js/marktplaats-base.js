$(function(){
	
	if(window.location.href.includes("/z/") ||
		window.location.href.includes("z.htm")) { 
		_removeMarktplaatsAds.tryRemoveSearch();
	}
});

function tryLoadFrame(loadFrameFunction)
{
	var col = $("section.search-results-table");
	if(col.length == 0)
	{
		setTimeout(function() { tryLoadFrame(loadFrameFunction); }, 1000);
	} else {
		loadFrameFunction();
	}
}

function loadProjectFrame() {
	$("article").css("background-color", "pink");
	$("#banner-rubrieks-dt").hide();
	
	//$.get(chrome.extension.getURL('/project-page.html'), function(dataHtml) {  });
}


function AppendJavascript(js)
{
	var javascript = "<script type='text/javascript'>" + js + "</script>";
	AppendHtml(javascript);
}

function AppendHtml(html)
{
	$("body").prepend(html);
}
