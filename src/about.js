document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".mcard");
  const track = document.querySelector(".sliderr-track");
  const slides = document.querySelectorAll(".slidee");

  if (!track || slides.length === 0 || cards.length === 0) {
    console.warn("Slider init gagal: cek selector .mcard, .sliderr-track, .slidee");
    return;
  }

  cards[0].classList.add("active");

  cards.forEach((card, index) => {
    card.addEventListener("click", () => {
      track.style.transform = `translateX(-${index * 100}%)`;
      cards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
    });
  });

  window.addEventListener("resize", () => {
    const activeIndex = [...cards].findIndex(c => c.classList.contains("active"));
    const idx = activeIndex === -1 ? 0 : Math.min(activeIndex, slides.length - 1);
    track.style.transform = `translateX(-${idx * 100}%)`;
  });
});