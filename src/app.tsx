import React, { Suspense } from "react";
import { hot } from "react-hot-loader/root";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const Home = React.lazy(() => import("./home"));
const Counter = React.lazy(() => import("./counter"));

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
