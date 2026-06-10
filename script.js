const times = ['Amarelo', 'Rosa', 'Azul', 'Roxo'];
let partidas = [];
let semiFinais = [];
let finais = [];

function gerarPartidas() {
    partidas = [
        { id: 1, timeA: 'Amarelo', timeB: 'Roxo', pontosA: null, pontosB: null, finalizada: false },
        { id: 2, timeA: 'Azul', timeB: 'Rosa', pontosA: null, pontosB: null, finalizada: false },
        { id: 3, timeA: 'Amarelo', timeB: 'Azul', pontosA: null, pontosB: null, finalizada: false },
        { id: 4, timeA: 'Roxo', timeB: 'Rosa', pontosA: null, pontosB: null, finalizada: false },
        { id: 5, timeA: 'Rosa', timeB: 'Amarelo', pontosA: null, pontosB: null, finalizada: false },
        { id: 6, timeA: 'Roxo', timeB: 'Azul', pontosA: null, pontosB: null, finalizada: false }
    ];
}

// GERA O HTML IDÊNTICO AO PAPEL IMPRESSO
function renderizarJogos() {
    const listaJogos = document.getElementById('lista-jogos');
    listaJogos.innerHTML = '';

    partidas.forEach(jogo => {
        let vencedorStr = '-';
        if (jogo.finalizada) {
            vencedorStr = jogo.pontosA > jogo.pontosB ? jogo.timeA : jogo.timeB;
        }

        const divJogo = document.createElement('div');
        divJogo.className = 'jogo-card';
        
        divJogo.innerHTML = `
            <div class="jogo-grid">
                <div class="header-cell">${jogo.timeA}</div>
                <div class="header-cell vazia"></div>
                <div class="header-cell">${jogo.timeB}</div>
                <div class="header-cell vencedor-header">VENCEDOR</div>

                <div class="data-cell">
                    <input type="number" id="placarA-${jogo.id}" placeholder="Pts" ${jogo.finalizada ? 'disabled' : ''} value="${jogo.pontosA !== null ? jogo.pontosA : ''}">
                </div>
                <div class="data-cell x-cell">X</div>
                <div class="data-cell">
                    <input type="number" id="placarB-${jogo.id}" placeholder="Pts" ${jogo.finalizada ? 'disabled' : ''} value="${jogo.pontosB !== null ? jogo.pontosB : ''}">
                </div>
                <div class="data-cell vencedor-cell">${vencedorStr}</div>
            </div>
            ${!jogo.finalizada ? `<button class="btn-salvar" onclick="salvarResultado(${jogo.id})">Salvar Placar</button>` : ''}
        `;
        listaJogos.appendChild(divJogo);
    });
}

function renderizarMataMata() {
    const divMataMata = document.getElementById('mata-mata');
    divMataMata.innerHTML = '<h3 style="margin-bottom: 15px; color: var(--azul-oficial); text-align: center;">SEMIFINAIS</h3>';

    semiFinais.forEach(jogo => {
        let vencedorStr = '-';
        if (jogo.finalizada) {
            vencedorStr = jogo.pontosA > jogo.pontosB ? jogo.timeA : jogo.timeB;
        }

        divMataMata.innerHTML += `
            <div class="jogo-card">
                <div class="jogo-grid">
                    <div class="header-cell">${jogo.timeA}</div>
                    <div class="header-cell vazia"></div>
                    <div class="header-cell">${jogo.timeB}</div>
                    <div class="header-cell vencedor-header">VENCEDOR</div>

                    <div class="data-cell">
                        <input type="number" id="placarA-${jogo.id}" placeholder="Pts" ${jogo.finalizada ? 'disabled' : ''} value="${jogo.pontosA !== null ? jogo.pontosA : ''}">
                    </div>
                    <div class="data-cell x-cell">X</div>
                    <div class="data-cell">
                        <input type="number" id="placarB-${jogo.id}" placeholder="Pts" ${jogo.finalizada ? 'disabled' : ''} value="${jogo.pontosB !== null ? jogo.pontosB : ''}">
                    </div>
                    <div class="data-cell vencedor-cell">${vencedorStr}</div>
                </div>
                ${!jogo.finalizada ? `<button class="btn-salvar" onclick="salvarMataMata('${jogo.id}', 'semi')">Salvar Placar</button>` : ''}
            </div>
        `;
    });

    if (finais.length > 0) {
        divMataMata.innerHTML += '<h3 style="margin-top: 25px; margin-bottom: 15px; color: var(--azul-oficial); text-align: center;">FINAIS</h3>';
        finais.forEach(jogo => {
            let vencedorStr = '-';
            if (jogo.finalizada) {
                vencedorStr = jogo.pontosA > jogo.pontosB ? jogo.timeA : jogo.timeB;
            }
            let tituloJogo = jogo.tipo === '3lugar' ? 'DISPUTA 3º LUGAR' : 'GRANDE FINAL';

            divMataMata.innerHTML += `
                <p style="font-size: 0.9rem; color: var(--azul-oficial); margin-top: 10px; margin-bottom: 5px; text-align:center; font-weight:bold;">${tituloJogo}</p>
                <div class="jogo-card">
                    <div class="jogo-grid">
                        <div class="header-cell">${jogo.timeA}</div>
                        <div class="header-cell vazia"></div>
                        <div class="header-cell">${jogo.timeB}</div>
                        <div class="header-cell vencedor-header">VENCEDOR</div>

                        <div class="data-cell">
                            <input type="number" id="placarA-${jogo.id}" placeholder="Pts" ${jogo.finalizada ? 'disabled' : ''} value="${jogo.pontosA !== null ? jogo.pontosA : ''}">
                        </div>
                        <div class="data-cell x-cell">X</div>
                        <div class="data-cell">
                            <input type="number" id="placarB-${jogo.id}" placeholder="Pts" ${jogo.finalizada ? 'disabled' : ''} value="${jogo.pontosB !== null ? jogo.pontosB : ''}">
                        </div>
                        <div class="data-cell vencedor-cell">${vencedorStr}</div>
                    </div>
                    ${!jogo.finalizada ? `<button class="btn-salvar" onclick="salvarMataMata('${jogo.id}', 'final')">Salvar Placar</button>` : ''}
                </div>
            `;
        });
    }
}

function mudarAba(abaId) {
    document.querySelectorAll('.aba').forEach(aba => aba.classList.remove('ativa'));
    document.querySelectorAll('.menu button').forEach(btn => btn.classList.remove('ativo'));
    document.getElementById(abaId).classList.add('ativa');
    document.getElementById(`btn-${abaId}`).classList.add('ativo');
}

