document.addEventListener('DOMContentLoaded', function() {
  const noteTextarea = document.getElementById('note');
  const saveButton = document.getElementById('save');

  // Function to save note for the current tab
  function saveNote() {
    const note = noteTextarea.value;
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const tabId = tabs[0].id;
      const data = {};
      data[tabId.toString()] = note;
      chrome.storage.local.set(data);
    });
  }

  // Function to load note for the current tab
  function loadNote() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const tabId = tabs[0].id;
      chrome.storage.local.get([tabId.toString()], function(result) {
        if (result[tabId]) {
          noteTextarea.value = result[tabId];
        } else {
          noteTextarea.value = '';
        }
      });
    });
  }

  // Load saved note for the current tab when popup is opened
  loadNote();

// Save note when Save button is clicked
saveButton.addEventListener('click', function() {
  saveNote();
  // Add pulsing animation class
  saveButton.classList.add('pulsing');
  // Remove pulsing animation class after 1 second
  setTimeout(function() {
    saveButton.classList.remove('pulsing');
  }, 1000);
});


  // Save note when Enter key is pressed
  noteTextarea.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      saveNote();
    }
  });

  // Update note when active tab is changed
  chrome.tabs.onActivated.addListener(function(activeInfo) {
    loadNote();
  });
});

