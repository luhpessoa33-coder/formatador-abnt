/**
 * Lógica Master Admin V3.0
 */
const MASTER_KEY = "psa2026-ifpe"; // Altere sua chave master aqui
let usuariosAutorizados = JSON.parse(localStorage.getItem('psa_authorized_users')) || ["admin@ifpe.edu.br"];

function abrirPainelMaster() {
    new bootstrap.Modal(document.getElementById('modalMaster')).show();
}

function autenticarMaster() {
    const key = document.getElementById('masterKey').value;
    if (key === MASTER_KEY) {
        document.getElementById('loginMasterArea').classList.add('d-none');
        document.getElementById('gestaoUsuariosArea').classList.remove('d-none');
        atualizarListaUsuarios();
    } else {
        alert("Chave Master Incorreta!");
    }
}

function cadastrarUsuario() {
    const user = document.getElementById('novoUser').value;
    if (user && !usuariosAutorizados.includes(user)) {
        usuariosAutorizados.push(user);
        localStorage.setItem('psa_authorized_users', JSON.stringify(usuariosAutorizados));
        atualizarListaUsuarios();
        document.getElementById('novoUser').value = "";
    }
}

function atualizarListaUsuarios() {
    const lista = document.getElementById('listaUsers');
    lista.innerHTML = usuariosAutorizados.map(u => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            ${u}
            <button class="btn btn-sm btn-danger" onclick="removerUsuario('${u}')">Remover</button>
        </li>
    `).join('');
}

function removerUsuario(u) {
    usuariosAutorizados = usuariosAutorizados.filter(user => user !== u);
    localStorage.setItem('psa_authorized_users', JSON.stringify(usuariosAutorizados));
    atualizarListaUsuarios();
}
