import React, { useState } from "react";
import styled from "styled-components";

const StyledCounter = styled.div`
  background: #eaf4c1;
  border-radius: 8px;
  padding: 20px;
`;

const Counter: React.FC = () => {
  const [counts, setCounts] = useState(0);

  return (
    <StyledCounter>
      <p>testy</p>
      <img src="assets/react.png" alt="" />
      <p>Counter is {counts}</p>
      <div className="icon"></div>
      <button onClick={() => setCounts(counts + 1)}>Click me!</button>
    </StyledCounter>
  );
};

export default Counter;
