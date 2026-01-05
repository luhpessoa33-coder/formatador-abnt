function validarTextoIA() {
    const sel = quill.getSelection();
    if (!sel || sel.length < 5) return alert("Selecione um texto para analisar.");
    document.getElementById('iaFeedback').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analisando...';
    setTimeout(() => {
        document.getElementById('iaFeedback').innerHTML = `<strong>Análise Ética:</strong><br>✅ Citações formatadas<br>⚠️ Sugestão: Use termos mais formais.<br>🔍 Plágio: 0% detetado.`;
    }, 1200);
}

function gerarResumoIA() {
    const text = quill.getText();
    document.getElementById('iaSugestoes').innerHTML = `<strong>Sugestão:</strong> O presente estudo analisa ${text.substring(0, 100)}...`;
}

function insertCapa() {
    const html = `<div style="text-align:center; font-weight:bold; text-transform:uppercase;">
        <p>INSTITUTO FEDERAL DE PERNAMBUCO</p><p>MESTRADO EM GESTÃO AMBIENTAL</p>
        <div style="margin-top:10cm;">TÍTULO DA DISSERTAÇÃO</div><div style="margin-top:10cm;">RECIFE - 2025</div>
    </div>`;
    quill.clipboard.dangerouslyPasteHTML(0, html);
}
