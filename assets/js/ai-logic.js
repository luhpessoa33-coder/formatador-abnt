/**
 * ACADEMICHUB PRO V3.0 - Consultoria de Escrita e Metodologia
 * Focado em Rigor Científico, AHP e Bacia do Ipojuca
 */

// 1. ANALISADOR DE GARGALOS E FLUIDEZ (ANALISAR IA)
function analisarIA() {
    const texto = editor.getText();
    const consoleIA = document.getElementById('iaConsole');
    
    if (texto.length < 100) {
        Swal.fire('Texto Insuficiente', 'Escreva pelo menos um parágrafo para análise.', 'info');
        return;
    }

    consoleIA.innerHTML = "<div class='text-warning animate__animated animate__flash'>[IA] Escaneando estrutura sintática e rigor...</div><br>";

    setTimeout(() => {
        let criticas = [];
        let score = 100;

        // A. Verificação de Citações Cruzadas (Integração com Bibliografia)
        const refsSalvas = localStorage.getItem('minhas_referencias') || "";
        const nomesRefs = extrairNomesDeAutores(refsSalvas);
        const citacoesNoTexto = texto.match(/\(\w+, \d{4}\)/g) || [];

        if (nomesRefs.length > 0) {
            const citados = nomesRefs.filter(nome => texto.toUpperCase().includes(nome));
            if (citados.length < nomesRefs.length / 2) {
                criticas.push(`⚠️ <strong>Gargalo de Referenciação:</strong> Você salvou artigos na bibliografia, mas citou poucos no texto. Utilize mais suas fontes salvas.`);
                score -= 20;
            }
        }

        // B. Análise de Frases Prolixas
        const frases = texto.split(/[.!?]/).filter(f => f.trim().length > 0);
        const longas = frases.filter(f => f.split(' ').length > 35);
        if (longas.length > 0) {
            criticas.push(`⚠️ <strong>Complexidade:</strong> Detectamos ${longas.length} frases muito longas. Isso dificulta a compreensão técnica.`);
            score -= 10;
        }

        // C. Vícios de Linguagem e Subjetividade
        const termosProibidos = ["acho", "acredito", "talvez", "maravilhoso", "infelizmente", "na minha opinião", "eu"];
        const encontrados = termosProibidos.filter(t => texto.toLowerCase().includes(t));
        if (encontrados.length > 0) {
            criticas.push(`❌ <strong>Falta de Impessoalidade:</strong> Remova termos como: ${encontrados.join(', ')}.`);
            score -= 15;
        }

        // D. Verificação de "Queísmo"
        const numQue = (texto.match(/ que /gi) || []).length;
        if (numQue > texto.split(' ').length * 0.05) {
            criticas.push(`⚠️ <strong>Vício de Linguagem:</strong> Excesso da conjunção "que" detectado. Tente variar a pontuação.`);
            score -= 5;
        }

        // Renderizar Resultados
        exibirResultadosIA(score, criticas);
    }, 1200);
}

// 2. VARREDURA METODOLÓGICA (AHP & IPOJUCA)
function iaAnalisarMetodologia() {
    const texto = editor.getText().toLowerCase();
    const consoleIA = document.getElementById('iaConsole');
    consoleIA.innerHTML = "<div class='text-primary'>[SISTEMA] Validando consistência metodológica AHP...</div><br>";

    // Critérios específicos do seu projeto e de outros alunos
    const mapaCalor = [
        { label: "Lógica AHP (Pesos/Matriz)", keys: ["ahp", "saaty", "consistência", "paritária", "pesos"], peso: 25 },
        { label: "Variáveis Físicas (Solo/Declividade)", keys: ["erodibilidade", "declividade", "relevo", "slope", "solo"], peso: 25 },
        { label: "Contexto Geográfico (Ipojuca)", keys: ["ipojuca", "bacia", "pernambuco", "rio", "hídrico"], peso: 20 },
        { label: "Serviços Ambientais (PSA)", keys: ["psa", "pagamento", "valoração", "ecossistêmicos"], peso: 30 }
    ];

    setTimeout(() => {
        let progressoMetodologico = 0;
        let checklist = "";

        mapaCalor.forEach(item => {
            const detectado = item.keys.some(k => texto.includes(k));
            if (detectado) progressoMetodologico += item.peso;
            
            checklist += `
                <div class="d-flex justify-content-between small border-bottom border-secondary mb-1">
                    <span>${item.label}</span>
                    <span class="${detectado ? 'text-success' : 'text-danger'}">${detectado ? '✔' : '✘'}</span>
                </div>`;
        });

        consoleIA.innerHTML = `
            <h6>Prontidão Metodológica: ${progressoMetodologico}%</h6>
            <div class="progress mb-3" style="height: 10px;">
                <div class="progress-bar ${progressoMetodologico < 70 ? 'bg-warning' : 'bg-success'}" style="width: ${progressoMetodologico}%"></div>
            </div>
            ${checklist}
            <p class="x-small mt-2 text-white-50">Sugerimos reforçar os termos onde há um "✘" para garantir o rigor do IFPE.</p>
        `;
    }, 1500);
}

// FUNÇÕES AUXILIARES
function extrairNomesDeAutores(html) {
    // Busca nomes em CAIXA ALTA antes da vírgula (Padrão ABNT gerado pelo sistema)
    const regex = /([A-ZÀ-Ú]+),/g;
    let nomes = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
        nomes.push(match[1]);
    }
    return [...new Set(nomes)]; // Remove duplicatas
}

function exibirResultadosIA(score, criticas) {
    const consoleIA = document.getElementById('iaConsole');
    let cor = score > 70 ? 'text-success' : (score > 40 ? 'text-warning' : 'text-danger');

    let html = `<h6>Qualidade do Texto: <span class="${cor}">${score}/100</span></h6>`;
    
    if (criticas.length === 0) {
        html += "<p class='text-success small'>🌟 Excelente! O texto segue os padrões científicos.</p>";
    } else {
        html += criticas.map(c => `<p class="mb-1" style="font-size: 0.8rem;">${c}</p>`).join('');
    }
    
    html += `<button class="btn btn-xxs btn-outline-primary mt-2" onclick="analisarIA()">Re-analisar</button>`;
    consoleIA.innerHTML = html;
}
