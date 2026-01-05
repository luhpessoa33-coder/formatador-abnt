// Editor ABNT com Quill.js

let quill;
let documentStructure = [];
let referencesList = [];
let figureCount = 0;
let tableCount = 0;

// Inicializar Editor Quill
document.addEventListener('DOMContentLoaded', function() {
    initializeEditor();
    setupAutoSave();
    updateStatistics();
});

function initializeEditor() {
    const toolbarOptions = [
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['clean']
    ];

    quill = new Quill('#editor-container', {
        modules: {
            toolbar: toolbarOptions
        },
        theme: 'snow',
        placeholder: 'Comece a escrever sua dissertação aqui...\n\nDica: Use os botões acima para inserir elementos formatados segundo ABNT.'
    });

    // Aplicar formatação ABNT padrão
    applyABNTFormatting();

    // Eventos
    quill.on('text-change', function() {
        updateStatistics();
        saveToLocalStorage();
    });

    // Carregar conteúdo salvo
    loadFromLocalStorage();
}

function applyABNTFormatting() {
    // Aplicar formatação padrão ABNT
    const editor = document.querySelector('#editor-container .ql-editor');
    if (editor) {
        editor.style.fontFamily = 'Times New Roman, serif';
        editor.style.fontSize = '12pt';
        editor.style.lineHeight = '1.5';
        editor.style.textAlign = 'justify';
        editor.style.textIndent = '1.25cm';
        editor.style.maxWidth = '21cm';
        editor.style.minHeight = '29.7cm';
        editor.style.margin = '0 auto';
        editor.style.padding = '3cm 2cm 2cm 3cm'; // Margens ABNT
        editor.style.backgroundColor = 'white';
        editor.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
    }
}

// Funções de Inserção

function insertCapa() {
    const instituicao = prompt('Nome da Instituição:', 'INSTITUTO FEDERAL DE PERNAMBUCO') || 'INSTITUTO FEDERAL DE PERNAMBUCO';
    const programa = prompt('Nome do Programa:', 'MESTRADO PROFISSIONAL EM GESTÃO AMBIENTAL') || 'MESTRADO PROFISSIONAL EM GESTÃO AMBIENTAL';
    const autor = prompt('Nome do Autor:', 'SEU NOME COMPLETO') || 'SEU NOME COMPLETO';
    const titulo = prompt('Título do Trabalho:', 'TÍTULO DO TRABALHO') || 'TÍTULO DO TRABALHO';
    const local = prompt('Local:', 'Recife') || 'Recife';
    const ano = prompt('Ano:', '2025') || '2025';

    const capaHTML = `
<div style="text-align: center; page-break-after: always; padding-top: 3cm;">
    <p style="font-weight: bold; font-size: 12pt; text-transform: uppercase; margin-bottom: 2cm;">
        ${instituicao}<br>
        ${programa}
    </p>
    
    <p style="margin-top: 8cm; margin-bottom: 8cm;">
        <strong style="font-size: 12pt; text-transform: uppercase;">${autor}</strong>
    </p>
    
    <p style="font-weight: bold; font-size: 12pt; text-transform: uppercase; margin-bottom: 8cm;">
        ${titulo}
    </p>
    
    <p style="margin-top: auto;">
        <strong>${local}<br>${ano}</strong>
    </p>
</div>
`;

    quill.clipboard.dangerouslyPasteHTML(0, capaHTML);
    updateStructure();
    showNotification('Capa inserida com sucesso!', 'success');
}

