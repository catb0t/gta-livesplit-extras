// ==UserScript==
// @name     LiveSplit GTA Font+Key
// @author	 catb0t
// @version  0.1
// @grant    none
// ==/UserScript==

console.log("GTA Font+Key init") ;

document.getElementsByTagName("body")[0].style["background-color"] = "#00ff00";

var checkExist = setInterval(function() {
	let T = document.getElementsByClassName("timer-time");
  if (T.length) {
    clearInterval(checkExist);
		console.log(T);

    // only chrome renders the shadow that livesplit intends to draw
    // but i developed this for firefox and i don't want that third shadow
    document.body.style["text-shadow"] = "0px 0px 0px rgba(0, 0, 0, 0)";

    console.log("fetching pricedown...");
    document.getElementsByTagName("head")[0].insertAdjacentHTML(
      "afterbegin",
      `<style type="text/css">
        @font-face {
          font-family: pricedown;
          src: url("https://raw.githubusercontent.com/catb0t/gta-livesplit-extras/master/pricedown_bl.ttf") format("truetype");
        }
      </style>`
    );

    let gradient = document.getElementById("Timer0-text-gradient");
    gradient.innerHTML =
      `<stop offset="0%" style="stop-color: rgb(255, 255, 255);"></stop>
      <stop offset="100%" style="stop-color: #777;"></stop>`; // #898989, #808080

    gradient.parentNode.insertAdjacentHTML(
      "beforeend",
      `<filter id="Timer0_filter_shadow_offset" x="0" y="0" width="200%" height="200%">
        <feOffset result="offOut" in="SourceAlpha" dx="2" dy="2" />
        <feBlend in="SourceGraphic" in2="offOut" mode="normal" />
      </filter>`
    );

    for (var i = 0; i < T.length; i++) {
      console.log( T.item(i).style['font-family'] = "pricedown, sans-serif" );
      console.log( T.item(i).style['stroke'] = "#000" );
      console.log( T.item(i).style['stroke-width'] = "1" );
      console.log( T.item(i).style["text-shadow"] = "0px 0px 0px rgba(0, 0, 0, 0)" ); // clearing the shadow again to be sure
      console.log( T.item(i).setAttribute("filter", "url(#Timer0_filter_shadow_offset)") );
    }

    let xp = function (p) { return document.evaluate(p, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue; }

    let main_div = xp("/html/body/div/div/div[1]");
    //console.log(main_div)

    // open the sidebar
    main_div.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: false,
        view: window,
        button: 2,
        buttons: 0,
        clientX: main_div.getBoundingClientRect().x,
        clientY: main_div.getBoundingClientRect().y
      })
    );

    // import layout
    xp("/html/body/div/div/div[1]/div[1]/div/button[9]").click();
    // import splits
    xp("/html/body/div/div/div[1]/div[1]/div/button[3]").click();
    console.log("external saved data loaded");

    // close the sidebar
    xp("/html/body/div/div/div[1]/div[2]").click();

    document.body.style.zoom = 5;

    console.log("done!")
  }
}, 100);

/*
body background: hsl(120.5, 100%, 50%)
  /html/body
font-family: timer->pricedown
  /html/body/div/div/div[1]/div[3]/div/div[1]/div/svg/text[1]
  /html/body/div/div/div[1]/div[3]/div/div[1]/div/svg/text[2]

import layout button:
  /html/body/div/div/div[1]/div[1]/div/button[9]
  this.props.callbacks.importLayout()

import splits button:
  /html/body/div/div/div[1]/div[1]/div/button[3]
  this.props.callbacks.importSplits()
*/
