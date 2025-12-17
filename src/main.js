const User = document.getElementsByClassName('user')[0];
User.addEventListener('click', ()=> {
    window.location.href = "gatau/login.html";
});
const admin = document.getElementsByClassName('logo')[0];
admin.addEventListener('click', ()=> {
    window.location.href = "admin.html";
});
const cart = document.getElementsByClassName('cart')[0];
cart.addEventListener('click', ()=> {
    window.location.href = "cart.html";
});
const tabLinks = document.querySelectorAll(".tab-link");
const sliderTrack = document.querySelector(".slider-track");

tabLinks.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    sliderTrack.style.transform = `translateX(-${index * 100}%)`;

    tabLinks.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

