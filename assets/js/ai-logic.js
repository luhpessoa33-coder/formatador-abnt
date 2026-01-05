function iaAnalisarMetodologia() {
    const texto = editor.getText().toLowerCase();
    const consoleIA = document.getElementById('iaConsole');
    consoleIA.innerHTML = "> Iniciando Varredura Metodológica...<br>";

    const criterios = [
        { nome: "Declividade", key: "declividade" },
        { nome: "Solo/Erodibilidade", key: "erodibilidade" },
        { nome: "Cobertura Vegetal", key: "vegetal" },
        { nome: "Nascentes", key: "nascente" },
        { nome: "AHP", key: "ahp" }
    ];

    setTimeout(() => {
        criterios.forEach(c => {
            const encontrado = texto.includes(c.key);
            const status = encontrado ? "<span class='text-primary'>[OK]</span>" : "<span class='text-danger'>[AUSENTE]</span>";
            consoleIA.innerHTML += `> Verificando critério: ${c.nome}... ${status}<br>`;
        });
        consoleIA.innerHTML += "> Análise Concluída. Sugestão: Reforce a descrição da Erodibilidade no capítulo 3.";
    }, 1500);
}
