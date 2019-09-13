import nav from "./nav";
import { top, bottom } from "./footer";
import logo from '../assets/webpack.jpg'
import makeButton from "./button";
import { makeColorStyle } from "./button-styles";
import { footer } from "./footer";
import makeImg from "./image";
import './styles/footer.css';
import './styles/button.css';

const image = makeImg(logo);
const button = makeButton('Yay a button!!!!');
button.style = makeColorStyle('cyan');
document.body.appendChild(button);
document.body.appendChild(footer);
document.body.appendChild(image);
