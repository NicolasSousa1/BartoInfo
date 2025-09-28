function toggleMenu() {
  document.getElementById("menu").classList.toggle("show");
}

// Animação dos cards ao rolar
const cards = document.querySelectorAll('.objetivo-row');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

cards.forEach(card => observer.observe(card));
