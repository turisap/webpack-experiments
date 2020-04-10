import "./index.scss";

const fn = (): number => {
  console.log("yay!!!");

  const n = 9;

  const div = document.createElement("div");
  div.classList.add("icon");
  document.body.append(div);

  return 4;
};

fn();
