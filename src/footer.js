import { red, blue } from './button-styles';
import './styles/footer.css';

const top = document.createElement('div');
top.innerText = "Top of the footer";
top.style = blue;
const bottom = document.createElement('div');
bottom.innerText = "Bottom of the footer";
bottom.style = red;

const footer = document.createElement('footer');
footer.appendChild(top);
footer.appendChild(bottom);

export { top, bottom, footer };