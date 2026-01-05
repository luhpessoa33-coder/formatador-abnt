const MASTER_USER = "luanapessoa";
const MASTER_PASS = "psa2026-ifpe";

function abrirPainelMaster() {
    new bootstrap.Modal(document.getElementById('modalMaster')).show();
}

function autenticarMaster() {
    const u = document.getElementById('masterUser').value;
    const p = document.getElementById('masterPass').value;

    if (u === MASTER_USER && p === MASTER_PASS) {
        document.getElementById('loginArea').classList.add('d-none');
        document.getElementById('dashArea').classList.remove('d-none');
        renderizarListaColegas();
    } else { alert("Utilizador ou Palavra-passe incorretos!"); }
}

function renderizarListaColegas() {
    const lista = document.getElementById('listaUsuarios');
    const colegas = JSON.parse(localStorage.getItem('colegas_acesso')) || ["coordenacao@ifpe.edu.br"];
    lista.innerHTML = colegas.map(c => `<li class="list-group-item d-flex justify-content-between">${c} <button class="btn btn-xxs btn-danger" onclick="removerColega('${c}')">X</button></li>`).join('');
}
