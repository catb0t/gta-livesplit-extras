// ==UserScript==
// @name     LiveSplit GTA Font+Key
// @author	 catb0t
// @version  0.1
// @grant    none
// ==/UserScript==

console.log("GTA Font+Key init") ;

document.getElementsByTagName("body")[0].style["background-color"] = "#00ff00";

let xp = function (p) { return document.evaluate(p, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue; }

let xhr_sync = function (url, data) {
  var xhr = new XMLHttpRequest();

  xhr.open("GET", url, false);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(data || null);
  // need an error condition here
  return xhr.responseText;
}

let inject_script = function (source_id) {
  let parts = source_id.match(/([rl])(\d+)/g),
      nr    = window.parseInt(parts[1]);

  var url = "";
  if ( "r" === parts[0] ) {
    url = ["https://raw.githubusercontent.com/catb0t/gta-livesplit-extras/master/livesplit.js"][ nr ];
  } else /* if ( "l" === parts[0] ) */ {
    url = window.location + "/livesplit.js";
  }

  let inject_js = xhr_sync(url, false);
  console.log("loading cross-site script file: " + inject_js.slice(0, 40).replace("\n", "") + "...");
  eval(inject_js);
}

let set_timer_value = function (newtime /*string*/) {
  let parts = newtime.split("."),
      timer = document.getElementsByClassName("timer-time");

  timer.item(0).innerHTML = parts[0];
  timer.item(1).innerHTML = parts[1];
}

var checkExist = window.setInterval(function() {
	let T = document.getElementsByClassName("timer-time");
  if (T.length) {
    window.clearInterval(checkExist);
		console.log(T);

    // Acquire font

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

    // Set the timer text effects: shadow (outline-like) and gradient

    let gradient = document.getElementById("Timer0-text-gradient");
    gradient.innerHTML =
      `<stop offset="0%" style="stop-color: rgb(255, 255, 255);"></stop>
      <stop offset="100%" style="stop-color: #505050;"></stop>`; // #898989, #808080

    let filter_shadow =
      `<filter id="Timer0_filter_shadow_offset" x="0" y="0" width="200%" height="200%">
        <feOffset result="offOut" in="SourceAlpha" dx="2" dy="2" />
        <feBlend in="SourceGraphic" in2="offOut" mode="normal" />
      </filter>`;
    gradient.parentNode.insertAdjacentHTML("beforeend", filter_shadow);

    // only Firefox doesn't render the shadow that livesplit intends to draw
    // clear it on all browsers for convergence
    document.body.style["text-shadow"] = "0px 0px 0px rgba(0, 0, 0, 0)";

    for (var i = 0; i < T.length; i++) {
      console.log( T.item(i).style['font-family'] = "pricedown, sans-serif" );
      console.log( T.item(i).style['stroke'] = "#000" );
      console.log( T.item(i).style['stroke-width'] = "1" );
      console.log( T.item(i).style["text-shadow"] = "0px 0px 0px rgba(0, 0, 0, 0)" ); // clearing the shadow again to be sure
      console.log( T.item(i).setAttribute("filter", "url(#Timer0_filter_shadow_offset)") );
    }

    // Going to change the behaviour of 3/4 buttons below the timer

    // Live script reloader
    let button_topleft = xp("/html/body/div/div/div[1]/div[3]/div/div[2]/div[1]/button[1]");
    button_topleft.insertAdjacentHTML("beforeend", "(Re)load script [r0|l]:");
    button_topleft.insertAdjacentHTML("afterend", `<input class="gtac" id="gtac_scriptload" type="text"></input>`);
    button_topleft.removeListeners();
    button_topleft.addEventListener("click", function () { inject_script( document.getElementById("gtac_scriptload").value ) } );

    // Setting the value directly
    let button_btmright = xp("/html/body/div/div/div[1]/div[3]/div/div[2]/div[2]/button[2]");
    button_btmright.insertAdjacentHTML("Set timer value to:");
    button_btmright.insertAdjacentHTML("afterend", `<input class="gtac" id="gtac_settimer" type="text"></input>`);
    button_btmright.removeListeners();
    button_btmright.addEventListener("click", function () { set_timer_value( document.getElementById("gtac_settimer").value ) } );

    /* button not needed: wait N milliseconds to start the timer */

    // Done setting up the layout, now operate the website

    let main_div = xp("/html/body/div/div/div[1]");

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

    // these have custom binds in the catb0t/LiveSplitOne autonomous-patch branch
    // otherwise we can't run compiled typescript from javascript -- it's inside a (function(){})()
    // import splits
    xp("/html/body/div/div/div[1]/div[1]/div/button[3]").click();
    // import layout
    xp("/html/body/div/div/div[1]/div[1]/div/button[9]").click();
    console.log("external saved data loaded");

    // close the sidebar
    xp("/html/body/div/div/div[1]/div[2]").click();

    //document.body.style.zoom = 5;
    console.log("GTA Font+Key: all done!");

    window.setTimeout(function () { xp("/html/body/div/div/div[1]/div[3]/div/div[1]").click(); }, 1000 );
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
