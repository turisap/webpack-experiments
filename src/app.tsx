import React, { Suspense } from "react";
import { hot } from "react-hot-loader/root";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
// import Loadable from "react-loadable";
// import styled from "styled-components";
import Home from "./home";
import Counter from "./counter";

// const Loading = styled.div`
//   width: 900px;
//   height: 300px;
//   background: red;
// `;

// const Home = Loadable({
//   loader: () => import("./home") /* webpackChunkName: "settings" */,
//   loading: Loading,
// });
// const Counter = Loadable({
//   loader: () => import("./counter") /* webpackChunkName: "counter" */,
//   loading: Loading,
// });

const App = () => (
  <>
    <h1>App with a counter</h1>
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">home page</Link>
            </li>
            <li>
              <Link to="/counter">counter page</Link>
            </li>
            <li>
              <Link to="/counter">ololoevsk</Link>
            </li>
          </ul>
        </nav>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route path="/counter">
              <Counter />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Suspense>
      </div>
    </Router>
  </>
);

export default hot(App);
