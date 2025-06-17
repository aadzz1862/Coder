import React from 'react';
import { usePopupStore } from './store';

export function DetectCompanyButton() {
  const setCompanyName = usePopupStore((s) => s.setCompanyName);

  const handleClick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id;
      if (tabId == null) return;
      chrome.tabs.sendMessage(tabId, { type: 'GET_COMPANY_NAME' }, (resp) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          return;
        }
        if (resp?.companyName) {
          setCompanyName(resp.companyName);
        }
      });
    });
  };

  return (
    <button
      className="px-2 py-1 bg-blue-500 text-white rounded w-full"
      onClick={handleClick}
    >
      Detect Company
    </button>
  );
}
