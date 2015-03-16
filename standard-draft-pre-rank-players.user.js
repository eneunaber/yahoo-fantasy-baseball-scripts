// ==UserScript==
// @name           	Pre-Rank Players For Yahoo Standard Draft
// @namespace      	com.yahoo.fantasy.baseball
// @copyright      	2012-13, Eric Neunaber, Mays Copeland (http://www.lastplayerpicked.com) and Bert Sanders
// @include         http://baseball.fantasysports.yahoo.com/b1/*/*/editprerank*
// @grant           GM_xmlhttpRequest
// @grant			GM_registerMenuCommand
// @require  	    http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.1.min.js
// ==/UserScript==
var priceGuideURL = "http://priceguide.herokuapp.com/index.php?t=14&l=MLB&m=260&b=1&ds=15E&dis=500&spl=&hs=70&ps=30&R=Y&RBI=Y&OBP=Y&BB=Y&TB=Y&ERA=Y&WHIP=Y&PHR=Y&K9=Y&KBB=Y&IP=Y&C=1&1B=1&2B=1&3B=1&SS=1&OF=0&LF=1&CF=1&RF=1&CI=0&MI=0&IF=0&Util=1&mg=10&SP=6&RP=3&P=0&ms=5&mr=5&o=S";
var players = new Array();

//== Utility functions
function PlayerClass(_id, _price) {
	this.Id = _id;
	this.Price = _price;
}

function playerPriceSortDesc(a, b) {
	if (Number(a.Price) > Number(b.Price)) {
		return -1
	}
	if (Number(a.Price) < Number(b.Price)) {
		return 1
	}
	return 0
}

function logException(ex) {
	console.log("===Exception Occurred===");
	console.log(ex.message);
}

//== Register menu action
GM_registerMenuCommand("Set Draft Order", setDraftOrder);

//== Main
function setDraftOrder() {
	//23 clicks
	getPlayers();
}

function getPlayers() {
	console.log("Begin fetching player data");
	GM_xmlhttpRequest({
		method : 'GET',
		url : priceGuideURL,
		onload : function (responseDetails) {
			buildPlayersHash(responseDetails.responseText);
            console.log("calling populatePrices...");
			populatePrices(50);			
		},
		onerror : function (responseDetails) {
			console.log("bad things happened...");
		}
	});
}

function buildPlayersHash(playersCSV) {
	var playerValues = playersCSV.split("\n");
	var dollarValueIndex = 3;
	var yahooPlayerIdIndex = 0;

	try {
		for (var i = 0; i < playerValues.length - 1; i++) {
			var player = playerValues[i].split(",");
			var dollarValue = 0;

			if (!isNaN(player[dollarValueIndex])) {
				dollarValue = Number(player[dollarValueIndex]).toFixed(0);
			}

			if (player[yahooPlayerIdIndex] != '') {
				players.push(new PlayerClass(player[yahooPlayerIdIndex], dollarValue));
			}

			/*
			if (players.length <= 10) {
				console.log("playerID: " + player[0] + " || value: " + dollarValue);
			}
			*/
		}
	} catch (ex) {
		logException(ex);
	}
}

function populatePrices(stopAt) {
	var playerMatch = /.*sports\.yahoo\.com\/mlb\/players\/(\d\d\d\d)$/;
	var blockCount = 50;
	
	console.log("inside populatePrices, stopAt: " + stopAt);
	try {
		if(stopAt > 800) {
			console.log("stopping....");
			return;
		}
		
		var sortedPlayersDesc = players.sort(playerPriceSortDesc);
		var filteredList = sortedPlayersDesc.slice(stopAt-blockCount, stopAt); 
		$.each(filteredList, function (index, player) {
			//console.log("player.id: " + player.id + " || price: " + player.Price + " || index: " + index);
			$("#all_player_list")
				.find("div[data-playerid="+ player.Id +"]")
				.children("div")
				.children("span:nth-child(2)")
				.trigger( "click" );
		});
		setTimeout(populatePrices(stopAt+blockCount), 5000);
	} catch (ex) {
		logException(ex);
	}
}
