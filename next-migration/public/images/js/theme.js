// //Check and apply light/dark theme based on user preferences
// function load() {
//   const button = document.querySelector(".btn1");

//   // MediaQueryList object
//   const useDark = window.matchMedia("(prefers-color-scheme: dark)");
//   if (useDark.matches == true) {
//     document.getElementById("GH-img1").src =
//       "https://activity-graph.herokuapp.com/graph?username=kotru21&theme=react-dark&hide_border=true&area=true&bg_color=151515";
//     document.getElementById("GH-img2").src =
//       "https://github-readme-stats.vercel.app/api?username=kotru21&stars,commits,prs,issues,contribs&theme=dark&hide_border=true&area=true&title_color=FA8B00";
//     document.getElementById("GH-img3").src =
//       "https://github-readme-streak-stats.herokuapp.com/?user=kotru21&theme=dark&hide_border=true&area=true";
//     document.getElementById("moonlight").className = "btn bx bx-planet btn1";
//   } else {
//     document.getElementById("GH-img1").src =
//       "https://activity-graph.herokuapp.com/graph?username=kotru21&theme=react-dark&hide_border=true&area=true&bg_color=none";
//     document.getElementById("GH-img2").src =
//       "https://github-readme-stats.vercel.app/api?username=kotru21&stars,commits,prs,issues,contribs&theme=dark&hide_border=true&area=true&title_color=FA8B00&bg_color=none";
//     document.getElementById("GH-img3").src =
//       "https://github-readme-streak-stats.herokuapp.com/?user=kotru21&theme=grey&hide_border=true&area=true";
//     document.getElementById("moonlight").className = "btn bx bx-moon btn1";
//   }
//   // Toggles the "dark-mode" class based on if the media query matches
//   function toggleDarkMode(state) {
//     // Older browser don't support the second parameter in the
//     // classList.toggle method so you'd need to handle this manually
//     // old browser support
//     document.documentElement.classList.toggle("dark-mode", state);
//   }

//   // Initial setting
//   toggleDarkMode(useDark.matches);

//   // Listen for changes in the OS settings
//   useDark.addListener((evt) => toggleDarkMode(evt.matches));

//   // Toggles the "dark-mode" class on click
//   /* Changing the image source when the button is clicked. */
//   button.addEventListener("click", () => {
//     document.documentElement.classList.toggle("dark-mode");
//     document.documentElement.classList.toggle("dark-mode");
//     if (document.documentElement.classList.toggle("dark-mode")) {
//       document.getElementById("GH-img1").src =
//         "https://activity-graph.herokuapp.com/graph?username=kotru21&theme=react-dark&hide_border=true&area=true&bg_color=151515";
//       document.getElementById("GH-img2").src =
//         "https://github-readme-stats.vercel.app/api?username=kotru21&stars,commits,prs,issues,contribs&theme=dark&hide_border=true&area=true&title_color=FA8B00";
//       document.getElementById("GH-img3").src =
//         "https://github-readme-streak-stats.herokuapp.com/?user=kotru21&theme=dark&hide_border=true&area=true";
//       document.getElementById("moonlight").className = "btn bx bx-planet btn1";
//     } else {
//       document.getElementById("GH-img1").src =
//         "https://activity-graph.herokuapp.com/graph?username=kotru21&theme=react-dark&hide_border=true&area=true&bg_color=none";
//       document.getElementById("GH-img2").src =
//         "https://github-readme-stats.vercel.app/api?username=kotru21&stars,commits,prs,issues,contribs&theme=dark&hide_border=true&area=true&title_color=FA8B00&bg_color=none";
//       document.getElementById("GH-img3").src =
//         "https://github-readme-streak-stats.herokuapp.com/?user=kotru21&theme=grey&hide_border=true&area=true";
//       document.getElementById("moonlight").className = "btn bx bx-moon btn1";
//     }
//   });
// }
// //change on dom onload
// window.addEventListener("DOMContentLoaded", load);
// if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
//   document.getElementById("GH-img1").src =
//     "https://activity-graph.herokuapp.com/graph?username=kotru21&theme=react-dark&hide_border=true&area=true&bg_color=none";
//   document.getElementById("GH-img2").src =
//     "https://github-readme-stats.vercel.app/api?username=kotru21&stars,commits,prs,issues,contribs&theme=dark&hide_border=true&area=true&title_color=FA8B00&bg_color=none";
//   document.getElementById("GH-img3").src =
//     "https://github-readme-streak-stats.herokuapp.com/?user=kotru21&theme=grey&hide_border=true&area=true";
// }
// /* Changing the image source when the user changes the theme. */
// window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
//   console.log("a");
//   const newColorScheme = event.matches ? "dark" : "light";
//   if (newColorScheme == "dark") {
//     document.getElementById("GH-img1").src =
//       "https://activity-graph.herokuapp.com/graph?username=kotru21&theme=react-dark&hide_border=true&area=true&bg_color=151515";
//     document.getElementById("GH-img2").src =
//       "https://github-readme-stats.vercel.app/api?username=kotru21&stars,commits,prs,issues,contribs&theme=dark&hide_border=true&area=true&title_color=FA8B00";
//     document.getElementById("GH-img3").src =
//       "https://github-readme-streak-stats.herokuapp.com/?user=kotru21&theme=dark&hide_border=true&area=true";
//   } else {
//     document.getElementById("GH-img1").src =
//       "https://activity-graph.herokuapp.com/graph?username=kotru21&theme=react-dark&hide_border=true&area=true&bg_color=none";
//     document.getElementById("GH-img2").src =
//       "https://github-readme-stats.vercel.app/api?username=kotru21&stars,commits,prs,issues,contribs&theme=dark&hide_border=true&area=true&title_color=FA8B00&bg_color=none";
//     document.getElementById("GH-img3").src =
//       "https://github-readme-streak-stats.herokuapp.com/?user=kotru21&theme=grey&hide_border=true&area=true";
//   }
// });
