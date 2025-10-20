import React from "@/.previous/static/scripts/react-runtime-client.js"react-runtime.js
import { hydrateRoot } /scripts/static/scripts/react-runtime.js"-dom/client";

(async () => {
  const pathname = window.location.pathname;

  const { default: Page } = await import(`/scripts/pages${pathname}.js`);

  hydrateRoot(document.getElementById("root"), React.createElement(Page));
})();
