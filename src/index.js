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

// importing files based on a pattern 
const outputs = [1, 2].map(modNum =>
  import(`./module-${modNum}`).then(mod => mod.default())
);

Promise.all(outputs).then(outs => console.log(outs.join(" and ")));

// Dynamically importing a file only when an even is triggered.
// This can be verified in a network call
const lazyButton = document.createElement("button");
lazyButton.innerText = "😴";
lazyButton.style = "margin: 10px auto; display: flex; font-size: 4rem";
lazyButton.onclick = () =>
  import(/* webpackChunkName: "myAwesomeLazyModule" */ "./lazy-one")
    .then(mod => (lazyButton.innerText = mod.default));

document.body.appendChild(lazyButton);