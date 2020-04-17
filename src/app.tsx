import React from "react";
// import { hot } from "react-hot-loader/root";
import loadable from "@loadable/component";
// import styled from "styled-components";

// const Loading = styled.div`
//   width: 900px;
//   height: 300px;
//   background: red;
// `;

export const Home = loadable(
  /* webpackChunkName: "homey" */ () => import("./Home")
);

export const Counter = loadable(
  /* webpackChunkName: "counter" */ () => import("./Counter")
);

export const Person = loadable(
  /* webpackChunkName: "ololosh" */ () => import("./Ololo")
);

const App = () => {
  return (
    <>
      <h1>App with a counter</h1>
      <Home />
      <Counter />
      <Person />
    </>
  );
};

// export default hot(App);
export default App;
