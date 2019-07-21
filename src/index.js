import { hello } from "./hello";
import quoteImage from "./assets/quote-fight-club.jpg";
import "./style.css";
// other media files can also be imported the same way.
// audio example
// const audio = new Audio(song);
// audio.play();

hello("Webpack testing!");

document.body.innerHTML = '<div id="myImage"></div>';
document.getElementById("myImage").innerHTML = `
  <h1>A random quote</h1>
  <img src="${quoteImage}"/>
`;