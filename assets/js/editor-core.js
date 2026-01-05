<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editor Acadêmico ABNT - Ipojuca Project</title>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">

    <style>
        :root {
            --sidebar-width: 300px;
            --a4-width: 210mm;
            --a4-height: 297mm;
        }

        body { background-color: #1a1a1a; overflow: hidden; }

        /* Estilização da Folha A4 */
        #editor-viewport {
            display: flex;
            justify-content: center;
            padding: 40px 0;
            background: #333;
            min-height: 100%;
        }

        #paper-A4 {
            width: var(--a4-width);
            min-height: var(--a4-height);
            padding: 3cm 2cm 2cm 3cm; /* Margens ABNT */
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
            margin-bottom: 50px;
        }

        /* Sidebar e Utilidades */
        .x-small { font-size: 0.75rem; }
        .btn-xxs { padding: 2px 5px; font-size: 0.65rem; }
        
        #main-editor {
            border: none !important;
            font-family: 'Arial', sans-serif;
            font-size: 12pt;
            line-height: 1.5;
            height: auto;
        }

        .ql-editor { padding: 0 !important; overflow: visible !important; }
        .ql-toolbar { 
            position: sticky; top: 0; z-index: 100; 
            background: white !important; border-bottom: 1px solid #ddd !important;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #222; }
        ::-webkit-scrollbar-thumb { background: #444; border-radius: 10px; }
    </style>
</head>
<body>

<div class="d-flex" style="height: calc(100vh - 56px);"> 
    <aside class="bg-dark border-end border-secondary p-3 shadow" style="width: var(--sidebar-width); overflow-y: auto;">
        
        <div class="mb-4 p-2 bg-black bg-opacity-50 rounded border border-warning">
            <h6 class="text-warning small fw-bold"><i class="fas fa-clock"></i> CONTAGEM REGRESSIVA</h6>
            <input type="datetime-local" id="inputPrazo" class="form-control form-control-sm bg-dark text-white border-secondary mb-2">
            <div id="countdownDisplay" class="h4 text-center font-monospace text-warning">00:00:00</div>
        </div>

        <div class="mb-4 p-2 bg-secondary bg-opacity-10 rounded border border-info">
            <h6 class="text-info small fw-bold"><i class="fas fa-tasks"></i> PROGRESSO ABNT</h6>
            <div id="listaProgresso" class="x-small text-white">
                </div>
        </div>

        <div class="mb-4">
            <h6 class="text-white small fw-bold text-uppercase border-bottom border-secondary pb-1">Sumário Prévio</h6>
            <div id="sumarioPreview" class="x-small text-white-50" style="max-height: 200px; overflow-y: auto;">
                Aguardando títulos (h1, h2)...
            </div>
            <button class="btn btn-xxs btn-outline-info w-100 mt-2" onclick="inserirSumarioNoTexto()">Inserir Sumário no Texto</button>
        </div>

        <div class="mb-4">
            <h6 class="text-white small fw-bold text-uppercase border-bottom border-secondary pb-1">Figuras e Tabelas</h6>
            <div id="listaIlustracoes" class="x-small text-white-50">
                Nenhuma detectada.
            </div>
        </div>
    </aside>

    <main class="flex-grow-1 bg-secondary bg-opacity-25 p-4 overflow-auto">
        <div id="editor-viewport">
            <div id="paper-A4" class="shadow-lg">
                <div id="main-editor">
                    <h1>Título do Capítulo</h1>
                    <p>Comece a escrever sua dissertação sobre a Bacia do Rio Ipojuca aqui...</p>
                    <img src="https://via.placeholder.com/400x200" alt="Exemplo">
                    <p class="text-center x-small">Figura 1: Mapa de Localização</p>
                </div>
            </div>
        </div>
    </main>
</div>

<script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
<script>
    // 1. Inicializar Editor
    var quill = new Quill('#main-editor', {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline'],
                ['image', 'link'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['clean']
            ]
        }
    });

    // 2. Lógica do Cronômetro
    let timerInterval;
    document.getElementById('inputPrazo').addEventListener('change', function() {
        clearInterval(timerInterval);
        const deadline = new Date(this.value).getTime();
        
        timerInterval = setInterval(() => {
            const now = new Date().getTime();
            const diff = deadline - now;

            if (diff < 0) {
                clearInterval(timerInterval);
                document.getElementById('countdownDisplay').innerText = "PRAZO ENCERRADO";
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            document.getElementById('countdownDisplay').innerText = 
                `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }, 1000);
    });

    // 3. Checklist ABNT
    const itensABNT = [
        "Capa e Folha de Rosto", "Resumo/Abstract", "Sumário Automático", 
        "Introdução", "Metodologia (AHP/SIG)", "Resultados", "Referências"
    ];
    
    const listaProgresso = document.getElementById('listaProgresso');
    itensABNT.forEach(item => {
        const div = document.createElement('div');
        div.className = "form-check mb-1";
        div.innerHTML = `<input class="form-check-input" type="checkbox"> <label class="form-check-label">${item}</label>`;
        listaProgresso.appendChild(div);
    });

    // 4. Sumário Dinâmico e Ilustrações
    quill.on('text-change', function() {
        const html = quill.root.innerHTML;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // Atualizar Sumário
        const headers = tempDiv.querySelectorAll('h1, h2');
        let sumarioHtml = "";
        headers.forEach(h => {
            const nivel = h.tagName === 'H1' ? '' : '&nbsp;&nbsp;&nbsp;';
            sumarioHtml += `<div>${nivel}• ${h.innerText}</div>`;
        });
        document.getElementById('sumarioPreview').innerHTML = sumarioHtml || "Aguardando títulos...";

        // Detectar Figuras (Simulado por busca de texto "Figura X:")
        const tagsFiguras = tempDiv.innerText.match(/Figura \d+: .+/g);
        document.getElementById('listaIlustracoes').innerHTML = tagsFiguras ? 
            tagsFiguras.map(f => `<div><i class="fas fa-image me-1"></i>${f}</div>`).join('') : 
            "Nenhuma detectada.";
    });

    function inserirSumarioNoTexto() {
        const conteudoSumario = document.getElementById('sumarioPreview').innerText;
        const range = quill.getSelection() || { index: 0 };
        quill.insertText(range.index, "\n--- SUMÁRIO ---\n" + conteudoSumario + "\n---\n");
    }
</script>

</body>
</html>
