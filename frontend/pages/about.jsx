import React, { useState } from "react";

function about() {
  const [num, setNum] = useState(0);
  return (
    <div>
      <h1>About me</h1>

      {num}
      <button onClick={()=> setNum(num + 1)}>Increase</button>
    </div>
  );
}

export default about;
