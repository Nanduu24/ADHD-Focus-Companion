document.getElementById('startSession').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'start-focus-session' });
    console.log('Start focus session clicked');
  });
  
  document.getElementById('stopSession').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'stop-focus-session' });
    console.log('Stop focus session clicked');
  });
  