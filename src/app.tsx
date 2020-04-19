import React from "react";
import { hot } from "react-hot-loader/root";
import loadable from "@loadable/component";

export const Home = loadable(() => import("./Home"));

export const Counter = loadable(() => import("./Counter"));

const App = () => {
  return (
    <>
      <h1>App with a counter</h1>
      <Home />
      <Counter />
    </>
  );
};

export default hot(App);
