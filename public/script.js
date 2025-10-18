document.getElementById("quizForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const respostas = Object.fromEntries(formData.entries());

  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML = "Analisando suas respostas... ⏳";

  try {
    const response = await fetch("/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ respostas }),
    });

    if (!response.ok) throw new Error("Erro na requisição");

    const data = await response.json();
    resultadoDiv.innerHTML = `<h3>${data.resposta}</h3>`;
  } catch (err) {
    console.error(err);
    resultadoDiv.innerHTML = "❌ Erro ao processar as respostas. Verifique o console do servidor.";
  }
});


  // Detecta o scroll da página e adiciona a classe "scrolled" no header
  window.addEventListener("scroll", () => {
    const header = document.getElementById("header");
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });


