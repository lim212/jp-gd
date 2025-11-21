export default defineNuxtPlugin(() => {
  // Only run on client-side
  if (typeof window === 'undefined') return;

  // Direct implementation of LiveChat code as provided in the issue description
  window.__lc = window.__lc || {};
  window.__lc.license = 5265231;
  window.__lc.integration_name = "manual_channels";
  window.__lc.product_name = "livechat";

  // Initialize LiveChat with the standard implementation - modernized to fix ESLint errors
  (function(n, t, c) {
    function i(args) {
      return lcWidget._h ? lcWidget._h.apply(null, args) : lcWidget._q.push(args);
    }

    const lcWidget = {
      _q: [],
      _h: null,
      _v: "2.0",
      on: function(...args) {
        i(["on", c.call(args)]);
      },
      once: function(...args) {
        i(["once", c.call(args)]);
      },
      off: function(...args) {
        i(["off", c.call(args)]);
      },
      get: function(...args) {
        if (!lcWidget._h) {
          throw new Error("[LiveChatWidget] You can't use getters before load.");
        }
        return i(["get", c.call(args)]);
      },
      call: function(...args) {
        i(["call", c.call(args)]);
      },
      init: function() {
        const script = t.createElement("script");
        script.async = true;
        script.type = "text/javascript";
        script.src = "https://cdn.livechatinc.com/tracking.js";
        t.head.appendChild(script);
      }
    };

    if (!n.__lc.asyncInit) {
      lcWidget.init();
    }

    n.LiveChatWidget = n.LiveChatWidget || lcWidget;
  })(window, document, [].slice);

  // Add a fallback link for users with JavaScript disabled
  if (document && document.body) {
    const noscriptElement = document.createElement('noscript');
    noscriptElement.innerHTML = '<a href="https://www.livechat.com/chat-with/5265231/" rel="nofollow">Chat with us</a>, powered by <a href="https://www.livechat.com/?welcome" rel="noopener nofollow" target="_blank">LiveChat</a>';
    document.body.appendChild(noscriptElement);
  }
});
