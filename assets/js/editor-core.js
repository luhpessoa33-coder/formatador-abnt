let quill;
const MAX_PAGES = 300;
const WORDS_PER_PAGE = 275;

document.addEventListener('DOMContentLoaded', () => {
    quill = new Quill('#main-editor', { modules: { toolbar: '#toolbar-container' }, theme: 'snow' });
    const saved = localStorage.getItem('ACADEMIC_V3_SAVE');
    if (saved) quill.setContents(JSON.parse(saved));

    quill.on('text-change', () => {
        const text = quill.getText().trim();
        const wordCount = text.split(/\s+/).length;
        const pages = Math.ceil(wordCount / WORDS_PER_PAGE);
        document.getElementById('pageCounter').innerText = `${wordCount} palavras (~${pages} pág)`;
        if (pages > MAX_PAGES) document.getElementById('paper-A4').classList.add('over-limit');
        else {
            document.getElementById('paper-A4').classList.remove('over-limit');
            localStorage.setItem('ACADEMIC_V3_SAVE', JSON.stringify(quill.getContents()));
            updateStatus();
        }
    });
});

function updateStatus() {
    const s = document.getElementById('statusSalvo');
    s.innerHTML = '<i class="fas fa-sync fa-spin"></i> A guardar...';
    setTimeout(() => s.innerHTML = '<i class="fas fa-check-circle"></i> Sincronizado', 1000);
}

async function exportarDocxIndustrial() {
    const html = quill.root.innerHTML;
    const blob = await window.htmlToDocx(html, null, { margins: { top: 1700, bottom: 1133, left: 1700, right: 1133 } });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Trabalho_AcademicHub_Pro.docx';
    link.click();
}

function toggleDarkMode() { document.body.classList.toggle('dark-mode'); }
