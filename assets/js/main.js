// Formatador ABNT - JavaScript Principal

// Drag and Drop para Upload
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const validadorInput = document.getElementById('validadorInput');
const textoInput = document.getElementById('textoInput');

// Prevenir comportamento padrão
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    if (uploadArea) {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    }
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Highlight ao arrastar
['dragenter', 'dragover'].forEach(eventName => {
    if (uploadArea) {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.add('dragover');
        }, false);
    }
});

['dragleave', 'drop'].forEach(eventName => {
    if (uploadArea) {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.remove('dragover');
        }, false);
    }
});

// Handle drop
if (uploadArea) {
    uploadArea.addEventListener('drop', handleDrop, false);
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

// Handle file input change
if (fileInput) {
    fileInput.addEventListener('change', function(e) {
        handleFiles(this.files);
    });
}

function handleFiles(files) {
    if (files.length > 0) {
        const file = files[0];
        const fileInfo = document.getElementById('fileInfo');
        const fileName = document.getElementById('fileName');
        const fileSize = document.getElementById('fileSize');
        
        fileName.textContent = file.name;
        fileSize.textContent = formatBytes(file.size);
        fileInfo.classList.remove('d-none');
        
        // Simular leitura do arquivo
        console.log('Arquivo carregado:', file.name);
    }
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Contador de caracteres
if (textoInput) {
    textoInput.addEventListener('input', function() {
        const charCount = document.getElementById('charCount');
        charCount.textContent = this.value.length;
    });
}

// Botão Formatar
const btnFormatar = document.getElementById('btnFormatar');
if (btnFormatar) {
    btnFormatar.addEventListener('click', function() {
        formatarDocumento();
    });
}

function formatarDocumento() {
    const progressArea = document.getElementById('progressArea');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const resultArea = document.getElementById('resultArea');
    
    // Mostrar progress
    progressArea.classList.remove('d-none');
    resultArea.classList.add('d-none');
    
    // Simular processamento
    let progress = 0;
    const steps = [
        { pct: 20, text: 'Analisando documento...' },
        { pct: 40, text: 'Aplicando margens ABNT...' },
        { pct: 60, text: 'Configurando fonte e espaçamento...' },
        { pct: 80, text: 'Gerando sumário...' },
        { pct: 100, text: 'Finalizando...' }
    ];
    
    let currentStep = 0;
    const interval = setInterval(() => {
        if (currentStep < steps.length) {
            progress = steps[currentStep].pct;
            progressBar.style.width = progress + '%';
            progressBar.textContent = progress + '%';
            progressText.textContent = steps[currentStep].text;
            currentStep++;
        } else {
            clearInterval(interval);
            // Mostrar resultado
            setTimeout(() => {
                progressArea.classList.add('d-none');
                resultArea.classList.remove('d-none');
            }, 500);
        }
    }, 800);
}

// Downloads
document.getElementById('btnDownloadDocx')?.addEventListener('click', function() {
    alert('Download do DOCX iniciado!\n\nNota: Esta é uma demonstração. Na versão completa, o arquivo será gerado e baixado automaticamente.');
});

document.getElementById('btnDownloadPdf')?.addEventListener('click', function() {
    alert('Download do PDF iniciado!\n\nNota: Esta é uma demonstração. Na versão completa, o arquivo será gerado e baixado automaticamente.');
});

document.getElementById('btnPreview')?.addEventListener('click', function() {
    alert('Abrindo visualização...\n\nNota: Esta é uma demonstração. Na versão completa, uma prévia do documento será exibida.');
});

// Gerar Templates
function gerarTemplate(tipo) {
    let mensagem = '';
    switch(tipo) {
        case 'dissertacao':
            mensagem = 'Template de Dissertação será gerado com:\n\n✓ Capa ABNT\n✓ Folha de Rosto\n✓ Sumário Automático\n✓ Estilos Configurados\n✓ Exemplos de Citações';
            break;
        case 'artigo':
            mensagem = 'Template de Artigo será gerado com:\n\n✓ Estrutura IMRAD\n✓ Abstract/Resumo\n✓ Keywords\n✓ Formatação ABNT';
            break;
    }
    alert(mensagem + '\n\nNota: Esta é uma demonstração.');
}

// Validador ABNT
if (validadorInput) {
    validadorInput.addEventListener('change', function(e) {
        validarDocumento(this.files[0]);
    });
}

function validarDocumento(file) {
    if (!file) return;
    
    const validacaoResultado = document.getElementById('validacaoResultado');
    const validacaoLista = document.getElementById('validacaoLista');
    const conformidadeBar = document.getElementById('conformidadeBar');
    const conformidadePct = document.getElementById('conformidadePct');
    
    // Simular validação
    const checks = [
        { item: 'Margens ABNT (3-2-3-2 cm)', status: 'success', msg: 'Conforme' },
        { item: 'Fonte Times New Roman 12pt', status: 'success', msg: 'Conforme' },
        { item: 'Espaçamento 1,5 linhas', status: 'success', msg: 'Conforme' },
        { item: 'Recuo primeira linha 1,25 cm', status: 'warning', msg: 'Parcialmente conforme' },
        { item: 'Numeração de páginas', status: 'success', msg: 'Conforme' },
        { item: 'Sumário automático', status: 'success', msg: 'Presente' },
        { item: 'Citações formatadas', status: 'warning', msg: '2 citações sem formatação correta' },
        { item: 'Referências em ordem alfabética', status: 'success', msg: 'Conforme' },
        { item: 'Tabelas sem bordas laterais', status: 'danger', msg: '3 tabelas com bordas incorretas' }
    ];
    
    validacaoLista.innerHTML = '';
    let sucessos = 0;
    
    checks.forEach(check => {
        const item = document.createElement('div');
        item.className = `list-group-item ${check.status}`;
        
        let icon = '';
        if (check.status === 'success') {
            icon = '<i class="fas fa-check-circle text-success"></i>';
            sucessos++;
        } else if (check.status === 'warning') {
            icon = '<i class="fas fa-exclamation-triangle text-warning"></i>';
            sucessos += 0.5;
        } else {
            icon = '<i class="fas fa-times-circle text-danger"></i>';
        }
        
        item.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    ${icon}
                    <strong class="ms-2">${check.item}</strong>
                </div>
                <span class="badge bg-secondary">${check.msg}</span>
            </div>
        `;
        validacaoLista.appendChild(item);
    });
    
    const conformidade = Math.round((sucessos / checks.length) * 100);
    conformidadeBar.style.width = conformidade + '%';
    conformidadePct.textContent = conformidade + '%';
    
    if (conformidade >= 80) {
        conformidadeBar.className = 'progress-bar bg-success';
    } else if (conformidade >= 60) {
        conformidadeBar.className = 'progress-bar bg-warning';
    } else {
        conformidadeBar.className = 'progress-bar bg-danger';
    }
    
    validacaoResultado.classList.remove('d-none');
}

// Gerador de Citações
function buscarPorDOI() {
    const doi = document.getElementById('doiInput').value;
    if (!doi) {
        alert('Por favor, digite um DOI válido.');
        return;
    }
    
    // Simular busca
    setTimeout(() => {
        const citacao = `SILVA, J. A.; SANTOS, M. B. Título do artigo científico. Nome do Periódico, v. 10, n. 2, p. 150-165, 2023. DOI: ${doi}.`;
        mostrarCitacao(citacao);
    }, 1000);
}

function buscarPorISBN() {
    const isbn = document.getElementById('isbnInput').value;
    if (!isbn) {
        alert('Por favor, digite um ISBN válido.');
        return;
    }
    
    // Simular busca
    setTimeout(() => {
        const citacao = `AUTOR, Nome. Título do livro. 2. ed. São Paulo: Editora Exemplo, 2023. 350 p. ISBN ${isbn}.`;
        mostrarCitacao(citacao);
    }, 1000);
}

function gerarCitacaoManual() {
    // Simular geração
    const citacao = 'SOBRENOME, Nome. Título da obra. Local: Editora, ano.';
    mostrarCitacao(citacao);
}

function mostrarCitacao(citacao) {
    const resultado = document.getElementById('citacaoResultado');
    const texto = document.getElementById('citacaoTexto');
    texto.value = citacao;
    resultado.classList.remove('d-none');
}

function copiarCitacao() {
    const texto = document.getElementById('citacaoTexto');
    texto.select();
    document.execCommand('copy');
    alert('Citação copiada para a área de transferência!');
}

// Conversor PDF
function converterPDF() {
    alert('Conversor PDF\n\nSelecione seu documento Word para converter em PDF mantendo a formatação ABNT.\n\nNota: Funcionalidade em demonstração.');
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Fade in ao scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .accordion-item').forEach(el => {
    observer.observe(el);
});

console.log('Formatador ABNT IFPE carregado com sucesso! 📝');
