const textsToHide = ['광고', '릴스 및 짧은 동영상'];

const hideDivsWithSpecificSpans = () => {
    console.log('hideDivsWithSpecificSpans called');

    const divs = document.querySelectorAll('div[data-pagelet^="FeedUnit_"]:not([style*="display: none"])');
    divs.forEach(div => {
        const spans = div.getElementsByTagName('span');
        Array.from(spans).forEach(span => {
            if (textsToHide.includes(span.textContent.trim())) {
                div.style.display = 'none';
                div.setAttribute('data-fb-focus-mode', '');
            }
        });
    });
};


const hideStoriesPageLet = (hide = true) => {
    const storiesPageLet = document.querySelector('div[data-pagelet="Stories"]');
    if (storiesPageLet) {
        storiesPageLet.style.display = hide ? 'none' : '';
    }
};


const hideSidebars = (hide = true) => {
    const sidebars = document.querySelectorAll('div[data-pagelet^="LeftRail"], div[data-pagelet^="RightRail"]');
    sidebars.forEach(sidebar => {
        const sideDiv = sidebar.closest('div[role="navigation"], div[role="complementary"]');
        if (sideDiv) {
            sideDiv.style.display = hide ? 'none' : '';
        }
    });
};


let g_isActivated = false;

const updatePageState = () => {
    window.removeEventListener('scroll', hideDivsWithSpecificSpans);

    if (g_isActivated) {
        hideDivsWithSpecificSpans();
        window.addEventListener('scroll', hideDivsWithSpecificSpans);
    }

    hideStoriesPageLet(g_isActivated);
    hideSidebars(g_isActivated);
};

const handleKeyDown = (event) => {
    if (event.ctrlKey && event.shiftKey && event.key === 'F') {
        g_isActivated = !g_isActivated;
        updatePageState();
    }
};


window.addEventListener('keydown', handleKeyDown);


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'urlChanged') {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('scroll', hideDivsWithSpecificSpans);

        if (request.url === 'https://www.facebook.com/') {
            window.addEventListener('keydown', handleKeyDown);
            updatePageState();
        }
    }
});
