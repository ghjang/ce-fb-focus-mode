const textsToHide = ['광고', '릴스 및 짧은 동영상'];


let isActivated = false;

const hideDivsWithSpecificSpans = () => {
    if (!isActivated) return;

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


window.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.shiftKey && event.key === 'F') {
        isActivated = !isActivated;

        if (isActivated) {
            hideDivsWithSpecificSpans();
            window.addEventListener('scroll', hideDivsWithSpecificSpans);
        } else {
            window.removeEventListener('scroll', hideDivsWithSpecificSpans);
        }

        hideStoriesPageLet(isActivated);
        hideSidebars(isActivated);
    }
});
