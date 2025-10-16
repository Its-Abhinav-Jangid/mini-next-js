import React from "react";
import { hydrateRoot } from "react-dom/client";

(async () => {
  const pathname = window.location.pathname;
  console.log("Pathname:", pathname);

  const { default: Page } = await import(`/scripts/pages${pathname}.js`);

  hydrateRoot(document.getElementById("root"), React.createElement(Page));
})();
