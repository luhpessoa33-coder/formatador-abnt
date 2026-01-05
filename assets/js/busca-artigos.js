// Busca de Artigos Científicos com APIs Públicas
// Integração: CrossRef, PubMed, arXiv, Semantic Scholar

let citacaoAtual = null;

// ========== BUSCA POR DOI ==========
async function buscarPorDOI() {
    const doi = document.getElementById('inputDOI').value.trim();
    
    if (!doi) {
        mostrarAlerta('Por favor, digite um DOI válido.', 'warning');
        return;
    }
    
    mostrarLoading(true);
    
    try {
        // Buscar no CrossRef (API pública e gratuita)
        const url = `https://api.crossref.org/works/${doi}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('DOI não encontrado');
        }
        
        const data = await response.json();
        const artigo = data.message;
        
        // Processar e exibir resultado
        exibirResultadoUnico(artigo, 'crossref');
        
    } catch (error) {
        console.error('Erro na busca:', error);
        mostrarAlerta('DOI não encontrado. Verifique se digitou corretamente.', 'danger');
    } finally {
        mostrarLoading(false);
    }
}

// ========== BUSCA POR TÍTULO ==========
async function buscarPorTitulo() {
    const titulo = document.getElementById('inputTitulo').value.trim();
    const base = document.getElementById('selectBaseTitulo').value;
    const ano = document.getElementById('inputAnoTitulo').value;
    
    if (!titulo) {
        mostrarAlerta('Por favor, digite um título.', 'warning');
        return;
    }
    
    mostrarLoading(true);
    
    try {
        let resultados = [];
        
        if (base === 'all' || base === 'crossref') {
            resultados = resultados.concat(await buscarCrossRef(titulo, ano));
        }
        
        if (base === 'all' || base === 'pubmed') {
            resultados = resultados.concat(await buscarPubMed(titulo, ano));
        }
        
        if (base === 'all' || base === 'arxiv') {
            resultados = resultados.concat(await buscarArXiv(titulo, ano));
        }
        
        if (base === 'all' || base === 'semanticscholar') {
            resultados = resultados.concat(await buscarSemanticScholar(titulo, ano));
        }
        
        exibirResultados(resultados);
        
    } catch (error) {
        console.error('Erro na busca:', error);
        mostrarAlerta('Erro ao buscar artigos. Tente novamente.', 'danger');
    } finally {
        mostrarLoading(false);
    }
}

// ========== BUSCA POR AUTOR ==========
async function buscarPorAutor() {
    const autor = document.getElementById('inputAutor').value.trim();
    const keywords = document.getElementById('inputKeywordsAutor').value.trim();
    const anoInicial = document.getElementById('inputAnoInicialAutor').value;
    const anoFinal = document.getElementById('inputAnoFinalAutor').value;
    
    if (!autor) {
        mostrarAlerta('Por favor, digite o nome do autor.', 'warning');
        return;
    }
    
    mostrarLoading(true);
    
    try {
        const query = keywords ? `${autor} ${keywords}` : autor;
        const resultados = await buscarCrossRef(query, null, anoInicial, anoFinal);
        
        exibirResultados(resultados);
        
    } catch (error) {
        console.error('Erro na busca:', error);
        mostrarAlerta('Erro ao buscar artigos do autor.', 'danger');
    } finally {
        mostrarLoading(false);
    }
}

// ========== BUSCA AVANÇADA ==========
async function buscarAvancado() {
    const titulo = document.getElementById('inputTituloAvancado').value.trim();
    const autor = document.getElementById('inputAutorAvancado').value.trim();
    const periodico = document.getElementById('inputPeriodicoAvancado').value.trim();
    const ano = document.getElementById('inputAnoAvancado').value;
    const volume = document.getElementById('inputVolumeAvancado').value.trim();
    const keywords = document.getElementById('inputKeywordsAvancado').value.trim();
    const base = document.getElementById('selectBaseAvancado').value;
    const tipo = document.getElementById('selectTipoAvancado').value;
    
    if (!titulo && !autor && !keywords) {
        mostrarAlerta('Preencha pelo menos um campo de busca.', 'warning');
        return;
    }
    
    mostrarLoading(true);
    
    try {
        let query = '';
        if (titulo) query += titulo + ' ';
        if (autor) query += autor + ' ';
        if (keywords) query += keywords;
        
        let resultados = [];
        
        switch(base) {
            case 'crossref':
                resultados = await buscarCrossRef(query, ano, null, null, tipo);
                break;
            case 'pubmed':
                resultados = await buscarPubMed(query, ano);
                break;
            case 'arxiv':
                resultados = await buscarArXiv(query, ano);
                break;
            case 'semanticscholar':
                resultados = await buscarSemanticScholar(query, ano);
                break;
        }
        
        exibirResultados(resultados);
        
    } catch (error) {
        console.error('Erro na busca avançada:', error);
        mostrarAlerta('Erro na busca avançada.', 'danger');
    } finally {
        mostrarLoading(false);
    }
}

// ========== APIS DE BUSCA ==========

async function buscarCrossRef(query, ano, anoInicial, anoFinal, tipo) {
    let url = `https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=10`;
    
    if (ano) {
        url += `&filter=from-pub-date:${ano},until-pub-date:${ano}`;
    } else if (anoInicial && anoFinal) {
        url += `&filter=from-pub-date:${anoInicial},until-pub-date:${anoFinal}`;
    }
    
    if (tipo && tipo !== 'all') {
        url += `&filter=type:${tipo}`;
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    return data.message.items.map(item => ({
        titulo: item.title ? item.title[0] : 'Sem título',
        autores: item.author ? item.author.map(a => `${a.family}, ${a.given || ''}`).join('; ') : 'Sem autor',
        ano: item.published ? item.published['date-parts'][0][0] : 'S/D',
        periodico: item['container-title'] ? item['container-title'][0] : '',
        volume: item.volume || '',
        numero: item.issue || '',
        paginas: item.page || '',
        doi: item.DOI || '',
        tipo: item.type || 'journal-article',
        fonte: 'CrossRef',
        dados: item
    }));
}

async function buscarPubMed(query, ano) {
    // PubMed E-utilities API (gratuita)
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}${ano ? `+AND+${ano}[pdat]` : ''}&retmax=10&retmode=json`;
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    
    if (!searchData.esearchresult || !searchData.esearchresult.idlist || searchData.esearchresult.idlist.length === 0) {
        return [];
    }
    
    const ids = searchData.esearchresult.idlist.join(',');
    const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids}&retmode=json`;
    
    const fetchResponse = await fetch(fetchUrl);
    const fetchData = await fetchResponse.json();
    
    const resultados = [];
    
    for (const id of searchData.esearchresult.idlist) {
        const item = fetchData.result[id];
        if (item) {
            resultados.push({
                titulo: item.title || 'Sem título',
                autores: item.authors ? item.authors.map(a => a.name).join('; ') : 'Sem autor',
                ano: item.pubdate ? item.pubdate.split(' ')[0] : 'S/D',
                periodico: item.fulljournalname || item.source || '',
                volume: item.volume || '',
                numero: item.issue || '',
                paginas: item.pages || '',
                doi: item.elocationid && item.elocationid.includes('doi:') ? item.elocationid.replace('doi: ', '') : '',
                tipo: 'journal-article',
                fonte: 'PubMed',
                pmid: id,
                dados: item
            });
        }
    }
    
    return resultados;
}

async function buscarArXiv(query, ano) {
    // arXiv API (gratuita)
    const url = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=0&max_results=10`;
    
    const response = await fetch(url);
    const text = await response.text();
    
    // Parse XML
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');
    const entries = xml.querySelectorAll('entry');
    
    const resultados = [];
    
    entries.forEach(entry => {
        const titulo = entry.querySelector('title')?.textContent.trim();
        const autores = Array.from(entry.querySelectorAll('author name')).map(a => a.textContent).join('; ');
        const published = entry.querySelector('published')?.textContent;
        const anoPubl = published ? new Date(published).getFullYear() : 'S/D';
        const id = entry.querySelector('id')?.textContent;
        const arxivId = id ? id.split('/').pop() : '';
        
        if (ano && anoPubl !== ano) return;
        
        resultados.push({
            titulo: titulo || 'Sem título',
            autores: autores || 'Sem autor',
            ano: anoPubl,
            periodico: 'arXiv',
            volume: '',
            numero: arxivId,
            paginas: '',
            doi: '',
            tipo: 'preprint',
            fonte: 'arXiv',
            arxivId: arxivId,
            dados: entry
        });
    });
    
    return resultados;
}

