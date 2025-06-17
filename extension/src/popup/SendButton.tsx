import React from 'react';
export function SendButton() {
  const handleSend = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      if (tabId == null) return;
      chrome.tabs.sendMessage(tabId, { type: 'SCRAPE_LEADS' });
    });
  };

  return (
    <button
      className="px-2 py-1 bg-green-600 text-white rounded w-full"
      onClick={handleSend}
    >
      Send referral requests
    </button>
  );
}
