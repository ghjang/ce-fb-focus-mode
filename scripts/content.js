class FacebookFocusMode {
    textsToHide;
    #isActivated;
    #throttledHideDivsWithSpecificSpans;

    constructor(textsToHide = []) {
        this.textsToHide = textsToHide;
        this.#isActivated = false;
        this.#throttledHideDivsWithSpecificSpans = _.throttle(this.#hideDivsWithSpecificSpans, 100);
    }

    get isActivated() {
        return this.#isActivated;
    }

    #hideDivsWithSpecificSpans = () => {
        console.log('hideDivsWithSpecificSpans called');

        const divs = document.querySelectorAll('div[data-pagelet^="FeedUnit_"]:not([style*="display: none"])');
        divs.forEach(div => {
            const spans = div.getElementsByTagName('span');
            Array.from(spans).forEach(span => {
                if (this.textsToHide.includes(span.textContent.trim())) {
                    div.style.display = 'none';
                    div.setAttribute('data-fb-focus-mode', '');
                }
            });
        });
    };

    #hideStoriesPageLet = () => {
        const storiesPageLet = document.querySelector('div[data-pagelet="Stories"]');
        if (storiesPageLet) {
            storiesPageLet.style.display = this.isActivated ? 'none' : '';
        }
    };

    #hideSidebars = () => {
        const sidebars = document.querySelectorAll('div[data-pagelet^="LeftRail"], div[data-pagelet^="RightRail"]');
        sidebars.forEach(sidebar => {
            const sideDiv = sidebar.closest('div[role="navigation"], div[role="complementary"]');
            if (sideDiv) {
                sideDiv.style.display = this.isActivated ? 'none' : '';
            }
        });
    };

    #updatePageState = () => {
        window.removeEventListener('scroll', this.#throttledHideDivsWithSpecificSpans);

        if (this.isActivated) {
            this.#throttledHideDivsWithSpecificSpans();
            window.addEventListener('scroll', this.#throttledHideDivsWithSpecificSpans);
        }

        this.#hideStoriesPageLet();
        this.#hideSidebars();
    };

    #handleKeyDown = (event) => {
        if (event.ctrlKey && event.shiftKey && event.key === 'F') {
            this.#isActivated = !this.#isActivated;
            this.#updatePageState();
        }
    };

    #handleMessage = (request, sender, sendResponse) => {
        if (request.message === 'urlChanged') {
            window.removeEventListener('keydown', this.#handleKeyDown);
            window.removeEventListener('scroll', this.#throttledHideDivsWithSpecificSpans);

            if (request.url === 'https://www.facebook.com/') {
                window.addEventListener('keydown', this.#handleKeyDown);
                this.#updatePageState();
            }
        }
    };

    run() {
        window.addEventListener('keydown', this.#handleKeyDown);
        chrome.runtime.onMessage.addListener(this.#handleMessage);
    }
}


const facebookFocusMode = new FacebookFocusMode(['광고', '릴스 및 짧은 동영상']);
facebookFocusMode.run();