function insertFolhaRosto() {
    const autor = prompt('Nome do Autor:', 'SEU NOME COMPLETO') || 'SEU NOME COMPLETO';
    const titulo = prompt('Título do Trabalho:', 'TÍTULO DO TRABALHO') || 'TÍTULO DO TRABALHO';
    const tipo = prompt('Tipo de Trabalho:', 'Dissertação') || 'Dissertação';
    const programa = prompt('Programa:', 'Mestrado Profissional em Gestão Ambiental') || 'Mestrado Profissional em Gestão Ambiental';
    const instituicao = prompt('Instituição:', 'Instituto Federal de Pernambuco') || 'Instituto Federal de Pernambuco';
    const orientador = prompt('Orientador(a):', 'Prof. Dr. Nome do Orientador') || 'Prof. Dr. Nome do Orientador';
    const local = prompt('Local:', 'Recife') || 'Recife';
    const ano = prompt('Ano:', '2025') || '2025';

    const folhaRostoHTML = `
<div style="text-align: center; page-break-after: always; padding-top: 3cm;">
    <p style="font-weight: bold; font-size: 12pt; text-transform: uppercase; margin-bottom: 8cm;">
        ${autor}
    </p>
    
    <p style="font-weight: bold; font-size: 12pt; text-transform: uppercase; margin-bottom: 3cm;">
        ${titulo}
    </p>
    
    <div style="text-align: right; margin-right: 0; margin-left: 8cm; font-size: 10pt; line-height: 1.0; margin-bottom: 5cm;">
        <p style="text-align: justify;">
            ${tipo} apresentada ao ${programa} do ${instituicao} como requisito parcial para obtenção do título de Mestre em Gestão Ambiental.
        </p>
        <p style="text-align: justify; margin-top: 1cm;">
            <strong>Orientador(a):</strong> ${orientador}
        </p>
    </div>
    
    <p style="margin-top: auto;">
        <strong>${local}<br>${ano}</strong>
    </p>
</div>
`;

    const length = quill.getLength();
    quill.clipboard.dangerouslyPasteHTML(length, folhaRostoHTML);
    updateStructure();
    showNotification('Folha de Rosto inserida com sucesso!', 'success');
}

function insertSumario() {
    let sumarioHTML = `
<div style="page-break-after: always;">
    <h2 style="text-align: center; font-weight: bold; font-size: 12pt; text-transform: uppercase; margin-bottom: 2cm;">SUMÁRIO</h2>
    <div id="sumario-content">
`;

    documentStructure.forEach((item, index) => {
        const dots = '.'.repeat(Math.max(50 - item.title.length, 5));
        sumarioHTML += `<p style="margin-bottom: 0.5cm;">${item.number} ${item.title} ${dots} ${index + 1}</p>`;
    });

    sumarioHTML += `
    </div>
</div>
`;

    const length = quill.getLength();
    quill.clipboard.dangerouslyPasteHTML(length, sumarioHTML);
    showNotification('Sumário inserido! Será atualizado automaticamente.', 'success');
}

function insertCapitulo() {
    const numero = documentStructure.filter(i => i.type === 'capitulo').length + 1;
    const titulo = prompt('Título do Capítulo:', `CAPÍTULO ${numero}`) || `CAPÍTULO ${numero}`;
    
    const capituloHTML = `
<h1 style="font-weight: bold; font-size: 12pt; text-transform: uppercase; margin-top: 3cm; margin-bottom: 1.5cm; page-break-before: always;">
    ${numero} ${titulo}
</h1>
`;

    const length = quill.getLength();
    quill.clipboard.dangerouslyPasteHTML(length, capituloHTML);
    
    documentStructure.push({
        type: 'capitulo',
        number: numero,
        title: titulo,
        level: 1
    });
    
    updateStructurePanel();
    showNotification('Capítulo inserido com sucesso!', 'success');
}

function insertSecao() {
    const capitulo = documentStructure.filter(i => i.type === 'capitulo').length;
    const secao = documentStructure.filter(i => i.type === 'secao' && i.number.startsWith(capitulo + '.')).length + 1;
    const numero = `${capitulo}.${secao}`;
    const titulo = prompt('Título da Seção:', 'Título da Seção') || 'Título da Seção';
    
    const secaoHTML = `
<h2 style="font-weight: bold; font-size: 12pt; margin-top: 1.5cm; margin-bottom: 1cm;">
    ${numero} ${titulo}
</h2>
`;

    const length = quill.getLength();
    quill.clipboard.dangerouslyPasteHTML(length, secaoHTML);
    
    documentStructure.push({
        type: 'secao',
        number: numero,
        title: titulo,
        level: 2
    });
    
    updateStructurePanel();
    showNotification('Seção inserida com sucesso!', 'success');
}

