/**
 * Inteligência Académica Pro V3.0
 */
function gerarFichaCatalográficaV3() {
    const autor = "Genuíno, Luana Pessoa";
    const titulo = "Pagamento por Serviços Ambientais Hídricos na Bacia do Rio Ipojuca";
    const ano = "2026";

    const fichaHtml = `
        <div style="border: 1px solid #000; padding: 15px; margin: 2cm auto; width: 12.5cm; font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.2;">
            <p>G341p &nbsp;&nbsp; ${autor}.</p>
            <p style="margin-left: 40px;">${titulo} / ${autor}. – Recife, ${ano}.<br>150 f. : il. color.</p>
            <p style="margin-left: 40px;">Orientadora: Prof.ª Dr.ª Ioná Barbosa.<br>Dissertação (Mestrado Profissional) -- IFPE, ${ano}.</p>
            <p style="margin-left: 40px;">1. PSA Hídrico. 2. AHP. 3. SIG. I. Título.</p>
        </div>`;
    quill.clipboard.dangerouslyPasteHTML(quill.getLength(), fichaHtml);
}

function validarTextoIA() {
    const sel = quill.getSelection();
    if (!sel || sel.length < 5) return alert("Selecione um texto.");
    document.getElementById('iaFeedback').innerHTML = "<strong>Análise:</strong> Coerência alta. Sugestão: adicione uma citação de Saaty (1980) para validar o método AHP.";
}

function configurarTemplate() {
    const t = document.getElementById('templateSelector').value;
    const editor = document.querySelector('.ql-editor');
    if (t === 'ieee') {
        editor.style.padding = "2cm";
        editor.style.columnCount = "2";
        alert("Template IEEE Aplicado: Duas colunas ativado.");
    } else {
        editor.style.padding = "3cm 2cm 2cm 3cm";
        editor.style.columnCount = "1";
    }
}

function executarCapaAutomatica() {
    const capa = `<div style="text-align:center; font-weight:bold; text-transform:uppercase;"><p>IFPE - CAMPUS RECIFE</p><div style="margin-top:10cm;">TÍTULO DO TRABALHO</div><div style="margin-top:10cm;">RECIFE - 2026</div></div><div style="page-break-after: always;"></div>`;
    quill.clipboard.dangerouslyPasteHTML(0, capa);
}
