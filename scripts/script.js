// ====================== MENU ======================
function toggleMenu() {
    document.getElementById("menu").classList.toggle("show");
}

// ====================== ANIMAÇÃO DOS CARDS ======================
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

// ====================== DADOS DOS CURSOS UNIFICADOS ======================
const courseData = {
    'c-1': {
        title: 'AMS',
        description: 'O curso de ams tem a mesma propósta do curso de informatica para internet. porém A modalidade permite que em um período de cinco anos, o estudante conclua o ensino médio, técnico e superior.',
        image: '/imagens/ams.jpg',
        duracao: '5 anos',
        atuacao: ['Desenvolvedor Front-end', 'Desenvolvedor Back-end', 'Analista de Sistemas', 'Administrador de Banco de Dados'],
        horario: 'Manhã - 12:30',
        requisitos: ['Programação ⁠design', '⁠Criação de sites e aplicativos', 'Manusear tecnologias requisitadas no mercado de trabalho']
    },
    'c-2': {
        title: 'Informática para Internet',
        description: 'No curso de informática os alunos aprenderão programção, design e a usar ferramentas atuais do mercado de trabalho afim de desenvolver sites e aplicativos completos.',
        image: '/imagens/info.jpg',
        duracao: '3 anos',
        atuacao: ['Desenvolvedor Front-end', 'Desenvolvedor Back-end', 'Analista de Sistemas', 'Administrador de Banco de Dados'],
        horario: 'Integral - 15:10',
        requisitos: ['Programação ⁠design', '⁠Criação de sites e aplicativos', 'Manusear tecnologias requisitadas no mercado de trabalho']
    },
    'c-3': {
        title: 'Recursos Humanos',
        description: 'O curso habilita o profissional a gerenciar rotinas de pessoal, como recrutamento, seleção, benefícios e legislação trabalhista.',
        image: '/imagens/rh.jpg',
        duracao: '3 anos',
        atuacao: ['Recrutamento e Seleção', 'Cálculo de Folha de Pagamento', 'Treinamento e Desenvolvimento', 'Departamento Pessoal'],
        horario: 'Integral - 15:10',
        requisitos: ['Gestão de pessoas', 'Treinamento para processos seletivos', 'Folha de pagamento', 'Legislação trabalhista']
    },
    'c-4': {
        title: 'TST',
        description: 'O profissional de segurança do trabalho atua na identificação de riscos presentes nos ambientes de trabalho.',
        image: '/imagens/tst.jpg',
        duracao: '3 anos',
        atuacao: ['Auditoria de Segurança', 'Treinamento de Funcionários', 'Gestão de CIPA', 'Elaboração de Laudos Técnicos'],
        horario: 'Integral - 15:10',
        requisitos: ['Prevenção de acidentes e doenças', 'Legislação e normas', 'Primeiros socorros', 'Combate a incêndio', 'Análise e investigações']
    },
    'c-5': {
        title: 'Logística',
        description: 'O curso de logistica prepara o aluno para gerenciar processos de movimentação, armazenagem e transporte.',
        image: '/imagens/log.jpg',
        duracao: '3 anos',
        atuacao: ['Controle de Estoque/Inventário', 'Gestão de Frota', 'Cadeia de Suprimentos', 'Planejamento de Armazenagem'],
        horario: 'Integral - 15:10',
        requisitos: ['Gestão de estoque', 'Gestão de suprimentos', 'Transporte e distribuição', 'Custo e legislação', 'Movimentação de carga']
    }
};

