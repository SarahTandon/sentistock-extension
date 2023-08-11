/* chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'extract') {
  //if (message === 'getURL') {
    const currentUrl = window.location.href;

    if (currentUrl.includes('finance.yahoo.com/quote/')) {
      extractFromYahoo();
    } else if (currentUrl.includes('investing.com/equities/')) {
      extractFromInvesting();
    } else if (currentUrl.includes('cnbc.com/quotes/')) {
      console.log('we reached CNBC!!')
      extractFromCNBC();
    }
  }
});

function extractFromYahoo() {
  const targetClass = 'D(ib) Fz(18px)';
  const targetElement = document.querySelector('.' + targetClass);
  
  if (targetElement) {
    const textContent = targetElement.textContent;
    const matches = textContent.match(/\(([^)]+)\)/);
    
    if (matches && matches.length > 1) {
      const extractedText = matches[1];
      sendResponse({ text: extractedText });
    }
  }
} 

function extractFromInvesting() {
  const targetClass = 'text-xl text-left font-bold leading-7 md:text-3xl md:leading-8';
  const targetElement = document.querySelector('.' + targetClass);
  
  if (targetElement) {
    const textContent = targetElement.textContent;
    const matches = textContent.match(/\(([^)]+)\)/);
    
    if (matches && matches.length > 1) {
      const extractedText = matches[1];
      sendResponse({ text: extractedText });
    }
  }
}

function extractFromCNBC() {
  const targetClass = 'QuoteStrip-symbolAndExchange';
  const targetElement = document.querySelector('.' + targetClass);
  
  if (targetElement) {
    const textContent = targetElement.textContent;
    const extractedText = textContent.split(':')[0].trim();
    sendResponse({ text: extractedText });
  }
} */


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message === 'getURL') {
      const currentURL = window.location.href;
      const targetPattern_cnbc = "cnbc.com/quotes/";
      const targetPattern_yahoo = "";
      const targetPattern_investing = "";
      const targetPattern_google = "";
      const targetPattern_marketWatch = "";
      const targetPattern_bloomberg = "";
      const targetPattern_wsj = "";


      // Check if the URL contains the target pattern
      if (currentURL.includes(targetPattern_cnbc)) {
        const extractedPart = currentURL.substring(currentURL.indexOf(targetPattern_cnbc) + targetPattern_cnbc.length);
        sendResponse(extractedPart); // Send the extracted part back to the pop-up
      } 
      else {
        sendResponse(null); // If the URL doesn't match the pattern, send null
      }
    }
  }); 
  