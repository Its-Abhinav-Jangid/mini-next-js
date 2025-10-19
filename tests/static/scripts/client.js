import React from "@/frontend/react-runtime.js"react-runtime.js
import { hydrateRoot } /scripts/static/scripts/react-runtime.js"-dom/client";

(async () => {
  const pathname = window.location.pathname;

  const { default: Page } = await import(`/scripts/pages${pathname}.js`);

  hydrateRoot(document.getElementById("root"), React.createElement(Page));
})();
