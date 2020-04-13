import { hot } from "react-hot-loader/root";
import React from "react";
import Counter from "./counter";

const App = () => (
  <>
    <h1>App with a counter</h1>
    <Counter />
  </>
);

export default hot(App);
