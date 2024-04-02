chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        const url = new URL(changeInfo.url);
        if (url.hostname === 'www.facebook.com' && (url.pathname === '/' || url.pathname.startsWith('/'))) {
            const cleanUrl = url.protocol + '//' + url.host + url.pathname;
            chrome.tabs.sendMessage(tabId, {
                message: 'urlChanged',
                url: cleanUrl
            }).catch(error => {
                console.error('error sending message to content script:', error);
            });
        }
    }
});
