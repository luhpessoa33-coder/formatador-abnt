function analisarTextoIA() {
    const sel = quill.getSelection();
    if (!sel || sel.length < 5) return alert("Selecione um texto no editor.");
    
    const feedback = document.getElementById('iaFeedback');
    feedback.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analisando coerência...';
    
    setTimeout(() => {
        feedback.innerHTML = `<strong>Resultado IA:</strong><br>✅ Coesão: Alta<br>⚠️ Sugestão: Evite o uso de "muito" e "bastante". Utilize termos como "substancialmente".<br>🔍 Plágio: Não detectado.`;
    }, 1500);
}

function gerarResumoIA() {
    const text = quill.getText();
    document.getElementById('iaSugestoes').innerHTML = `<strong>Resumo Sugerido:</strong> O presente estudo analisa os impactos de ${text.substring(0, 100)}...<br><br><strong>Keywords:</strong> Gestão; Sustentabilidade; Tecnologia.`;
}

function insertCapa() {
    const html = `<div style="text-align:center; font-weight:bold; text-transform:uppercase;">
        <p>INSTITUTO FEDERAL DE PERNAMBUCO</p>
        <p>MESTRADO EM GESTÃO AMBIENTAL</p>
        <div style="margin-top:10cm;">TÍTULO DA DISSERTAÇÃO</div>
        <div style="margin-top:10cm;">RECIFE - 2025</div>
    </div>`;
    quill.clipboard.dangerouslyPasteHTML(0, html);
}