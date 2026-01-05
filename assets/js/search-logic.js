let biblioGlobal = [];
async function buscarCientificoV3() {
    const q = document.getElementById('inputBusca').value;
    const area = document.getElementById('areaResultados');
    if (!q) return;
    area.innerHTML = '<div class="text-center py-5"><i class="fas fa-spinner fa-spin"></i></div>';
    try {
        const res = await fetch(`https://api.crossref.org/works?query=${encodeURIComponent(q)}&rows=10`);
        const data = await res.json();
        area.innerHTML = '';
        data.message.items.forEach(item => {
            const family = item.author ? item.author[0].family : "AUTOR";
            const ano = item.published ? item.published['date-parts'][0][0] : "2025";
            const titulo = item.title ? item.title[0] : "Sem título";
            const div = document.createElement('div');
            div.className = 'card mb-2 p-2 bg-dark text-white border-start border-primary border-4 small';
            div.innerHTML = `<strong>${titulo.substring(0, 60)}...</strong><br><span>${family} (${ano})</span><button class="btn btn-xxs btn-primary mt-1 w-100" onclick="registrarCitar('${family}', '${ano}', '${titulo}')">+ Citar</button>`;
            area.appendChild(div);
        });
    } catch (e) { area.innerHTML = 'Erro na busca.'; }
}

function registrarCitar(autor, ano, titulo) {
    const range = quill.getSelection(true);
    quill.insertText(range.index, ` (${autor.toUpperCase()}, ${ano}) `);
    const ref = `${autor.toUpperCase()}, ${titulo}. [S.l.], ${ano}.`;
    if (!biblioGlobal.includes(ref)) {
        biblioGlobal.push(ref);
        document.getElementById('refBadge').innerText = biblioGlobal.length;
        document.getElementById('listaRefs').innerHTML = biblioGlobal.sort().map(r => `<div class='border-bottom mb-1'>${r}</div>`).join('');
    }
}
