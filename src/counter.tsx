import React, { useState } from "react";

const Counter: React.FC = () => {
  const [counts, setCounts] = useState(0);

  return (
    <div>
      <p>testy</p>
      <p>Counter is {counts}</p>
      <button onClick={() => setCounts(counts + 1)}>Click me!</button>
    </div>
  );
};

export default Counter;
