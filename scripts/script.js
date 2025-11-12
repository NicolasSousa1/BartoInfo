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

// =========================================================
//                  DADOS DOS CURSOS
// =========================================================

const courseData = {
    // Dados para o Card 1 (Ams - Administração)
    'c-1': {
        title: 'AMS',
        description: 'O curso de ams tem a mesma propósta do curso de informatica para internet. porém A modalidade permite que em um período de cinco anos, o estudante conclua o ensino médio, técnico e superior. Nos três primeiros, os alunos cursam Ensino Médio técnico e desenvolvem 200 horas de formação profissional em uma empresa parceira. Então, sem vestibular, os estudantes seguem para o Ensino Superior, que será concluído em mais dois anos.',
        image: '/imagens/ams.jpg'
    },
    // Dados para o Card 2 (Info - Informática)
    'c-2': {
        title: 'Informática para Internet',
        description: 'No curso de informática os alunos aprenderão programção, design e a usar ferramentas atuais do mercado de trabalho afim de desenvolver sites e aplicativos completos, aprendendo desde as bases da lógica de programação até o desenvolvimento de sistemas inteiros.',
        image: '/imagens/info.jpg'
    },
    // Dados para o Card 3 (RH - Recursos Humanos)
    'c-3': {
        title: 'Gestão de Recursos Humanos',
        description: 'O curso habilita o profissional a gerenciar rotinas de pessoal, como recrutamento, seleção, benefícios e legislação trabalhista, atuando em empresas de diversos setores. É uma formação integrada ao Ensino Médio ou técnica, voltada para quem tem aptidão para lidar com pessoas e processos organizacionais. ',
        image: '/imagens/rh.jpg'
    },
    // Dados para o Card 4 (TST - Segurança do Trabalho)
    'c-4': {
        title: 'Técnico em Segurança do Trabalho',
        description: 'O profissional de segurança do trabalho atua na identificação de riscos presentes nos ambientes de trabalho, estuda a aplicação das normas obrigatórias e propõe soluções para a prevenção de acidentes. O técnico também ajuda no treinamento dos funcionários em relação à segurança no trabalho. É responsável por selecionar os equipamentos de proteção de acordo com a necessidade de cada funcionário.',
        image: '/imagens/tst.jpg'
    },
    // Dados para o Card 5 (Log - Logística)
    'c-5': {
        title: 'Logística Empresarial Avançada',
        description: 'O curso de logistica prepara o aluno para gerenciar e controlar processos de movimentação, armazenagem, transporte e distribuição de materiais e produtos. A formação abrange desde o planejamento de compras e a organização de estoque até o controle de custos, qualidade e legislação aplicável.',
        image: '/imagens/log.jpg'
    }
};

// =========================================================
//                  LÓGICA PRINCIPAL (DOM)
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
    
    // --- Referências do Header ---
    const header = document.querySelector("header");
    let lastScrollTop = 0;
    let isHovering = false;
    let isHidden = false;

    // --- Referências do Painel ---
    const panel = document.getElementById('course-details-panel'); 
    const closeBtn = panel ? panel.querySelector('.close-btn') : null;
    const reserveButtons = document.querySelectorAll('.btn-info');
    
    // Referências dos elementos internos
    const detailsTitle = document.getElementById('details-title');
    const detailsDescription = document.getElementById('details-description');
    const detailsImage = document.getElementById('details-image');
    const DEFAULT_IMAGE = '/imagens/info.jpg';
    
    // Cria a zona invisível para hover do header
    if (header) {
        const hoverZone = document.createElement("div");
        hoverZone.classList.add("header-hover-zone");
        document.body.appendChild(hoverZone);

        // --- Funções de Controle do Header (Corrigido) ---
        
        const updateHeaderVisibility = (scrollTop) => {
            
            // ESTILO SCROLLED (barra cheia)
            if (scrollTop > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
            
            // CONTROLE DE OCULTAÇÃO/APARECIMENTO
            if (isHovering) return;

            // Rolando para baixo E longe do topo (> 100px)
            if (scrollTop > lastScrollTop && scrollTop > 100 && !isHidden) {
                header.classList.add("hidden");
                isHidden = true;
            }
            // Rolando para cima OU no topo da página ( <= 100px)
            else if (scrollTop < lastScrollTop || scrollTop <= 100) {
                if (isHidden) {
                    header.classList.remove("hidden");
                    isHidden = false;
                }
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        };

        // --- Eventos do Header ---
        window.addEventListener("scroll", () => {
            updateHeaderVisibility(window.scrollY);
        });

        // --- Eventos da Zona de Hover ---
        hoverZone.addEventListener("mouseenter", () => {
            isHovering = true;
            // Garante que esteja visível ao entrar na zona de hover
            if (isHidden) {
                header.classList.remove("hidden");
                isHidden = false;
            }
        });
        
        hoverZone.addEventListener("mouseleave", () => {
            isHovering = false;
            // Re-avalia a visibilidade do header imediatamente após sair do hover
            updateHeaderVisibility(window.scrollY);
        });
    }

    // Mostra imagem padrão ao iniciar (se necessário)
    if (detailsImage) detailsImage.src = DEFAULT_IMAGE;

    // --- Lógica do Painel de Detalhes ---
    if (panel && closeBtn && detailsTitle && detailsDescription && detailsImage) {
        
        const showPanel = (courseKey) => {
            const data = courseData[courseKey];
            if (data) {
                detailsTitle.textContent = data.title;
                detailsDescription.textContent = data.description;
                detailsImage.src = data.image;
            } else {
                // Dados padrão se a chave não for encontrada
                detailsTitle.textContent = 'Curso Indefinido';
                detailsDescription.textContent = 'Descrição padrão para curso não encontrado.';
                detailsImage.src = DEFAULT_IMAGE;
            }

            // Exibe o painel. O CSS fará a fixação e o novo posicionamento.
            panel.style.display = 'flex'; 
            
            // A LINHA panel.scrollIntoView() FOI REMOVIDA
        };

        const closePanel = () => {
            panel.style.display = 'none';
            detailsImage.src = DEFAULT_IMAGE;
        };

        // Evento de fechar
        closeBtn.addEventListener('click', closePanel);

        // Eventos dos botões "Informações"
        reserveButtons.forEach(button => {
            const label = button.closest('label');
            if (label) {
                const courseKey = label.getAttribute('for');
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    showPanel(courseKey);
                });
            }
        });
    } else {
        console.error("Erro: Elementos do painel de detalhes não encontrados.");
    }
});