async function buscarSemanticScholar(query, ano) {
    // Semantic Scholar API (gratuita, sem necessidade de chave)
    const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=10${ano ? `&year=${ano}` : ''}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (!data.data || data.data.length === 0) {
            return [];
        }
        
        return data.data.map(item => ({
            titulo: item.title || 'Sem título',
            autores: item.authors ? item.authors.map(a => a.name).join('; ') : 'Sem autor',
            ano: item.year || 'S/D',
            periodico: item.venue || '',
            volume: '',
            numero: '',
            paginas: '',
            doi: item.externalIds?.DOI || '',
            tipo: 'journal-article',
            fonte: 'Semantic Scholar',
            paperId: item.paperId,
            dados: item
        }));
    } catch (error) {
        console.error('Erro Semantic Scholar:', error);
        return [];
    }
}

// ========== EXIBIÇÃO DE RESULTADOS ==========

function exibirResultadoUnico(artigo, fonte) {
    const resultado = processarArtigo(artigo, fonte);
    exibirResultados([resultado]);
}

function processarArtigo(artigo, fonte) {
    if (fonte === 'crossref') {
        return {
            titulo: artigo.title ? artigo.title[0] : 'Sem título',
            autores: artigo.author ? artigo.author.map(a => `${a.family}, ${a.given || ''}`).join('; ') : 'Sem autor',
            ano: artigo.published ? artigo.published['date-parts'][0][0] : 'S/D',
            periodico: artigo['container-title'] ? artigo['container-title'][0] : '',
            volume: artigo.volume || '',
            numero: artigo.issue || '',
            paginas: artigo.page || '',
            doi: artigo.DOI || '',
            tipo: artigo.type || 'journal-article',
            fonte: 'CrossRef',
            dados: artigo
        };
    }
    
    return artigo;
}

