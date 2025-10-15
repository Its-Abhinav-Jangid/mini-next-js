import React from "react";

function Layout({ children }) {
  return (
    <>
      <div id="root">{children}</div>
    </>
  );
}

export default Layout;
