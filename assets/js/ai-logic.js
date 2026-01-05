/**
 * IA Acadêmica e Ficha Catalográfica Automática
 */
function gerarFichaCatalograficaV3() {
    const autor = "Genuino, Luana Pessoa";
    const titulo = "Pagamento por Serviços Ambientais Hídricos (PSA Hídrico): Seleção de Áreas Prioritárias na Bacia do Rio Ipojuca, Pernambuco";
    const ano = "2026";

    const fichaHtml = `
        <div style="border: 1px solid #000; padding: 15px; margin: 2cm auto; width: 12.5cm; font-family: 'Times New Roman', serif; font-size: 10pt; line-height: 1.2;">
            <p>G341p &nbsp;&nbsp; ${autor}.</p>
            <p style="margin-left: 40px;">${titulo} / ${autor}. – Recife, ${ano}.<br>150 f. : il. color.</p>
            <p style="margin-left: 40px;">Orientadora: Prof.ª Dr.ª Ioná Barbosa.<br>Dissertação (Mestrado) -- IFPE, ${ano}.</p>
            <p style="margin-left: 40px;">1. PSA Hídrico. 2. Rio Ipojuca. 3. AHP. I. Título.</p>
        </div>`;

    quill.clipboard.dangerouslyPasteHTML(quill.getLength(), fichaHtml);
}

function validarTextoIA() {
    const sel = quill.getSelection();
    if (!sel || sel.length < 5) return alert("Selecione um texto.");
    document.getElementById('iaFeedback').innerHTML = '<strong>Análise:</strong> Coerência alta. Sugestão: utilize conectivos mais formais.';
}

function gerarResumoIA() {
    document.getElementById('iaSugestoes').innerHTML = "<strong>Sugestão:</strong> Este estudo analisa os impactos do PSA Hídrico na Bacia do Rio Ipojuca através de modelagem multicritério...";
}

function insertCapa() {
    quill.clipboard.dangerouslyPasteHTML(0, `<div style="text-align:center; font-weight:bold; text-transform:uppercase;"><p>IFPE - MPGA</p><div style="margin-top:10cm;">TÍTULO DA DISSERTAÇÃO</div><div style="margin-top:10cm;">RECIFE - 2026</div></div>`);
}
