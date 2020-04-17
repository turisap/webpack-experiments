import React from "react";
import { hot } from "react-hot-loader/root";
import Loadable from "react-loadable";
import styled from "styled-components";

const Loading = styled.div`
  width: 900px;
  height: 300px;
  background: red;
`;

const Home = Loadable({
  loader: () => import("./home") /* webpackChunkName: "settings" */,
  loading: Loading,
});
const Counter = Loadable({
  loader: () => import("./counter") /* webpackChunkName: "counter" */,
  loading: Loading,
});

const App = () => (
  <>
    <h1>App with a counter</h1>
    <Counter />
    <Home />
  </>
);

export default hot(App);
