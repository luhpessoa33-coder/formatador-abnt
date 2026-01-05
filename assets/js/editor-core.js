// Configuração de Templates
const TEMPLATES = {
    ifpe: { font: 'Arial', size: '12pt', line: '1.5', margins: [3, 3, 2, 2] },
    abnt_generico: { font: 'Times New Roman', size: '12pt', line: '1.5', margins: [3, 3, 2, 2] },
    apa: { font: 'Times New Roman', size: '12pt', line: '2.0', margins: [2.5, 2.5, 2.5, 2.5] }
};

let editor;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    editor = new Quill('#main-editor', {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['image', 'link'],
                ['clean']
            ]
        }
    });

    carregarEstado();
    setInterval(autosave, 2000);
});

// Importação com Formatação Automática
async function processarImportacaoPrincipal() {
    const file = document.getElementById('fileInput').files[0];
    if(!file) return Swal.fire('Erro', 'Selecione o arquivo .docx', 'error');

    Swal.showLoading();
    
    const reader = new FileReader();
    reader.onload = async (e) => {
        const result = await mammoth.convertToHtml({ arrayBuffer: e.target.result });
        
        // Injeta o conteúdo
        editor.root.innerHTML = result.value;
        
        // IA: Aplica Formatação Automática baseada no Template
        aplicarTemplate();
        
        Swal.fire('Sucesso', 'Conteúdo importado e formatado via IA Acadêmica.', 'success');
        irParaEditor();
    };
    reader.readAsArrayBuffer(file);
}

function aplicarTemplate() {
    const tName = document.getElementById('masterTemplate').value;
    const config = TEMPLATES[tName];
    
    const paper = document.getElementById('paper-A4');
    paper.style.paddingTop = config.margins[0] + "cm";
    paper.style.paddingLeft = config.margins[1] + "cm";
    paper.style.paddingRight = config.margins[2] + "cm";
    paper.style.paddingBottom = config.margins[3] + "cm";
    
    editor.root.style.fontFamily = config.font;
    editor.root.style.fontSize = config.size;
    editor.root.style.lineHeight = config.line;
    
    verificarLimitePaginas();
}

function verificarLimitePaginas() {
    const height = editor.root.scrollHeight;
    const pageHeightPx = 1122; // Aprox pixels para 29.7cm a 96dpi
    const numPages = Math.ceil(height / pageHeightPx);
    
    const monitor = document.getElementById('pageMonitor');
    monitor.innerText = `Páginas: ${numPages} / 300`;
    
    if(numPages > 300) {
        monitor.className = "badge bg-danger animate__animated animate__shakeX";
        Swal.fire('Limite Atingido', 'O trabalho excedeu 300 páginas!', 'warning');
    } else {
        monitor.className = "badge bg-success";
    }
}

function autosave() {
    localStorage.setItem('ipojuca_master_v3', editor.root.innerHTML);
    document.getElementById('statusSalvo').innerHTML = `<i class="fas fa-check"></i> Sincronizado: ${new Date().toLocaleTimeString()}`;
    verificarLimitePaginas();
}

function carregarEstado() {
    const salvo = localStorage.getItem('ipojuca_master_v3');
    if(salvo) editor.root.innerHTML = salvo;
}

function irParaEditor() {
    const tab = new bootstrap.Tab(document.querySelector('[data-bs-target="#tab-editor"]'));
    tab.show();
}
