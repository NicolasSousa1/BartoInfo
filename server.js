// server.js
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ➕ Dependências para formatação
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";


// 🔹 Corrige __dirname e __filename antes de usar
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 Configuração
dotenv.config();

const app = express();
app.use(bodyParser.json());

// Servir arquivos estáticos das pastas necessárias
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/estilos", express.static(path.join(__dirname, "estilos")));
app.use("/imagens", express.static(path.join(__dirname, "imagens")));
app.use("/paginas", express.static(path.join(__dirname, "paginas")));
app.use("/scripts", express.static(path.join(__dirname, "scripts")));

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("⚠️ ERRO: Nenhuma chave API encontrada em .env (GEMINI_API_KEY)");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

console.log("Gemini client inicializado.");


// ---------------------------------------------------------------
// ✅ Função que formata a resposta do Gemini
// ---------------------------------------------------------------
function formatGeminiResponse(text) {
  const html = marked(text, { breaks: true });

  const cleanHtml = sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["h1", "h2", "h3"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes
    }
  });

  return cleanHtml;
}


// ---------------------------------------------------------------
// Página inicial
// ---------------------------------------------------------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "paginas", "index.html"));
});


// ---------------------------------------------------------------
// Rota FINAL do Quiz
// ---------------------------------------------------------------
app.post("/quiz", async (req, res) => {
  try {
    const respostas = req.body.respostas;

    const prompt = `
      Você é um orientador vocacional especializado em cursos técnicos da ETEC.

      Com base nas respostas do usuário, gere EXATAMENTE 3 PARÁGRAFOS, sem markdown, sem listas, sem asteriscos.

      Cada parágrafo deve conter:

      1) PARÁGRAFO 1 — CURSO TÉCNICO RECOMENDADO:
      Explique claramente qual curso técnico da Etec combina mais com o perfil do aluno e o principal motivo.

      2) PARÁGRAFO 2 — CURSO SUPERIOR RECOMENDADO:
      Sugira um curso superior coerente com as características do aluno e explique o motivo da indicação.

      3) PARÁGRAFO 3 — CONCLUSÃO E CAMINHOS DE CARREIRA:
      Conclua indicando as possíveis carreiras que o aluno pode seguir, relacionando ao curso técnico e superior recomendados, destacando como isso pode ajudá-lo a decidir seu caminho profissional.

      NÃO utilize formatação especial, não use emojis, não use negrito, não use títulos. Apenas texto puro.

      CURSOS DA ETEC:

      Informática para Internet: 
        O processo de criação de sites e o de desenvolvimento de programas que podem ser utilizados em páginas na internet. Para programar, o aluno vai estudar raciocínio lógico e linguagens de programação, que utiliza comandos para desenvolver funcionalidades e dar forma a um site. Além disso, o estudante aprenderá um pouco de design com o objetivo de tornar a página mais agradável e fácil de ser utilizada. O aluno aprenderá ainda como criar e alterar bancos de dados que vão alimentar os sites. Noções de marketing digital para a web e de empreendedorismo também serão ensinadas ao longo do curso. 

        Logística (LOG): 
        Logística é o planejamento do caminho feito por um produto ou serviço até chegar ao cliente de forma organizada, rápida e econômica. Para planejar esse caminho, o estudante vai precisar de conhecimentos de matemática, geografia e física. O aluno aprenderá sobre os processos de compra de matérias-primas, incluindo a escolha dos fornecedores, o registro dos pedidos de compra e o recebimento dos materiais adquiridos. 

        Recursos Humanos (RH): 
        O estudante vai precisar de conhecimentos de língua portuguesa, matemática e história para compreender o curso e aprender a realizar as tarefas sob a responsabilidade do setor de Recursos Humanos de uma empresa, como contratação, demissão e aposentadoria de funcionários e oferta de benefícios (vale-transporte, plano de saúde, vale-refeição etc.), entre outras atividades. Por isso, será importante também estudar as leis que regulam os direitos e deveres do empregador e dos empregados (legislação trabalhista). O estudante vai aprender ainda noções de psicologia para entender como as pessoas se relacionam no ambiente de trabalho, realizar processos de recrutamento e seleção de novos funcionários e promover ações de motivação. 

        Segurança do Trabalho (TST): 
        Técnicas para prevenir doenças e acidentes de trabalho são o foco do curso. Além do português para interpretar leis e as normas obrigatórias no ambiente de trabalho, o estudante aprenderá física para estudar o ruído e a vibração das ferramentas e equipamentos utilizados pelos funcionários da empresa. O aluno vai aprender primeiros socorros e combate a incêndio. 

        Informática para internet - AMS: 
        Parecido com Informática para internet, porém A modalidade permite que em um período de cinco anos, o estudante conclua o ensino médio, técnico e superior. Nos três primeiros, os alunos cursam Ensino Médio técnico e desenvolvem 200 horas de formação profissional em uma empresa parceira. Então, sem vestibular, os estudantes seguem para o Ensino Superior, que será concluído em mais dois anos.

      Respostas do usuário: ${JSON.stringify(respostas)}
    `;

    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: prompt }] }
      ]
    });

    const textoBruto = await result.response.text();

    console.log("💡 Texto bruto recebido:", textoBruto);

    // 🔥 Aqui formatamos ANTES de retornar para o front-end
    const textoFormatado = formatGeminiResponse(textoBruto);

    res.json({ resposta: textoFormatado });
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error);
    res.status(500).json({ erro: "Erro ao gerar resposta da IA." });
  }
});



// ---------------------------------------------------------------
// Inicialização do servidor
// ---------------------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
