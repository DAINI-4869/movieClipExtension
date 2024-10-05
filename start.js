(function() {
    'use strict';

    // オーバーライドコードを文字列として定義
    const overrideCode = `
        (function() {
            const originalPushState = history.pushState;
            const originalReplaceState = history.replaceState;

            history.pushState = function(state, title, url) {
                const result = originalPushState.apply(this, arguments);
                window.dispatchEvent(new Event('locationchange'));
                return result;
            };

            history.replaceState = function(state, title, url) {
                const result = originalReplaceState.apply(this, arguments);
                window.dispatchEvent(new Event('locationchange'));
                return result;
            };

            window.addEventListener('popstate', function() {
                window.dispatchEvent(new Event('locationchange'));
            });
        })();
    `;

    // <script>タグを作成し、オーバーライドコードを挿入
    const script = document.createElement('script');
    script.textContent = overrideCode;
    document.documentElement.appendChild(script);
    script.parentNode.removeChild(script);

})();
