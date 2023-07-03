const list = document.getElementById("list");
const logo = document.getElementById("logo");
const hamburger = document.getElementById("hamburger");

hamburger.addEventListener("click", () => {
  list.classList.toggle("active");
});

window.addEventListener("resize", (e) => {
  const width = window.innerWidth;
  if (width <= 768) {
    list.classList.remove("active");
  }
});
