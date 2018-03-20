// ==UserScript==
// @name           Fantasy Baseball Price Guide for Yahoo - (MLB)
// @namespace      http://priceguide.herokuapp.com/
// @include        https://baseball.fantasysports.yahoo.com/b1/50303/*
// @version        2.2
// @grant          GM.xmlHttpRequest
// @grant          GM.setValue
// @grant          GM.getValue
// ==/UserScript==
(function() {

var priceGuideURL = "http://priceguide.herokuapp.com/index.php?t=10&l=MLB&m=260&b=1&ds=18A&dis=500&spl=&hs=70&ps=30&R=Y&RBI=Y&OBP=Y&BB=Y&TB=Y&ERA=Y&WHIP=Y&PHR=Y&K9=Y&KBB=Y&IP=Y&C=1&1B=1&2B=1&3B=1&SS=1&OF=0&LF=1&CF=1&RF=1&CI=0&MI=0&IF=0&Util=1&mg=10&SP=5&RP=4&P=0&ms=5&mr=5&o=S"
var players = new Array();

getPlayers();

document.addEventListener("DOMNodeInserted", getInfo, false);

function getInfo(event)
{
   if (event.target.tagName == "DIV")
   {
      showValues();
   }
}

function getPlayers()
{
GM.xmlHttpRequest(
{
    method: 'GET',
    url: priceGuideURL,
	  synchronous: true,
    onload: function( responseDetails )
    {
      buildPlayersHash(responseDetails.responseText);
      showValues();
    },
});
}

function buildPlayersHash(playersCSV)
{
   var playerValues = playersCSV.split("\n");

   for (var i = 0; i < playerValues.length - 1; i++)
   {
      var player = playerValues[i].split(",");
      var dollarValue = 0;

      if (player[3] > 0)
      {
         dollarValue = "$" + Number(player[3]).toFixed(0);
      }
      else
      {
         dollarValue =  "-$" + Math.abs(Number(player[3]).toFixed(0));
      }
      players[ player[0] ] = dollarValue;
   }
}

function showValues()
{
   var playerMatch = /.*sports\.yahoo\.com\/mlb\/players\/(\d\d\d\d)$/;

   var tags = document.getElementsByTagName("a");

   for (var i = 0; i < tags.length; i++)
   {
      var isPlayer = tags[i].href.match(playerMatch);

      if (isPlayer)
      {
         var playerID = isPlayer[1];
         if (players[playerID] != null)
         {
            var dollarValue = players[playerID];

            if (tags[i].innerHTML.indexOf(dollarValue) < 0)
            {
               tags[i].innerHTML = tags[i].innerHTML + " [" + dollarValue + "]";
            }
         }
      }
   }
}

})();