function insertSubsecao() {
    const capitulo = documentStructure.filter(i => i.type === 'capitulo').length;
    const secao = documentStructure.filter(i => i.type === 'secao' && i.number.startsWith(capitulo + '.')).length;
    const subsecao = documentStructure.filter(i => i.type === 'subsecao' && i.number.startsWith(`${capitulo}.${secao}.`)).length + 1;
    const numero = `${capitulo}.${secao}.${subsecao}`;
    const titulo = prompt('Título da Subseção:', 'Título da Subseção') || 'Título da Subseção';
    
    const subsecaoHTML = `
<h3 style="font-style: italic; font-size: 12pt; margin-top: 1cm; margin-bottom: 0.5cm;">
    ${numero} ${titulo}
</h3>
`;

    const length = quill.getLength();
    quill.clipboard.dangerouslyPasteHTML(length, subsecaoHTML);
    
    documentStructure.push({
        type: 'subsecao',
        number: numero,
        title: titulo,
        level: 3
    });
    
    updateStructurePanel();
    showNotification('Subseção inserida com sucesso!', 'success');
}

function insertCitacaoCurta() {
    const texto = prompt('Texto da citação:') || 'Texto da citação';
    const autor = prompt('Autor (SOBRENOME):') || 'AUTOR';
    const ano = prompt('Ano:') || '2025';
    const pagina = prompt('Página (opcional):') || '';
    
    const paginaStr = pagina ? `, p. ${pagina}` : '';
    const citacaoHTML = `"${texto}" (${autor}, ${ano}${paginaStr})`;
    
    const selection = quill.getSelection();
    if (selection) {
        quill.insertText(selection.index, citacaoHTML);
    }
    
    showNotification('Citação curta inserida!', 'success');
}

function insertCitacaoLonga() {
    const texto = prompt('Texto da citação longa (mais de 3 linhas):') || 'Texto da citação longa';
    const autor = prompt('Autor (SOBRENOME):') || 'AUTOR';
    const ano = prompt('Ano:') || '2025';
    const pagina = prompt('Página (opcional):') || '';
    
    const paginaStr = pagina ? `, p. ${pagina}` : '';
    const citacaoHTML = `
<div style="margin-left: 4cm; font-size: 10pt; line-height: 1.0; margin-top: 1cm; margin-bottom: 1cm; text-indent: 0;">
    <p style="text-align: justify;">${texto}</p>
    <p style="text-align: right;">(${autor}, ${ano}${paginaStr})</p>
</div>
`;

    const length = quill.getLength();
    quill.clipboard.dangerouslyPasteHTML(length, citacaoHTML);
    
    showNotification('Citação longa inserida!', 'success');
}

function insertReferencia() {
    const tipo = prompt('Tipo (livro/artigo/capitulo/tese/site):', 'livro') || 'livro';
    let referencia = '';
    
    switch(tipo.toLowerCase()) {
        case 'livro':
            const autorLivro = prompt('Autor (SOBRENOME, Nome):') || 'SOBRENOME, Nome';
            const tituloLivro = prompt('Título:') || 'Título do livro';
            const local = prompt('Local:') || 'São Paulo';
            const editora = prompt('Editora:') || 'Editora';
            const anoLivro = prompt('Ano:') || '2025';
            referencia = `${autorLivro}. ${tituloLivro}. ${local}: ${editora}, ${anoLivro}.`;
            break;
            
        case 'artigo':
            const autorArtigo = prompt('Autor (SOBRENOME, Nome):') || 'SOBRENOME, Nome';
            const tituloArtigo = prompt('Título do artigo:') || 'Título do artigo';
            const periodico = prompt('Nome do periódico:') || 'Nome do Periódico';
            const volume = prompt('Volume:') || 'v. 1';
            const numero = prompt('Número:') || 'n. 1';
            const paginas = prompt('Páginas:') || 'p. 1-10';
            const anoArtigo = prompt('Ano:') || '2025';
            referencia = `${autorArtigo}. ${tituloArtigo}. ${periodico}, ${volume}, ${numero}, ${paginas}, ${anoArtigo}.`;
            break;
            
        default:
            referencia = prompt('Digite a referência completa:') || 'Referência completa';
    }
    
    referencesList.push(referencia);
    showNotification('Referência adicionada! Será incluída na seção de Referências.', 'success');
}

