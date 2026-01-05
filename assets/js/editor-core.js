let quill;
const MAX_PAGES = 300;
const WORDS_PER_PAGE = 275;

document.addEventListener('DOMContentLoaded', () => {
    quill = new Quill('#main-editor', {
        modules: { toolbar: [['bold', 'italic'], [{ 'header': 1 }, { 'header': 2 }], [{ 'list': 'ordered'}, { 'list': 'bullet' }], ['image', 'clean']] },
        theme: 'snow'
    });

    const saved = localStorage.getItem('ACADEMIC_V3_SAVE');
    if (saved) quill.setContents(JSON.parse(saved));

    quill.on('text-change', () => {
        const words = quill.getText().trim().split(/\s+/).length;
        const pages = Math.ceil(words / WORDS_PER_PAGE);
        document.getElementById('pageCounter').innerText = `${words} palavras (~${pages} pág)`;

        if (pages > MAX_PAGES) {
            document.getElementById('paper-A4').classList.add('over-limit');
        } else {
            document.getElementById('paper-A4').classList.remove('over-limit');
            localStorage.setItem('ACADEMIC_V3_SAVE', JSON.stringify(quill.getContents()));
            updateStatus();
        }
    });

    document.getElementById('fileInput').addEventListener('change', e => {
        const reader = new FileReader();
        reader.onload = evt => {
            mammoth.convertToHtml({arrayBuffer: evt.target.result})
                .then(res => quill.clipboard.dangerouslyPasteHTML(0, res.value));
        };
        reader.readAsArrayBuffer(e.target.files[0]);
    });
});

function confirmarLimpezaTotal() {
    if (confirm("⚠️ AVISO: Isto apagará todos os rascunhos salvos neste navegador. Continuar?")) {
        localStorage.removeItem('ACADEMIC_V3_SAVE');
        alert("✅ Dados removidos.");
        window.location.reload();
    }
}

async function baixarDocxFinal() {
    const html = quill.root.innerHTML;
    const blob = await window.htmlToDocx(html, null, { margins: { top: 1700, bottom: 1133, left: 1700, right: 1133 } });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Manuscrito_AcademicHub_Pro.docx';
    link.click();
}

function updateStatus() {
    const s = document.getElementById('statusSalvo');
    s.innerHTML = '<i class="fas fa-sync fa-spin"></i> Sincronizando...';
    setTimeout(() => s.innerHTML = '<i class="fas fa-check-circle"></i> Sincronizado', 1000);
}

function toggleDarkMode() { document.body.classList.toggle('dark-mode'); }
function ativarEditor() { new bootstrap.Tab(document.querySelector('[data-bs-target="#tab-editor"]')).show(); }
