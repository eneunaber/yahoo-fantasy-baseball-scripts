// ==UserScript==
// @name           	Pre-Rank Players For Yahoo Standard Draft
// @namespace      	com.yahoo.fantasy.baseball
// @copyright      	2012-13, Eric Neunaber, Mays Copeland (http://www.lastplayerpicked.com) and Bert Sanders
// @include         http://baseball.fantasysports.yahoo.com/b1/127440/1/editprerank*
// @grant           GM_xmlhttpRequest
// @require  	    	http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.1.min.js
// ==/UserScript==
(function() {
   var priceGuideURL = http://www.draftbuddy.com/baseball/lastplayerpicked/index.php?t=14&l=MLB&m=260&b=1&ds=14E&dis=500&spl=&hs=70&ps=30&R=Y&RBI=Y&OBP=Y&BB=Y&TB=Y&ERA=Y&WHIP=Y&PHR=Y&K9=Y&KBB=Y&IP=Y&C=1&1B=1&2B=1&3B=1&SS=1&OF=0&LF=1&CF=1&RF=1&CI=0&MI=0&IF=0&Util=1&mg=10&SP=6&RP=3&P=0&ms=5&mr=5&o=S";
   var players = new Array();

   getPlayers();

   window.addEventListener("load", function(e) {
      //activateSaveButton();
   }, false);

   function PlayerClass(_id, _price){
      this.Id = _id;
      this.Price = _price;
    }

    function playerPriceSortDesc(a, b) 
    { 
      if(Number(a.Price) > Number(b.Price)) 
        return -1 
      if(Number(a.Price) < Number(b.Price)) 
        return 1 
      return 0 
    } 

   function populatePrices(){
      var playerMatch = /.*sports\.yahoo\.com\/mlb\/players\/(\d\d\d\d)$/;

      try{
        var sortedPlayersDesc = players.sort(playerPriceSortDesc);

        jQuery('select[name="myPlayersL"]').empty();


        //$('#lstBox2').append($(selectedOpts).clone());
        //$(selectedOpts).remove();


        $.each(sortedPlayersDesc, function(index, value) {
          if(Number(index) < 800){
           //console.log("Item: " + value.Id + " || " + value.Price + " | " + index);
           //console.log(jQuery('select[name=allPlayersL]').children("option[value=" + value.Id + "]"));
           jQuery('select[name="myPlayersL"]').append(jQuery('select[name=allPlayersL]').children("option[value=" + value.Id + "]"));
           jQuery('select[name=allPlayersL]').children("option[value=" + value.Id + "]").remove();
          }});
      }
      catch(ex){
        console.log("Blue Balls");
      }
    }

   function activateSaveButton()
   {
      var lastCheckbox = $('input[name$="[is_excluded]"]').last();
      var isChecked = $(lastCheckbox).prop("checked");
      $(lastCheckbox).prop("checked", !isChecked);
      $(lastCheckbox).prop("checked", isChecked);

      console.log("activateSaveButton...");
   }


   function getPlayers()
   {
      GM_xmlhttpRequest(
      {
          method: 'GET',
          url: priceGuideURL,
          onload: function( responseDetails )
          {
            buildPlayersHash(responseDetails.responseText);
            populatePrices();
          },
      });
   }

   function buildPlayersHash(playersCSV)
   {
      var playerValues = playersCSV.split("\n");
      try{
        for (var i = 0; i < playerValues.length - 1; i++){
          var player = playerValues[i].split(",");
          var dollarValue = 0;

          if(!isNaN(player[3])){
            dollarValue =  Number(player[3]).toFixed(0);
          }

          if(player[0]!=''){
            players.push(new PlayerClass(player[0], dollarValue));
          }

          /*if(players.length <= 10){
            console.log("playerID: " + player[0] + " || value: " + dollarValue);
          }*/
        }
      }
      catch(ex){
        console.log("shit went wrong");
      }
   }
})();

/*
      for (var i = 0; i < playerValues.length - 1; i++){
       if(i < 100) {
        var player = playerValues[i].split(",");
        if(player.length != 4){
         // console.log(player.length + " | " + player[0] + "|, |" + player[1] + "|, |" + player[2]+ "|, |" + player[3]+ "|, |" + player[4] + "|");
         console.log("|" + playerValues[i] + "|"); 
        }
       }
      }
*/

/* jQuery('select[name=allPlayersL]').children("option").each(function(index, elm){
        console.log(elm.value + " || " + elm.text + " || " + players[elm.value]); 
      }); */


