import "./index.scss";

const fn = (bigarg1, unusedone) => {
  console.log("yay!!!");

  const div = document.createElement("div");
  div.classList.add("icon");
  document.body.append(div);
};

fn();