// ====================== FUNÇÃO SCROLL SUAVE ======================
function smoothScrollTo(target, duration = 800) {
    const start = window.scrollY;
    const end = target.getBoundingClientRect().top + window.scrollY - 80;
    const distance = end - start;
    const startTime = performance.now();

    function animate(time) {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = progress < 0.5
            ? 2 * progress * progress
            : -1 + (4 - 2 * progress) * progress;

        window.scrollTo(0, start + distance * ease);

        if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

// ====================== LÓGICA PRINCIPAL ======================
document.addEventListener("DOMContentLoaded", () => {

    // --- Header ---
    const header = document.querySelector("header");
    let lastScrollTop = 0;
    let isHovering = false;
    let isHidden = false;

    if (header) {
        const hoverZone = document.createElement("div");
        hoverZone.classList.add("header-hover-zone");
        document.body.appendChild(hoverZone);

        const updateHeaderVisibility = (scrollTop) => {
            if (scrollTop > 50) header.classList.add("scrolled");
            else header.classList.remove("scrolled");

            if (isHovering) return;

            if (scrollTop > lastScrollTop && scrollTop > 100 && !isHidden) {
                header.classList.add("hidden");
                isHidden = true;
            } else if (scrollTop < lastScrollTop || scrollTop <= 100) {
                if (isHidden) {
                    header.classList.remove("hidden");
                    isHidden = false;
                }
            }

            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        };

        window.addEventListener("scroll", () => updateHeaderVisibility(window.scrollY));
        hoverZone.addEventListener("mouseenter", () => {
            isHovering = true;
            if (isHidden) {
                header.classList.remove("hidden");
                isHidden = false;
            }
        });
        hoverZone.addEventListener("mouseleave", () => {
            isHovering = false;
            updateHeaderVisibility(window.scrollY);
        });
    }

    // --- Painel de detalhes ---
    const panel = document.getElementById('course-details-panel');
    const closeBtn = panel ? panel.querySelector('.close-btn') : null;
    const reserveButtons = document.querySelectorAll('.btn-info');

    const detailsTitle = document.getElementById('details-title');
    const detailsDescription = document.getElementById('details-description');
    const detailsImage = document.getElementById('details-image');

    const detalheDuracao = document.getElementById('detalhe-duracao');
    const detalheAtuacao = document.getElementById('detalhe-atuacao');
    const detalheRequisitos = document.getElementById('detalhe-requisitos');
    const detalheHorario = document.getElementById('detalhe-horario');

    const DEFAULT_IMAGE = '/imagens/info.jpg';
    if (detailsImage) detailsImage.src = DEFAULT_IMAGE;

    if (panel && closeBtn && detailsTitle && detailsDescription && detailsImage) {

        const showPanel = (courseKey) => {
            const data = courseData[courseKey];
            const defaultText = 'Informação não disponível para este curso.';

            // Painel principal
            if (data) {
                detailsTitle.textContent = data.title;
                detailsDescription.textContent = data.description;
                detailsImage.src = data.image;
            } else {
                detailsTitle.textContent = 'Curso Indefinido';
                detailsDescription.textContent = 'Descrição não encontrada.';
                detailsImage.src = DEFAULT_IMAGE;
            }

            // Duracao e Horario
            detalheDuracao.textContent = data.duracao || defaultText;
            detalheHorario.textContent = data.horario || defaultText;

            // --- REQUISITOS EM LISTA ---
            detalheRequisitos.innerHTML = "";
            if (data.requisitos && data.requisitos.length > 0) {
                data.requisitos.forEach(req => {
                    const li = document.createElement('li');
                    li.textContent = req;
                    detalheRequisitos.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.textContent = defaultText;
                detalheRequisitos.appendChild(li);
            }

            // Áreas de atuação
            detalheAtuacao.innerHTML = "";
            if (data.atuacao && data.atuacao.length > 0) {
                data.atuacao.forEach(area => {
                    const li = document.createElement('li');
                    li.textContent = area;
                    detalheAtuacao.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.textContent = defaultText;
                detalheAtuacao.appendChild(li);
            }

            panel.style.display = 'flex';
            smoothScrollTo(panel, 1000);
        };

        closeBtn.addEventListener('click', () => {
            panel.style.display = 'none';
            detailsImage.src = DEFAULT_IMAGE;
        });

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
        console.error("Erro: IDs do painel não encontrados.");
    }

    // ====================== REVEAL ON SCROLL ======================
    function revealOnScroll() {
        const elements = document.querySelectorAll('.info-box');
        const windowHeight = window.innerHeight;

        elements.forEach(el => {
            const position = el.getBoundingClientRect().top;
            if (position < windowHeight - 100) {
                el.classList.add('show');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);
    window.addEventListener('load', revealOnScroll);
});