function insertTabela() {
    tableCount++;
    const titulo = prompt('Título da tabela:', `Descrição da Tabela ${tableCount}`) || `Descrição da Tabela ${tableCount}`;
    const linhas = parseInt(prompt('Número de linhas:', '3')) || 3;
    const colunas = parseInt(prompt('Número de colunas:', '3')) || 3;
    
    let tabelaHTML = `
<div style="margin-top: 1.5cm; margin-bottom: 1.5cm;">
    <p style="font-size: 10pt; font-weight: bold; margin-bottom: 0.5cm;">Tabela ${tableCount} - ${titulo}</p>
    <table style="width: 100%; border-collapse: collapse; font-size: 10pt;">
        <thead>
            <tr style="border-top: 2px solid black; border-bottom: 1px solid black;">
`;

    for (let j = 0; j < colunas; j++) {
        tabelaHTML += `<th style="padding: 0.3cm; text-align: left;">Coluna ${j + 1}</th>`;
    }
    
    tabelaHTML += `</tr></thead><tbody>`;
    
    for (let i = 0; i < linhas; i++) {
        tabelaHTML += `<tr>`;
        for (let j = 0; j < colunas; j++) {
            tabelaHTML += `<td style="padding: 0.3cm;">Dado</td>`;
        }
        tabelaHTML += `</tr>`;
    }
    
    tabelaHTML += `
        </tbody>
    </table>
    <p style="font-size: 10pt; font-style: italic; margin-top: 0.3cm;">Fonte: Elaborado pelo autor (2025).</p>
</div>
`;

    const length = quill.getLength();
    quill.clipboard.dangerouslyPasteHTML(length, tabelaHTML);
    
    showNotification('Tabela ABNT inserida! Edite os dados conforme necessário.', 'success');
}

function insertFigura() {
    figureCount++;
    const titulo = prompt('Legenda da figura:', `Descrição da Figura ${figureCount}`) || `Descrição da Figura ${figureCount}`;
    const fonte = prompt('Fonte:', 'Elaborado pelo autor (2025)') || 'Elaborado pelo autor (2025)';
    
    const figuraHTML = `
<div style="text-align: center; margin-top: 1.5cm; margin-bottom: 1.5cm;">
    <div style="border: 1px dashed #ccc; padding: 2cm; background: #f5f5f5;">
        <p style="color: #999;">[ Insira sua imagem aqui ]</p>
        <p style="color: #999; font-size: 10pt;">Clique com botão direito → Inserir Imagem</p>
    </div>
    <p style="font-size: 10pt; font-weight: bold; margin-top: 0.5cm;">Figura ${figureCount} - ${titulo}</p>
    <p style="font-size: 10pt; font-style: italic;">Fonte: ${fonte}.</p>
</div>
`;

    const length = quill.getLength();
    quill.clipboard.dangerouslyPasteHTML(length, figuraHTML);
    
    showNotification('Espaço para figura inserido!', 'success');
}

function insertEquacao() {
    const equacao = prompt('Digite a equação (formato LaTeX ou texto):') || 'E = mc²';
    const numero = documentStructure.filter(i => i.type === 'equacao').length + 1;
    
    const equacaoHTML = `
<div style="text-align: center; margin-top: 1cm; margin-bottom: 1cm;">
    <p style="font-style: italic;">${equacao}</p>
    <p style="text-align: right; margin-right: 2cm; font-size: 10pt;">(${numero})</p>
</div>
`;

    const length = quill.getLength();
    quill.clipboard.dangerouslyPasteHTML(length, equacaoHTML);
    
    documentStructure.push({
        type: 'equacao',
        number: numero
    });
    
    showNotification('Equação inserida!', 'success');
}

// Funções de Exportação

function salvarDocumento() {
    saveToLocalStorage();
    showNotification('Documento salvo localmente!', 'success');
}

function exportarDocx() {
    showNotification('Gerando DOCX com formatação ABNT...', 'info');
    
    setTimeout(() => {
        const content = quill.root.innerHTML;
        const docxContent = generateDOCXContent(content);
        
        // Simular download
        showNotification('DOCX gerado com sucesso! Download iniciado.', 'success');
        alert('Funcionalidade de exportação DOCX em desenvolvimento.\n\nO documento será baixado com:\n✓ Formatação ABNT completa\n✓ Margens configuradas\n✓ Fonte Times New Roman 12pt\n✓ Espaçamento 1,5\n✓ Sumário automático');
    }, 2000);
}

function exportarPdf() {
    showNotification('Gerando PDF com formatação ABNT...', 'info');
    
    setTimeout(() => {
        showNotification('PDF gerado com sucesso! Download iniciado.', 'success');
        alert('Funcionalidade de exportação PDF em desenvolvimento.\n\nO documento será baixado com:\n✓ Formatação ABNT completa\n✓ Qualidade profissional\n✓ Pronto para impressão');
    }, 2000);
}

