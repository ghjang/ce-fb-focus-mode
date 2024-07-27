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
        //console.log('hideDivsWithSpecificSpans called');

        const divs = document.querySelectorAll('div[data-pagelet^="FeedUnit_"]:not([style*="display: none"])');
        divs.forEach(div => {
            const spans = div.getElementsByTagName('span');
            Array.from(spans).forEach(span => {
                if (this.textsToHide.includes(span.textContent.trim())) {
                    div.style.display = 'none';
                    div.setAttribute('data-fb-focus-mode', '');
                    console.log(`hidden: ${span.textContent}`);
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

        setTimeout(() => {
            this.#hideStoriesPageLet();
            this.#hideSidebars();
        }, 100);
    };

    #handleKeyDown = (event) => {
        if (event.ctrlKey && event.shiftKey && (event.key === 'F' || event.key === 'ㄹ')) {
            this.#isActivated = !this.#isActivated;
            this.#updatePageState();
        } else {
            console.debug(
                `\tKey: ${event.key}
\tCode: ${event.code}
\tAlt key: ${event.altKey}
\tCtrl key: ${event.ctrlKey}
\tShift key: ${event.shiftKey}
\tMeta key: ${event.metaKey}
\tKey location: ${event.location}
\tRepeat: ${event.repeat}`);
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


const facebookFocusMode
    = new FacebookFocusMode([
        '광고',
        '릴스 및 짧은 동영상',
        '알 수도 있는 사람',
        '팔로우'
    ]);
facebookFocusMode.run();
