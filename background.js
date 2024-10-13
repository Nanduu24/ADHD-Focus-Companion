// Function to store focus session data in Chrome's local storage
function saveFocusSession(sessionData) {
    const sessionId = Date.now();  // Use timestamp as session ID
    chrome.storage.local.set({ [sessionId]: sessionData }, () => {
      console.log('Session data saved locally:', sessionData);
    });
  }
  
  // Track heart rate every minute (simulated)
  setInterval(() => {
    const heartRate = getHeartRateFromAppleWatch();
    console.log("Heart Rate: ", heartRate); // Log the heart rate
  
    // Trigger inattentiveness if heart rate exceeds a certain threshold (e.g., 100 bpm)
    if (heartRate > 100) {
      chrome.runtime.sendMessage({ action: 'inattentive', triggeredBy: 'heart-rate' });
    }
  }, 60000);
  
  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'start-focus-session') {
      console.log('Starting focus session...');
      startFocusSession();  // Call function to handle focus session start
    }
  
    if (message.action === 'stop-focus-session') {
      console.log('Stopping focus session...');
      stopFocusSession();  // Call function to handle focus session stop
    }
    
    if (message.action === "inattentive") {
      // Fetch the user's selected settings and trigger appropriate actions
      chrome.storage.local.get(['settings'], (result) => {
        const settings = result.settings || {};
  
        if (settings.playNoise) playBrownNoise();
        if (settings.suggestYoga) suggestYoga();
        if (settings.takeBreak) takeBreak();
        if (settings.guidedBreathing) startGuidedBreathing();
      });
  
      // Save inattention event locally
      saveFocusSession({
        timestamp: Date.now(),
        event: "inattentive",
        triggeredBy: message.triggeredBy || 'eye-tracking/heart-rate',
        heartRate: getHeartRateFromAppleWatch(),
      });
    }
  });
  
  // Function to start a focus session
  function startFocusSession() {
    console.log("Focus session started...");
    // Add any logic related to starting a focus session
    const sessionData = {
      timestamp: Date.now(),
      event: "focus-session-started"
    };
    saveFocusSession(sessionData);
  }
  
  // Function to stop a focus session
  function stopFocusSession() {
    console.log("Focus session stopped...");
    // Add any logic related to stopping a focus session
    const sessionData = {
      timestamp: Date.now(),
      event: "focus-session-stopped"
    };
    saveFocusSession(sessionData);
  }
  
  // Simulated functions for different actions
  function playBrownNoise() {
    const audio = new Audio('brown-noise.mp3');
    audio.play();
  }
  
  function suggestYoga() {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon.png",
      title: "Yoga Suggestion",
      message: "Try this simple yoga stretch to reset focus!"
    });
  }
  
  function takeBreak() {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon.png",
      title: "Take a Break",
      message: "It's time to take a 5-minute break to relax."
    });
  }
  
  function startGuidedBreathing() {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon.png",
      title: "Guided Breathing",
      message: "Start your guided breathing exercise for 2 minutes."
    });
  }
  
  // Function to simulate fetching heart rate from Apple Watch
  function getHeartRateFromAppleWatch() {
    return Math.floor(Math.random() * (120 - 60 + 1)) + 60;  // Simulate random heart rate
  }
  