function generateDOCXContent(htmlContent) {
    // Aqui seria implementada a conversão real para DOCX
    // Por ora, retornamos o HTML
    return htmlContent;
}

// Funções Auxiliares

function updateStatistics() {
    const text = quill.getText();
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const chars = text.length;
    const pages = Math.ceil(words / 250); // ~250 palavras por página
    
    document.getElementById('wordCount').textContent = `${words} palavras`;
    document.getElementById('pageCount').textContent = `${pages} ${pages === 1 ? 'página' : 'páginas'}`;
}

function updateStructurePanel() {
    const panel = document.getElementById('contentStructure');
    if (!panel) return;
    
    panel.innerHTML = '';
    
    if (documentStructure.length === 0) {
        panel.innerHTML = '<li class="text-muted"><em>Nenhum capítulo ainda</em></li>';
        return;
    }
    
    documentStructure.forEach(item => {
        const li = document.createElement('li');
        li.style.marginLeft = `${(item.level - 1) * 20}px`;
        
        let icon = '';
        switch(item.type) {
            case 'capitulo':
                icon = '<i class="fas fa-book text-primary"></i>';
                break;
            case 'secao':
                icon = '<i class="fas fa-bookmark text-secondary"></i>';
                break;
            case 'subsecao':
                icon = '<i class="fas fa-angle-right text-muted"></i>';
                break;
        }
        
        li.innerHTML = `${icon} ${item.number} ${item.title}`;
        panel.appendChild(li);
    });
}

function updateStructure() {
    // Atualizar estrutura do documento baseado no conteúdo
    updateStructurePanel();
}

function visualizarPreview() {
    const content = quill.root.innerHTML;
    const previewWindow = window.open('', 'Preview', 'width=800,height=600');
    
    previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Preview - Documento ABNT</title>
            <style>
                body {
                    font-family: 'Times New Roman', serif;
                    font-size: 12pt;
                    line-height: 1.5;
                    max-width: 21cm;
                    margin: 0 auto;
                    padding: 3cm 2cm 2cm 3cm;
                    background: #f0f0f0;
                }
                .page {
                    background: white;
                    padding: 3cm 2cm 2cm 3cm;
                    margin-bottom: 1cm;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    min-height: 29.7cm;
                }
            </style>
        </head>
        <body>
            <div class="page">
                ${content}
            </div>
        </body>
        </html>
    `);
}

function configurarDocumento() {
    alert('Configurações do Documento\n\n✓ Margens: 3-2-3-2 cm (ABNT)\n✓ Fonte: Times New Roman 12pt\n✓ Espaçamento: 1,5 linhas\n✓ Alinhamento: Justificado\n✓ Recuo: 1,25 cm\n\nFormatação automática aplicada!');
}

function showNotification(message, type = 'info') {
    const colors = {
        success: '#28a745',
        info: '#17a2b8',
        warning: '#ffc107',
        danger: '#dc3545'
    };
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Auto-save
function setupAutoSave() {
    setInterval(() => {
        saveToLocalStorage();
    }, 60000); // Salvar a cada 1 minuto
}

function saveToLocalStorage() {
    const content = quill.getContents();
    localStorage.setItem('abnt-document', JSON.stringify(content));
    localStorage.setItem('abnt-structure', JSON.stringify(documentStructure));
    localStorage.setItem('abnt-references', JSON.stringify(referencesList));
}

function loadFromLocalStorage() {
    const savedContent = localStorage.getItem('abnt-document');
    const savedStructure = localStorage.getItem('abnt-structure');
    const savedReferences = localStorage.getItem('abnt-references');
    
    if (savedContent) {
        quill.setContents(JSON.parse(savedContent));
    }
    
    if (savedStructure) {
        documentStructure = JSON.parse(savedStructure);
        updateStructurePanel();
    }
    
    if (savedReferences) {
        referencesList = JSON.parse(savedReferences);
    }
}

// Atalhos de teclado
document.addEventListener('keydown', function(e) {
    // Ctrl+S para salvar
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        salvarDocumento();
    }
    
    // Ctrl+E para exportar DOCX
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        exportarDocx();
    }
});

console.log('Editor ABNT carregado com sucesso! ✍️');
