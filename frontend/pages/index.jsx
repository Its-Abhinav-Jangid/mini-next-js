import React from "@/frontend/react-runtime.js";

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