// Função para mostrar os avisos na tela
function mostrarAviso(mensagem, tipo = 'erro') {
    const toast = document.getElementById('toast');
    toast.textContent = mensagem;

    // Ajusta a cor dependendo do tipo de aviso
    toast.className = 'toast';
    if (tipo === 'info') toast.classList.add('info');
    if (tipo === 'sucesso') toast.classList.add('sucesso');

    // Faz aparecer
    toast.classList.add('show');

    // Esconde automaticamente depois de 3 segundos
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function validarPlacar(pontosA, pontosB) {
    const vencedor = Math.max(pontosA, pontosB);
    const perdedor = Math.min(pontosA, pontosB);
    const diferenca = vencedor - perdedor;

    if (vencedor < 15) return { valido: false, erro: "O set precisa ter pelo menos 15 pontos." };
    if (vencedor === 15 && perdedor <= 13) return { valido: true, erro: null };
    if (vencedor > 15) {
        if (diferenca === 2) return { valido: true, erro: null };
        else return { valido: false, erro: "Acima de 14x14, a vitória exige exatos 2 pontos de diferença." };
    }
    return { valido: false, erro: "Placar inválido." };
}

function salvarResultado(idJogo) {
    const pontosA = parseInt(document.getElementById(`placarA-${idJogo}`).value);
    const pontosB = parseInt(document.getElementById(`placarB-${idJogo}`).value);

    if (isNaN(pontosA) || isNaN(pontosB)) return mostrarAviso("Preencha a pontuação dos dois times.");
    if (pontosA === pontosB) return mostrarAviso("No vôlei não existe empate!");

    const validacao = validarPlacar(pontosA, pontosB);
    if (!validacao.valido) return mostrarAviso("No vôlei não existe empate!");

    const jogo = partidas.find(p => p.id === idJogo);
    jogo.pontosA = pontosA;
    jogo.pontosB = pontosB;
    jogo.finalizada = true;

    renderizarJogos();
    atualizarClassificacao();
    verificarFaseGruposConcluida();
    salvarDadosNavegador();
}

function atualizarClassificacao() {
    let tabela = {};
    times.forEach(time => tabela[time] = 0);

    partidas.forEach(jogo => {
        if (jogo.finalizada) {
            if (jogo.pontosA > jogo.pontosB) tabela[jogo.timeA]++;
            else tabela[jogo.timeB]++;
        }
    });

    let ranking = Object.keys(tabela).map(time => {
        return { nome: time, vitorias: tabela[time] };
    });

    ranking.sort((a, b) => {
        if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias;
        const jogoDireto = partidas.find(p => 
            (p.timeA === a.nome && p.timeB === b.nome) || 
            (p.timeA === b.nome && p.timeB === a.nome)
        );
        if (jogoDireto && jogoDireto.finalizada) {
            const vencedorDireto = jogoDireto.pontosA > jogoDireto.pontosB ? jogoDireto.timeA : jogoDireto.timeB;
            if (vencedorDireto === a.nome) return -1;
            if (vencedorDireto === b.nome) return 1;
        }
        return 0;
    });

    const corpoTabela = document.getElementById('corpo-tabela');
    corpoTabela.innerHTML = '';

    ranking.forEach((time, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}º</td>
            <td>${time.nome}</td>
            <td>${time.vitorias}</td>
        `;
        corpoTabela.appendChild(tr);
    });
}

function verificarFaseGruposConcluida() {
    const todosFinalizados = partidas.every(jogo => jogo.finalizada === true);
    if (todosFinalizados && semiFinais.length === 0) {
        mostrarAviso("Fase de grupos concluída! Semifinais liberadas.", "info");
        gerarSemifinais();
    }
}

function gerarSemifinais() {
    let tabela = {};
    times.forEach(time => tabela[time] = 0);
    partidas.forEach(jogo => {
        if (jogo.finalizada) {
            if (jogo.pontosA > jogo.pontosB) tabela[jogo.timeA]++;
            else tabela[jogo.timeB]++;
        }
    });

    let rankingFinal = Object.keys(tabela).map(time => { return { nome: time, vitorias: tabela[time] }; });
    rankingFinal.sort((a, b) => {
        if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias;
        const jogoDireto = partidas.find(p => (p.timeA === a.nome && p.timeB === b.nome) || (p.timeA === b.nome && p.timeB === a.nome));
        if (jogoDireto && jogoDireto.finalizada) {
            const vencedor = jogoDireto.pontosA > jogoDireto.pontosB ? jogoDireto.timeA : jogoDireto.timeB;
            return vencedor === a.nome ? -1 : 1;
        }
        return 0;
    });

    semiFinais = [
        { id: 'semi1', timeA: rankingFinal[0].nome, timeB: rankingFinal[3].nome, pontosA: null, pontosB: null, finalizada: false },
        { id: 'semi2', timeA: rankingFinal[1].nome, timeB: rankingFinal[2].nome, pontosA: null, pontosB: null, finalizada: false }
    ];
    renderizarMataMata();
    salvarDadosNavegador();
}

function salvarMataMata(idJogo, fase) {
    const pontosA = parseInt(document.getElementById(`placarA-${idJogo}`).value);
    const pontosB = parseInt(document.getElementById(`placarB-${idJogo}`).value);

    if (isNaN(pontosA) || isNaN(pontosB)) return mostrarAviso("Preencha a pontuação.");
    if (pontosA === pontosB) return mostrarAviso("Vôlei não tem empate!");

    const validacao = validarPlacar(pontosA, pontosB);
    if (!validacao.valido) return mostrarAviso(validacao.erro);

    let jogo = fase === 'semi' ? semiFinais.find(p => p.id === idJogo) : finais.find(p => p.id === idJogo);
    jogo.pontosA = pontosA;
    jogo.pontosB = pontosB;
    jogo.finalizada = true;

    renderizarMataMata();
    salvarDadosNavegador();

    if (fase === 'semi') verificarSemifinaisConcluidas();
    else verificarTorneioConcluido();
}

function verificarSemifinaisConcluidas() {
    const todasFinalizadas = semiFinais.every(jogo => jogo.finalizada === true);
    if (todasFinalizadas && finais.length === 0) {
        const vencedorSemi1 = semiFinais[0].pontosA > semiFinais[0].pontosB ? semiFinais[0].timeA : semiFinais[0].timeB;
        const perdedorSemi1 = semiFinais[0].pontosA < semiFinais[0].pontosB ? semiFinais[0].timeA : semiFinais[0].timeB;
        const vencedorSemi2 = semiFinais[1].pontosA > semiFinais[1].pontosB ? semiFinais[1].timeA : semiFinais[1].timeB;
        const perdedorSemi2 = semiFinais[1].pontosA < semiFinais[1].pontosB ? semiFinais[1].timeA : semiFinais[1].timeB;

        finais = [
            { id: 'final_3lugar', tipo: '3lugar', timeA: perdedorSemi1, timeB: perdedorSemi2, pontosA: null, pontosB: null, finalizada: false },
            { id: 'final_1lugar', tipo: '1lugar', timeA: vencedorSemi1, timeB: vencedorSemi2, pontosA: null, pontosB: null, finalizada: false }
        ];
        renderizarMataMata();
        salvarDadosNavegador();
    }
}

function verificarTorneioConcluido() {
    const todasFinalizadas = finais.every(jogo => jogo.finalizada === true);
    if (todasFinalizadas) {
        const jogoFinal = finais.find(f => f.tipo === '1lugar');
        const campeao = jogoFinal.pontosA > jogoFinal.pontosB ? jogoFinal.timeA : jogoFinal.timeB;
        setTimeout(() => { mostrarAviso(`🏆 O Time ${campeao} é o CAMPEÃO! 🏆`, "sucesso"); }, 300);
    }
}

function salvarDadosNavegador() {
    localStorage.setItem('torneio_partidas', JSON.stringify(partidas));
    localStorage.setItem('torneio_semifinais', JSON.stringify(semiFinais));
    localStorage.setItem('torneio_finais', JSON.stringify(finais));
}

function iniciarApp() {
    const partidasSalvas = localStorage.getItem('torneio_partidas');
    const semisSalvas = localStorage.getItem('torneio_semifinais');
    const finaisSalvas = localStorage.getItem('torneio_finais');

    if (partidasSalvas) {
        partidas = JSON.parse(partidasSalvas);
        semiFinais = semisSalvas ? JSON.parse(semisSalvas) : [];
        finais = finaisSalvas ? JSON.parse(finaisSalvas) : [];
        
        renderizarJogos();
        atualizarClassificacao();
        if (semiFinais.length > 0) renderizarMataMata();
    } else {
        gerarPartidas();
        renderizarJogos();
    }
}


// FUNÇÃO PARA ZERAR O TORNEIO
function resetarTorneio() {
    // Pop-up nativo de confirmação aqui 
    // por ser um padrão de segurança essencial contra toques acidentais na tela
    const confirmar = confirm("🚨 ATENÇÃO: Isso vai apagar todo o progresso atual. Tem certeza que deseja iniciar um novo torneio?");
    
    if (confirmar) {
        // 1. Limpa os dados salvos no navegador do celular
        localStorage.removeItem('torneio_partidas');
        localStorage.removeItem('torneio_semifinais');
        localStorage.removeItem('torneio_finais');

        // 2. Esvazia as variáveis das finais
        semiFinais = [];
        finais = [];
        
        // 3. Restaura o texto inicial da aba de Finais
        document.getElementById('mata-mata').innerHTML = '<p style="text-align:center; color: var(--azul-oficial); margin-top:20px;">As finais serão liberadas após o término da fase de grupos.</p>';

        // 4. Gera a fase de grupos limpa e atualiza as telas
        gerarPartidas();
        renderizarJogos();
        atualizarClassificacao();
        
        // 5. Força o aplicativo a voltar para a primeira aba
        mudarAba('grupos');
        
        // 6. Mostra o nosso toast notification bonito
        mostrarAviso("Novo torneio iniciado com sucesso!", "sucesso");
    }
}

iniciarApp();