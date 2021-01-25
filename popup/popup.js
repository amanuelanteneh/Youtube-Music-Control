var playButton = document.getElementById("myPlayButton");
var pauseButton = document.getElementById("myPauseButton");

function sendPlayMessage(tabs) {
    for (let tab of tabs) {
      browser.tabs.sendMessage(
        tab.id,
        {greeting: "Play"}
      )
    }
  }

function sendPauseMessage(tabs) {
    for (let tab of tabs) {
      browser.tabs.sendMessage(
        tab.id,
        {greeting: "Pause"}
      )
    }
  }


playButton.addEventListener('click', function() {
    
    browser.tabs.query({
        currentWindow: true,
        //active: true
      }).then(sendPlayMessage);

});

pauseButton.addEventListener('click', function() {
    
    browser.tabs.query({
        currentWindow: true,
        //active: true
      }).then(sendPauseMessage);

});
