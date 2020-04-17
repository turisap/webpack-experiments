import React from "react";
// import { hot } from "react-hot-loader/root";
import * as Loadable from "react-loadable/lib/index";
// import styled from "styled-components";

// const Loading = styled.div`
//   width: 900px;
//   height: 300px;
//   background: red;
// `;

const Home = Loadable({
  loader: () => import(/* webpackChunkName: "settings" */ "./Home"),
});

const Counter = Loadable({
  loader: () => import(/* webpackChunkName: "settings" */ "./Counter"),
});

const Me = Loadable({
  loader: () => import(/* webpackChunkName: "settings" */ "./Ololo"),
});

const App = () => {
  return (
    <>
      <h1>App with a counter</h1>
      <Home />
      <Counter />
      <Me />
    </>
  );
};

// export default hot(App);
export default App;