function exibirResultados(resultados) {
    const container = document.getElementById('resultadosBusca');
    const lista = document.getElementById('listaResultados');
    
    if (resultados.length === 0) {
        lista.innerHTML = '<div class="alert alert-warning"><i class="fas fa-exclamation-triangle"></i> Nenhum resultado encontrado. Tente outros termos de busca.</div>';
        container.classList.remove('d-none');
        return;
    }
    
    lista.innerHTML = '';
    
    resultados.forEach((artigo, index) => {
        const card = criarCardArtigo(artigo, index);
        lista.appendChild(card);
    });
    
    container.classList.remove('d-none');
    
    // Scroll suave até resultados
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function criarCardArtigo(artigo, index) {
    const div = document.createElement('div');
    div.className = 'card mb-3 shadow-sm';
    
    const tipoIcon = getTipoIcon(artigo.tipo);
    const fonteColor = getFonteColor(artigo.fonte);
    
    div.innerHTML = `
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <h6 class="card-title mb-0">
                    ${tipoIcon} ${artigo.titulo}
                </h6>
                <span class="badge ${fonteColor}">${artigo.fonte}</span>
            </div>
            
            <p class="card-text small text-muted mb-2">
                <i class="fas fa-user"></i> ${artigo.autores}<br>
                ${artigo.periodico ? `<i class="fas fa-book"></i> ${artigo.periodico}` : ''}
                ${artigo.volume ? `, v. ${artigo.volume}` : ''}
                ${artigo.numero ? `, n. ${artigo.numero}` : ''}
                ${artigo.paginas ? `, p. ${artigo.paginas}` : ''}
                ${artigo.ano ? `, ${artigo.ano}` : ''}
            </p>
            
            ${artigo.doi ? `<p class="small mb-2"><strong>DOI:</strong> <code>${artigo.doi}</code></p>` : ''}
            
            <div class="btn-group btn-group-sm" role="group">
                <button class="btn btn-primary" onclick='gerarCitacaoABNT(${JSON.stringify(artigo).replace(/'/g, "&#39;")})'>
                    <i class="fas fa-quote-left"></i> Gerar Citação ABNT
                </button>
                ${artigo.doi ? `<a href="https://doi.org/${artigo.doi}" target="_blank" class="btn btn-outline-secondary"><i class="fas fa-external-link-alt"></i> Abrir</a>` : ''}
                <button class="btn btn-outline-success" onclick='adicionarReferencias(${JSON.stringify(artigo).replace(/'/g, "&#39;")})'>
                    <i class="fas fa-plus"></i> Adicionar às Referências
                </button>
            </div>
        </div>
    `;
    
    return div;
}

function getTipoIcon(tipo) {
    const icons = {
        'journal-article': '<i class="fas fa-file-alt text-primary"></i>',
        'proceedings-article': '<i class="fas fa-users text-success"></i>',
        'book': '<i class="fas fa-book text-danger"></i>',
        'book-chapter': '<i class="fas fa-book-open text-warning"></i>',
        'preprint': '<i class="fas fa-file-code text-info"></i>'
    };
    
    return icons[tipo] || '<i class="fas fa-file text-secondary"></i>';
}

function getFonteColor(fonte) {
    const colors = {
        'CrossRef': 'bg-primary',
        'PubMed': 'bg-success',
        'arXiv': 'bg-warning',
        'Semantic Scholar': 'bg-info'
    };
    
    return colors[fonte] || 'bg-secondary';
}

// ========== GERAÇÃO DE CITAÇÃO ABNT ==========

function gerarCitacaoABNT(artigo) {
    let citacao = '';
    
    // Formatar autores
    const autores = artigo.autores.toUpperCase();
    
    // Título
    const titulo = artigo.titulo;
    
    // Periódico
    const periodico = artigo.periodico;
    
    // Volume, número, páginas
    let detalhes = '';
    if (artigo.volume) detalhes += `v. ${artigo.volume}`;
    if (artigo.numero) detalhes += `, n. ${artigo.numero}`;
    if (artigo.paginas) detalhes += `, p. ${artigo.paginas}`;
    
    // Ano
    const ano = artigo.ano;
    
    // DOI
    const doi = artigo.doi ? ` DOI: ${artigo.doi}.` : '';
    
    // Montar citação ABNT
    if (artigo.tipo === 'journal-article' || artigo.tipo === 'proceedings-article') {
        citacao = `${autores}. ${titulo}. <strong>${periodico}</strong>, ${detalhes}, ${ano}.${doi}`;
    } else if (artigo.tipo === 'book') {
        citacao = `${autores}. <strong>${titulo}</strong>. ${ano}.${doi}`;
    } else if (artigo.tipo === 'preprint') {
        citacao = `${autores}. ${titulo}. <strong>${periodico}</strong>, ${artigo.numero}, ${ano}. Disponível em: https://arxiv.org/abs/${artigo.arxivId}.`;
    } else {
        citacao = `${autores}. ${titulo}. ${periodico}, ${detalhes}, ${ano}.${doi}`;
    }
    
    citacaoAtual = {
        citacao: citacao,
        artigo: artigo
    };
    
    // Exibir no modal
    document.getElementById('citacaoGerada').innerHTML = `
        <div class="alert alert-success">
            <h6><i class="fas fa-check-circle"></i> Citação ABNT Gerada:</h6>
            <p class="mb-0">${citacao}</p>
        </div>
        <div class="mt-3">
            <label class="form-label">Formato para copiar:</label>
            <textarea class="form-control" id="citacaoTexto" rows="3" readonly>${citacao.replace(/<[^>]*>/g, '')}</textarea>
        </div>
    `;
    
    // Abrir modal
    const modal = new bootstrap.Modal(document.getElementById('modalCitacao'));
    modal.show();
}

function copiarCitacao() {
    const textarea = document.getElementById('citacaoTexto');
    textarea.select();
    document.execCommand('copy');
    
    mostrarNotificacao('Citação copiada para área de transferência!', 'success');
}

function inserirCitacaoNoEditor() {
    if (!citacaoAtual || !quill) {
        mostrarAlerta('Editor não disponível.', 'warning');
        return;
    }
    
    const citacaoTexto = citacaoAtual.citacao.replace(/<[^>]*>/g, '');
    const length = quill.getLength();
    quill.insertText(length, '\n\n' + citacaoTexto + '\n\n');
    
    // Fechar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalCitacao'));
    modal.hide();
    
    // Scroll para o editor
    document.getElementById('editor').scrollIntoView({ behavior: 'smooth' });
    
    mostrarNotificacao('Citação inserida no editor!', 'success');
}

function adicionarReferencias(artigo) {
    const citacaoTexto = gerarCitacaoTexto(artigo);
    
    // Adicionar à lista de referências (localStorage)
    let referencias = JSON.parse(localStorage.getItem('referencias-abnt') || '[]');
    referencias.push({
        citacao: citacaoTexto,
        artigo: artigo,
        data: new Date().toISOString()
    });
    localStorage.setItem('referencias-abnt', JSON.stringify(referencias));
    
    mostrarNotificacao('Artigo adicionado às referências!', 'success');
}

function gerarCitacaoTexto(artigo) {
    const autores = artigo.autores.toUpperCase();
    const titulo = artigo.titulo;
    const periodico = artigo.periodico;
    
    let detalhes = '';
    if (artigo.volume) detalhes += `v. ${artigo.volume}`;
    if (artigo.numero) detalhes += `, n. ${artigo.numero}`;
    if (artigo.paginas) detalhes += `, p. ${artigo.paginas}`;
    
    const ano = artigo.ano;
    const doi = artigo.doi ? ` DOI: ${artigo.doi}.` : '';
    
    return `${autores}. ${titulo}. ${periodico}, ${detalhes}, ${ano}.${doi}`;
}

// ========== FUNÇÕES AUXILIARES ==========

function mostrarLoading(show) {
    const loading = document.getElementById('loadingBusca');
    if (show) {
        loading.classList.remove('d-none');
    } else {
        loading.classList.add('d-none');
    }
}

function mostrarAlerta(mensagem, tipo) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${mensagem}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('#busca .container');
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => alertDiv.remove(), 5000);
}

function mostrarNotificacao(mensagem, tipo) {
    const colors = {
        success: '#28a745',
        info: '#17a2b8',
        warning: '#ffc107',
        danger: '#dc3545'
    };
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${colors[tipo]};
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.innerHTML = `<i class="fas fa-check-circle"></i> ${mensagem}`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Adicionar CSS para animações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

console.log('Busca de artigos científicos carregada! 🔍');
