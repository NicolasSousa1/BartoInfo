// server.js
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
app.use("/paginas", express.static(path.join(__dirname, "paginas"))); // adiciona suporte aos assets dessa pasta
app.use("/scripts", express.static(path.join(__dirname, "scripts")));

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("⚠️ ERRO: Nenhuma chave API encontrada em .env (GEMINI_API_KEY)");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

console.log("Gemini client inicializado.");

// 🔹 Página inicial do site
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "paginas", "index.html"));
});

// 🔹 Rota do quiz (mantém igual)
app.post("/quiz", async (req, res) => {
  try {
    const respostas = req.body.respostas;

    const prompt = `
      Você é um orientador de carreiras.
      Baseado nas respostas do usuário abaixo, indique qual dos curso técnicos da Etec listados abaixo seriam mais adequado ao perfil dele...
      Respostas do usuário: ${JSON.stringify(respostas)}
    `;

    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: prompt }] }
      ]
    });

    const resposta = await result.response.text();
    res.json({ resposta });
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error);
    res.status(500).json({ erro: "Erro ao gerar resposta da IA." });
  }
});

// 🔹 Inicializa servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});


// 🔹 Rota do quiz
app.post("/quiz", async (req, res) => {
  try {
    const respostas = req.body.respostas;

    const prompt = `
      Você é um orientador de carreiras.
      Baseado nas respostas do usuário abaixo, indique qual dos curso técnicos da Etec listados abaixo seriam mais adequado ao perfil dele, você pode indicar mais de um curso se achar bom, depois indique um curso superior, Seja claro e objetivo.
      segue os cursos da Etec:

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
      
      Responda de forma parecida com o seguinte modelo de resposta, não precisa ser exatamente igual ao modelo, se necessário faça alterações, mas sempre separe as repostas em parágrafos.
      
      segue o modelo de resposta: 
      (Primeiro parágrafo) de acordo com as repostas, a melhor opção dentre os cursos oferecidos pela ETEC seria, (curso recomendado), pois (apresenta os motivos pelos quais o curso é recomendado). 
      (Segundo parágrafo) Além disso uma boa opção de curso superior pode ser, (cursos superiores recomendados), (explica o porquê).
      (Terceiro parágrafo) Portanto, a escolha de curso que melhor atenderia as suas necessidades seria (conclui o argumento).
      
      Respostas do usuário: ${JSON.stringify(respostas)}
    `;

    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: prompt }] }
      ]
    });

    console.log("💡 Resposta bruta da IA:", result);

    const resposta = await result.response.text(); // ✅ CORRETO: await aqui
    console.log("💬 Resposta extraída:", resposta);

    res.json({ resposta });
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error);
    res.status(500).json({ erro: "Erro ao gerar resposta da IA." });
  }
});




