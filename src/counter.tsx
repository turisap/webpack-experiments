import React, { useState } from "react";
import styled from "styled-components";

const StyledCounter = styled.div`
  background: #eaf4c1;
  border-radius: 8px;
  padding: 20px;
`;

const Counter: React.FC = () => {
  const [counts, setCounts] = useState(0);
  console.log("ldsj");

  return (
    <StyledCounter>
      <p>testy</p>
      <p>Counter is {counts}</p>
      <button onClick={() => setCounts(counts + 1)}>Click me!</button>
    </StyledCounter>
  );
};

export default Counter;
