/**
 * ACADEMICHUB PRO V3.0 - Módulo de Gestão e Índices
 */

// 1. ATUALIZAR PROGRESSO POR CAPÍTULOS (REFINADO)
function atualizarProgressoCapitulos() {
    const texto = editor.getText();
    const html = editor.root.innerHTML;
    
    const metas = [
        { id: 'intro', nome: 'Introdução', palavras: 800, chaves: ['introdução', 'objetivo', 'justificativa'] },
        { id: 'metodo', nome: 'Metodologia', palavras: 1200, chaves: ['metodologia', 'ahp', 'área de estudo', 'materiais'] },
        { id: 'res', nome: 'Resultados', palavras: 1500, chaves: ['resultados', 'discussão', 'análise', 'conclusão'] }
    ];

    let htmlProgresso = "";

    metas.forEach(m => {
        let score = 0;
        // Verifica se o título do capítulo existe no HTML
        const temTitulo = m.chaves.some(key => html.toLowerCase().includes(key));
        if (temTitulo) score += 40;

        // Verifica volume de palavras específicas para aquele contexto
        const totalPalavras = texto.split(/\s+/).length;
        if (totalPalavras > m.palavras) score += 60;
        else score += (totalPalavras / m.palavras) * 60;

        const final = Math.min(Math.round(score), 100);
        
        htmlProgresso += `
            <div class="x-small mb-1 d-flex justify-content-between text-white">
                <span>${m.nome}</span> <span>${final}%</span>
            </div>
            <div class="progress mb-2" style="height: 5px; background: #333;">
                <div class="progress-bar ${final < 100 ? 'bg-info' : 'bg-success'}" style="width: ${final}%"></div>
            </div>
        `;
    });

    document.getElementById('listaProgresso').innerHTML = htmlProgresso;
    gerarSumarioPreview(); // Chama a atualização do sumário junto
    identificarIlustracoes(); // Identifica figuras e tabelas
}

// 2. CRONOGRAMA 72H DINÂMICO
function configurarCronograma() {
    const prazo = document.getElementById('inputPrazo').value;
    localStorage.setItem('prazo_dissertacao', prazo);
}

function iniciarCountdown() {
    setInterval(() => {
        const prazoFinal = new Date(localStorage.getItem('prazo_dissertacao'));
        const agora = new Date();
        const diff = prazoFinal - agora;

        if (diff > 0) {
            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);
            document.getElementById('countdownDisplay').innerText = 
                `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
        } else {
            document.getElementById('countdownDisplay').innerText = "PRAZO ESGOTADO";
            document.getElementById('countdownDisplay').classList.replace('text-warning', 'text-danger');
        }
    }, 1000);
}

// 3. IDENTIFICAÇÃO DE SUMÁRIO, FIGURAS E TABELAS
function gerarSumarioPreview() {
    const titulos = editor.root.querySelectorAll('h1, h2, h3');
    const area = document.getElementById('sumarioPreview');
    
    if (titulos.length === 0) {
        area.innerText = "Use Título 1 e 2 no menu para gerar o sumário.";
        return;
    }

    let lista = "<ul class='list-unstyled mb-0'>";
    titulos.forEach(t => {
        const nivel = t.tagName === 'H1' ? '' : 'ps-3';
        lista += `<li class="${nivel} border-bottom border-secondary border-opacity-25 py-1">
            <i class="fas fa-chevron-right x-small"></i> ${t.innerText}
        </li>`;
    });
    area.innerHTML = lista + "</ul>";
}

function identificarIlustracoes() {
    const texto = editor.getText();
    const area = document.getElementById('listaIlustracoes');
    
    // Regex para encontrar "Figura X:" ou "Tabela X:"
    const figuras = texto.match(/Figura\s\d+[:.]/gi) || [];
    const tabelas = texto.match(/Tabela\s\d+[:.]/gi) || [];

    area.innerHTML = `
        <div class="d-flex justify-content-between"><span>Figuras:</span> <b>${figuras.length}</b></div>
        <div class="d-flex justify-content-between"><span>Tabelas:</span> <b>${tabelas.length}</b></div>
    `;
}

// 4. INSERÇÃO DE IMAGENS COM LEGENDA ABNT
function inserirImagemComLegenda() {
    Swal.fire({
        title: 'Inserir Ilustração ABNT',
        html: `
            <input type="text" id="legenda" class="form-control mb-2" placeholder="Título da Figura (Ex: Mapa de Erodibilidade)">
            <input type="text" id="fonte" class="form-control" placeholder="Fonte (Ex: Autor, 2026)">
        `,
        showCancelButton: true,
        confirmButtonText: 'Preparar Espaço'
    }).then((result) => {
        if (result.isConfirmed) {
            const legenda = document.getElementById('legenda').value;
            const fonte = document.getElementById('fonte').value;
            const range = editor.getSelection() || { index: 0 };
            
            const template = `
                <p style="text-align: center;"><strong>Figura X: ${legenda}</strong></p>
                <p style="text-align: center;">[CLIQUE NO ÍCONE DE IMAGEM ACIMA PARA INSERIR O MAPA AQUI]</p>
                <p style="text-align: center; font-size: 10pt;">Fonte: ${fonte}</p>
            `;
            editor.clipboard.dangerouslyPasteHTML(range.index, template);
        }
    });
}

// INTEGRAÇÃO NO AUTOSAVE
function loopPrincipal() {
    salvarLocalmente(); // Função que já criamos
    atualizarProgressoCapitulos();
}

setInterval(loopPrincipal, 3000);
window.onload = () => {
    carregarBackup();
    iniciarCountdown();
};
