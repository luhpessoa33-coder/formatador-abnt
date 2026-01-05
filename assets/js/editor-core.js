let quill;
const PAGE_LIMIT = 300;
const WORDS_PER_PAGE = 275;

document.addEventListener('DOMContentLoaded', () => {
    quill = new Quill('#main-editor', {
        modules: { toolbar: '#toolbar-container' },
        theme: 'snow'
    });

    const saved = localStorage.getItem('ACADEMIC_V3_SAVE');
    if (saved) quill.setContents(JSON.parse(saved));

    quill.on('text-change', () => {
        const words = quill.getText().trim().split(/\s+/).length;
        const pages = Math.ceil(words / WORDS_PER_PAGE);
        document.getElementById('pageCounter').innerText = `${words} palavras (~${pages} pág)`;

        if (pages > PAGE_LIMIT) {
            document.getElementById('paper-A4').classList.add('over-limit');
            alert("AVISO: Limite industrial de 300 páginas atingido.");
        } else {
            localStorage.setItem('ACADEMIC_V3_SAVE', JSON.stringify(quill.getContents()));
            updateStatus();
        }
    });

    // Importar DOCX
    document.getElementById('fileInput').addEventListener('change', (e) => {
        const reader = new FileReader();
        reader.onload = (evt) => {
            mammoth.convertToHtml({arrayBuffer: evt.target.result})
                .then(res => quill.clipboard.dangerouslyPasteHTML(0, res.value));
        };
        reader.readAsArrayBuffer(e.target.files[0]);
    });
});

/**
 * Wipe Data: Limpeza de Segurança Industrial.
 */
function confirmarLimpezaTotal() {
    if (confirm("⚠️ AVISO: Isso apagará permanentemente todos os seus rascunhos salvos neste navegador. Deseja continuar?")) {
        localStorage.clear();
        alert("✅ Todos os dados locais foram removidos.");
        window.location.reload();
    }
}

async function baixarDocxFinal() {
    const html = quill.root.innerHTML;
    const blob = await window.htmlToDocx(html, null, {
        margins: { top: 1700, bottom: 1133, left: 1700, right: 1133 }
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Trabalho_AcademicHub_Pro.docx';
    link.click();
}

function updateStatus() {
    const s = document.getElementById('statusSalvo');
    s.innerHTML = '<i class="fas fa-sync fa-spin"></i> Sincronizando...';
    setTimeout(() => s.innerHTML = '<i class="fas fa-check-circle"></i> Sincronizado', 1000);
}

function toggleDarkMode() { document.body.classList.toggle('dark-mode'); }
function ativarEditor() { new bootstrap.Tab(document.querySelector('[data-bs-target="#tab-editor"]')).show(); }
