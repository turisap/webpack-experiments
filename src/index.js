import nav from "./nav";
import { top, bottom } from "./footer";
import makeButton from "./button";
import { makeColorStyle } from "./button-styles";
import { footer } from "./footer";

const button = makeButton('Yay a button!!!!');
button.style = makeColorStyle('cyan');
document.body.appendChild(button);
document.body.appendChild(footer);