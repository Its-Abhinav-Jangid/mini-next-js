import React from "@/frontend/react-runtime.js";

function about() {
  function handleClick() {
    console.log("clicked");
  }
  return (
    <div>
      <h1>About me</h1>
      <button onClick={handleClick}>click</button>
    </div>
  );
}

export default about;
