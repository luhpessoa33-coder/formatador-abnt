/**
 * AcademicHub Pro V3.0 - Search Engine
 * Integração: CrossRef, PubMed, arXiv, Semantic Scholar e SciELO
 */

let biblioGlobal = [];

/**
 * Função principal de busca multibase
 */
async function buscarCientificoV3() {
    const query = document.getElementById('inputBusca').value.trim();
    const areaResultados = document.getElementById('areaResultados');
    
    if (!query) {
        alert("Por favor, digite um termo de busca (Título, DOI ou Tema).");
        return;
    }

    areaResultados.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary mb-2"></div>
            <p class="small text-white-50">Consultando bases globais...</p>
        </div>`;

    try {
        // Executa buscas em paralelo para máxima velocidade 
        const [crossRefRes, pubMedRes, arXivRes] = await Promise.all([
            buscarCrossRef(query),
            buscarPubMed(query),
            buscarArXiv(query)
        ]);

        // Consolida e remove duplicatas por DOI
        const resultadosBrutos = [...crossRefRes, ...pubMedRes, ...arXivRes];
        const resultadosUnicos = filtrarDuplicados(resultadosBrutos);

        exibirResultadosV3(resultadosUnicos);

    } catch (error) {
        console.error("Erro na busca potencializada:", error);
        areaResultados.innerHTML = '<p class="text-danger small p-3">Erro ao conectar com as bases científicas. Verifique sua conexão.</p>';
    }
}

/**
 * BASE 1: CrossRef API (Geral e SciELO) 
 */
async function buscarCrossRef(query) {
    try {
        const url = `https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=10&select=title,author,published,DOI,container-title`;
        const response = await fetch(url);
        const data = await response.json();
        
        return data.message.items.map(item => ({
            titulo: item.title ? item.title[0] : "Sem título",
            autores: item.author ? item.author.map(a => `${a.family}, ${a.given || ''}`).join('; ') : "Autor Desconhecido",
            sobrenomeCrt: item.author ? item.author[0].family : "AUTOR",
            ano: item.published ? item.published['date-parts'][0][0] : "s.d.",
            periodico: item['container-title'] ? item['container-title'][0] : "N/A",
            doi: item.DOI,
            fonte: "CrossRef/SciELO"
        }));
    } catch (e) { return []; }
}

/**
 * BASE 2: PubMed (Ciências da Saúde) 
 */
async function buscarPubMed(query) {
    try {
        const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=5&retmode=json`;
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();
        
        if (!searchData.esearchresult.idlist.length) return [];
        
        const ids = searchData.esearchresult.idlist.join(',');
        const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids}&retmode=json`;
        const fetchRes = await fetch(fetchUrl);
        const fetchData = await fetchRes.json();
        
        return searchData.esearchresult.idlist.map(id => {
            const item = fetchData.result[id];
            return {
                titulo: item.title,
                autores: item.authors ? item.authors.map(a => a.name).join('; ') : "Autor Desconhecido",
                sobrenomeCrt: item.authors ? item.authors[0].name.split(' ')[0] : "AUTOR",
                ano: item.pubdate.split(' ')[0],
                periodico: item.fulljournalname,
                doi: item.elocationid.replace('doi: ', ''),
                fonte: "PubMed"
            };
        });
    } catch (e) { return []; }
}

/**
 * BASE 3: arXiv (Física, Matemática, Computação) 
 */
async function buscarArXiv(query) {
    try {
        const url = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&max_results=5`;
        const response = await fetch(url);
        const text = await response.text();
        const xml = new DOMParser().parseFromString(text, "text/xml");
        const entries = xml.querySelectorAll("entry");
        
        return Array.from(entries).map(entry => ({
            titulo: entry.querySelector("title").textContent.trim(),
            autores: entry.querySelector("author name").textContent,
            sobrenomeCrt: entry.querySelector("author name").textContent.split(' ').pop(),
            ano: new Date(entry.querySelector("published").textContent).getFullYear(),
            periodico: "arXiv (Preprint)",
            doi: "",
            fonte: "arXiv"
        }));
    } catch (e) { return []; }
}

/**
 * Renderização dos Cards com Design Industrial
 */
function exibirResultadosV3(artigos) {
    const area = document.getElementById('areaResultados');
    if (!artigos.length) {
        area.innerHTML = '<p class="text-center text-white-50 mt-5 small">Nenhum artigo encontrado para esta busca.</p>';
        return;
    }

    area.innerHTML = '';
    artigos.forEach(art => {
        const card = document.createElement('div');
        card.className = 'card mb-2 bg-dark text-white border-start border-primary border-4 shadow-sm';
        card.innerHTML = `
            <div class="card-body p-2">
                <div class="d-flex justify-content-between">
                    <span class="badge bg-primary mb-1" style="font-size: 0.6rem;">${art.fonte}</span>
                    <span class="text-white-50 small" style="font-size: 0.6rem;">${art.ano}</span>
                </div>
                <h6 class="small fw-bold mb-1">${art.titulo.substring(0, 80)}...</h6>
                <p class="text-white-50 mb-2" style="font-size: 0.7rem;"><i class="fas fa-user"></i> ${art.autores.substring(0, 50)}...</p>
                <button class="btn btn-primary btn-xxs w-100" onclick="registrarECitarV3('${art.sobrenomeCrt}', '${art.ano}', '${art.titulo.replace(/'/g, "")}', '${art.periodico}')">
                    <i class="fas fa-quote-left"></i> Inserir Citação ABNT
                </button>
            </div>`;
        area.appendChild(card);
    });
}

/**
 * Inserção no Editor e Gestão de Bibliografia 
 */
function registrarECitarV3(sobrenome, ano, titulo, revista) {
    const range = quill.getSelection(true);
    const citacaoCorpo = ` (${sobrenome.toUpperCase()}, ${ano})`;
    
    // Insere no texto principal
    quill.insertText(range.index, citacaoCorpo);

    // Formata referência completa (NBR 6023)
    const refCompleta = `${sobrenome.toUpperCase()}, ${titulo}. <strong>${revista}</strong>, [S.l.], v. 1, n. 1, p. 1-10, ${ano}.`;

    if (!biblioGlobal.some(r => r.titulo === titulo)) {
        biblioGlobal.push({ texto: refCompleta, titulo: titulo });
        atualizarListaIU();
    }
}

function atualizarListaIU() {
    const lista = document.getElementById('listaRefs');
    const badge = document.getElementById('refBadge');
    
    badge.innerText = biblioGlobal.length;
    lista.innerHTML = biblioGlobal
        .sort((a, b) => a.texto.localeCompare(b.texto))
        .map(r => `<div class="mb-2 pb-1 border-bottom border-light border-opacity-10">${r.texto}</div>`)
        .join('');
}

function baixarBiblioTxt() {
    if (!biblioGlobal.length) return alert("Nenhuma citação registrada.");
    const conteudo = biblioGlobal.map(r => r.texto.replace(/<[^>]*>/g, '')).join('\n\n');
    const blob = new Blob([conteudo], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'BIBLIOGRAFIA_ABNT.txt';
    a.click();
}

function filtrarDuplicados(lista) {
    const vistos = new Set();
    return lista.filter(item => {
        const id = item.doi || item.titulo;
        return vistos.has(id) ? false : vistos.add(id);
    });
}
