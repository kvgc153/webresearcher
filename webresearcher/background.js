function handleClick() {
  browser.runtime.openOptionsPage();
}

browser.browserAction.onClicked.addListener(handleClick);

console.log("inside background.js");
browser.contextMenus.create({
  id: "eat-page",
  title: "Start WebResearcherJS"
});

/////////////////////////////////////
//// Load all modules to webpage ////
/////////////////////////////////////
var jsFiles = [
  "ext_libs/jquery.min.js",
  "ext_libs/jquery-ui.min.js",
  "ext_libs/editorjs@latest.js",
  "ext_libs/mark.min.js",
  "ext_libs/header@latest.js",
  "ext_libs/simple-image@latest.js",
  "ext_libs/list@latest.js",
  "ext_libs/code@latest.js",
  "ext_libs/quote@latest.js",
  "ext_libs/edjsHTML.js",
  "ext_libs/popper.js",
  "ext_libs/notify.min.js",
  "ext_libs/jquery.sidebar.min.js",
  "webresearcher/init.js",
  "webresearcher/handleMouseEvents.js",
  "webresearcher/loadLocalStorage.js",
  "webresearcher/saveLocalStorage.js",
  "webresearcher/export.js",
  "webresearcher/webresearcher.js"
];

var cssFiles = [
  "ext_libs/jquery-ui.min.css",
  "webresearcher/custom.css"
];

// error catching functions
function onExecuted(result) {
  console.log(`Loaded`);
}

function onError(error) {
  // alert(error);
  console.log(`Error: ${error}`);
}

// first wait for jquery, jquery-ui and others to load and then load all the small ones.. very poorly written code...
function loadJQuery(tabID){
  const executing = browser.tabs.executeScript(tabID,{
    file: jsFiles[0]
  });
  executing.then(loadJQueryUI(tabID), onError);
}

function loadJQueryUI(tabID){
  const executing =  browser.tabs.executeScript(tabID,{
    file: jsFiles[1]
  });
  executing.then(loadEditor(tabID), onError);
}

function loadEditor(tabID){
  const executing =  browser.tabs.executeScript(tabID,{
    file: jsFiles[2]

  });
  executing.then(loadOtherModules(tabID), onError);
}



// load all other modules
function loadOtherModules(tabID){
  for(var i=0;i<cssFiles.length;i++){
          const executing = browser.tabs.insertCSS(tabID,{
            file: cssFiles[i],

          });
          executing.then(onExecuted, onError);
  }
  for(var i=4;i<jsFiles.length;i++){
          const executing =  browser.tabs.executeScript(tabID,{
          file: jsFiles[i],

        });
        executing.then(onExecuted, onError);
    }

}

function handleMessage(request, sender, sendResponse) {
  console.log("Message from the content script: " + request.greeting);
  console.log(sender.tab.id);
  if(request.greeting == "load"){
    loadJQuery(sender.tab.id);
    sendResponse({response: "Response from background script"});
  }
  if(request.greeting==="save"){
    var foo_final = JSON.parse(request.data);
    var makeHTML = "<div id='title'>"+request.url+"</div>" + "<div id='tags'>"+foo_final["TAGS"]+"</div>";
    var keys = Object.keys(foo_final["WBJS_HTML_NOTES"]);
    for(var i=0;i<keys.length;i++){
      makeHTML+=foo_final["WBJS_HTML_NOTES"][keys[i]];

      // var bl = new Blob([foo_final["HTML"][keys[i]]], {type: "text/html"});
      // browser.downloads.download({
      //   'url': URL.createObjectURL(bl),
      //   // 'filename': "WBJS/" + request.url.split("/")[0]  +"/notes.json",
      //   'filename': "WBJS/" + request.url +"/note" + i + ".html",
      //   'saveAs': false,
      //   'conflictAction':"overwrite"
      // })
    }

    var bl = new Blob([makeHTML], {type: "text/html"});
    var updatedURL = request.url.replaceAll(".","_").replaceAll(":","_").replaceAll("?","_").replaceAll("=","_").replaceAll("&","_").replaceAll("#","_").replaceAll("%","_").replaceAll("@","_").replaceAll("!","_")
    browser.downloads.download({
      'url': URL.createObjectURL(bl),
      // 'filename': "WBJS/" + request.url.split("/")[0]  +"/notes.json",
      'filename': "WBJS/" + updatedURL +"/notes.html",
      'saveAs': false,
      'conflictAction':"overwrite"
    })
  }
}
// Trigger loading of modules //
browser.runtime.onMessage.addListener(handleMessage);

////////////////////////////////////////////////////////////



browser.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId == "eat-page") {
      loadJQuery();
  }
});