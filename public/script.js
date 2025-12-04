document.getElementById("quizForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const respostas = Object.fromEntries(formData.entries());

  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML = `
    <div class="card card-loading">
      <h3>Analisando suas respostas...</h3>
      <div class="loading-bar">
        <div class="loading-fill"></div>
      </div>
      <p>Aguarde alguns instantes enquanto criamos sua análise personalizada.</p>
    </div>
  `;

  try {
    const response = await fetch("/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ respostas }),
    });

    if (!response.ok) throw new Error("Erro na requisição");

    const data = await response.json();

    // Divide em parágrafos
    const partes = data.resposta
      .split(/\n+/)
      .filter((t) => t.trim() !== "");

    const p1 = partes[0] || "Erro ao gerar texto.";
    const p2 = partes[1] || "Erro ao gerar texto.";
    const p3 = partes[2] || "Erro ao gerar texto.";

    resultadoDiv.innerHTML = `
      <div class="card">
        <h3><span class="icon">📘</span> Curso Técnico Recomendado</h3>
        <p>${p1}</p>
      </div>

      <div class="card">
        <h3><span class="icon">🎓</span> Curso Superior Indicado</h3>
        <p>${p2}</p>
      </div>

      <div class="card">
        <h3><span class="icon">💼</span> Caminhos de Carreira</h3>
        <p>${p3}</p>
      </div>
    `;
  } catch (err) {
    console.error(err);
    resultadoDiv.innerHTML = `
      <div class="card card-error">
        <h3><span class="icon">⚠️</span> Erro</h3>
        <p>Não foi possível analisar suas respostas. Tente novamente mais tarde.</p>
      </div>
    `;
  }
});

// Efeito do header ao rolar a página
window.addEventListener("scroll", () => {
  const header = document.getElementById("header");
  header.classList.toggle("scrolled", window.scrollY > 50);
});
