import React from "react";
import * as R from "ramda";

const Home: React.FC = () => {
  const arr = [];
  R.times(() => arr.push(0), 1000);
  return <div>HoMe</div>;
};

export default Home;
