import React from "react";

function Layout({ children }) {
  return (
    <>
      <div id="root">{children}</div>
      <script type="module" src="/scripts/static/scripts/client.js"></script>
    </>
  );
}

export default Layout;
