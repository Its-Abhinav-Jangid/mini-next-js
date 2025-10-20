import React from "react";

function Home() {
  return (
    <h1>
      Home
      <button
        onClick={() => {
          console.log("button clicked");
        }}
      >
        Log
      </button>
    </h1>
  );
}

export default Home;
