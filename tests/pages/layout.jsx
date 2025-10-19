import React from "@/frontend/react-runtime.js";

function Layout({ children }) {
  return (
    <>
      <div id="root">{children}</div>
    </>
  );
}

export default Layout;
