function handleResponse(message) {
  console.log(`Message from the background script:  ${message.response}`);
}

function handleError(error) {
  console.log(`Error: ${error}`);
}

function notifyBackgroundPage(e) {
  let sending = browser.runtime.sendMessage({
    greeting: "load"
  });
  sending.then(handleResponse, handleError);
}


notifyBackgroundPage();
