// Simulação de Banco de Dados de Usuários
const USUARIOS_PADRAO = [
    { nome: "Administrador", chave: "MASTER2026", nivel: "total" },
    { nome: "Estudante IFPE", chave: "IPOJUCAPS1", nivel: "editor" }
];

function abrirAdmin() {
    const modal = new bootstrap.Modal(document.getElementById('modalAdmin'));
    const area = document.getElementById('adminData');
    
    // Lista usuários autorizados
    area.innerHTML = `
        <div class="col-12 mb-3">
            <h6>Usuários com Acesso à Estação</h6>
            <ul class="list-group">
                ${USUARIOS_PADRAO.map(u => `
                    <li class="list-group-item bg-dark text-white border-secondary d-flex justify-content-between">
                        ${u.nome} <span class="badge bg-primary">${u.nivel}</span>
                    </li>
                `).join('')}
            </ul>
        </div>
        <div class="col-12">
            <button class="btn btn-outline-danger btn-sm" onclick="limparCacheGlobal()">Limpar Todos os Rascunhos</button>
        </div>
    `;
    modal.show();
}

function limparCacheGlobal() {
    if(confirm("Isso apagará todos os dados salvos no navegador. Continuar?")) {
        localStorage.clear();
        location.reload();
    }
}
