import React, { useEffect } from "react";
// import { hot } from "react-hot-loader/root";
import Loadable from "react-loadable";
import styled from "styled-components";

const Loading = styled.div`
  width: 900px;
  height: 300px;
  background: red;
`;

const Home = Loadable({
  loader: () => import(/* webpackChunkName: "settings" */ "./Home"),
  loading: Loading,
});
const Counter = Loadable({
  loader: () => import(/* webpackChunkName: "counter" */ "./Counter"),
  loading: Loading,
});

const App = () => {
  useEffect(() => {
    import("./Ololo").then(console.log);
  });

  return (
    <>
      <h1>App with a counter</h1>
      <Counter />
      <Home />
    </>
  );
};

// export default hot(App);
export default App;
