// Configuração do app Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAXQI_c9ZQ2kck1HYC70STM1bTWpFYeeVU",
    authDomain: "tabela-bola-fora.firebaseapp.com",
    databaseURL: "https://tabela-bola-fora-default-rtdb.firebaseio.com/",
    projectId: "tabela-bola-fora",
    storageBucket: "tabela-bola-fora.firebasestorage.app",
    messagingSenderId: "917821142911",
    appId: "1:917821142911:web:267ba5ed629f8b885e0c4a"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// VARIÁVEIS GLOBAIS DO TORNEIO
const times = ['Amarelo', 'Rosa', 'Azul', 'Roxo'];
let partidas = [];
let semiFinais = [];
let finais = [];

// FUNÇÕES DE INTERAÇÃO COM O BANCO DE DADOS

function gerarPartidasIniciais() {
    const partidasIniciais = [
        { id: 1, timeA: 'Amarelo', timeB: 'Roxo', pontosA: null, pontosB: null, finalizada: false },
        { id: 2, timeA: 'Azul', timeB: 'Rosa', pontosA: null, pontosB: null, finalizada: false },
        { id: 3, timeA: 'Amarelo', timeB: 'Azul', pontosA: null, pontosB: null, finalizada: false },
        { id: 4, timeA: 'Roxo', timeB: 'Rosa', pontosA: null, pontosB: null, finalizada: false },
        { id: 5, timeA: 'Rosa', timeB: 'Amarelo', pontosA: null, pontosB: null, finalizada: false },
        { id: 6, timeA: 'Roxo', timeB: 'Azul', pontosA: null, pontosB: null, finalizada: false }
    ];

    // Salva a estrutura inicial limpa na nuvem
    database.ref('torneio').set({
        partidas: partidasIniciais,
        semiFinais: [],
        finais: []
    });
}

// ESCUTADOR EM TEMPO REAL: Monitora qualquer mudança na nuvem
function escutarBancoDeDados() {
    database.ref('torneio').on('value', (snapshot) => {
        const dados = snapshot.val();
        
        if (dados) {
            partidas = dados.partidas || [];
            semiFinais = dados.semiFinais || [];
            finais = dados.finais || [];
            
            // Redesenha as telas automaticamente para todo mundo com os dados novos
            renderizarJogos();
            atualizarClassificacao();
            renderizarMataMata();
        } else {
            // Se o banco estiver totalmente vazio (primeiro acesso ou pós-reset), inicializa
            gerarPartidasIniciais();
        }
    });
}

// LÓGICA DE RENDERIZAÇÃO DA INTERFACE

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
    
    if (semiFinais.length === 0) {
        divMataMata.innerHTML = '<p style="text-align:center; color: var(--azul-oficial); margin-top:20px;">As finais serão liberadas após o término da fase de grupos.</p>';
        return;
    }

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


// SALVAMENTO E REGRAS DE NEGÓCIO (ENVIANDO PARA A NUVEM)

function salvarResultado(idJogo) {
    const pontosA = parseInt(document.getElementById(`placarA-${idJogo}`).value);
    const pontosB = parseInt(document.getElementById(`placarB-${idJogo}`).value);

    if (isNaN(pontosA) || isNaN(pontosB)) return mostrarAviso("Preencha a pontuação dos dois times.");
    if (pontosA === pontosB) return mostrarAviso("No vôlei não existe empate!");

    const validacao = validarPlacar(pontosA, pontosB);
    if (!validacao.valido) return mostrarAviso(validacao.erro);

    const jogo = partidas.find(p => p.id === idJogo);
    jogo.pontosA = pontosA;
    jogo.pontosB = pontosB;
    jogo.finalizada = true;

    // Se todos os jogos terminaram, calcula as semifinais antes de subir
    const todosFinalizados = partidas.every(j => j.finalizada === true);
    if (todosFinalizados && semiFinais.length === 0) {
        gerarSemifinais();
        mostrarAviso("Fase de grupos concluída! Semifinais liberadas.", "info");
    }

    // Envia o estado atualizado do torneio para a nuvem
    database.ref('torneio').update({
        partidas: partidas,
        semiFinais: semiFinais
    });
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

    if (fase === 'semi') {
        const todasSemiFinalizadas = semiFinais.every(j => j.finalizada === true);
        if (todasSemiFinalizadas && finais.length === 0) {
            gerarFinais();
        }
    }

    // Sobe as atualizações do mata-mata para a nuvem
    database.ref('torneio').update({
        semiFinais: semiFinais,
        finais: finais
    });

    if (fase === 'final') {
        verificarTorneioConcluido();
    }
}

// CRITÉRIOS DE DESEMPATE E CHAVEAMENTOS

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
}

function gerarFinais() {
    const vencedorSemi1 = semiFinais[0].pontosA > semiFinais[0].pontosB ? semiFinais[0].timeA : semiFinais[0].timeB;
    const perdedorSemi1 = semiFinais[0].pontosA < semiFinais[0].pontosB ? semiFinais[0].timeA : semiFinais[0].timeB;
    const vencedorSemi2 = semiFinais[1].pontosA > semiFinais[1].pontosB ? semiFinais[1].timeA : semiFinais[1].timeB;
    const perdedorSemi2 = semiFinais[1].pontosA < semiFinais[1].pontosB ? semiFinais[1].timeA : semiFinais[1].timeB;

    finais = [
        { id: 'final_3lugar', tipo: '3lugar', timeA: perdedorSemi1, timeB: perdedorSemi2, pontosA: null, pontosB: null, finalizada: false },
        { id: 'final_1lugar', tipo: '1lugar', timeA: vencedorSemi1, timeB: vencedorSemi2, pontosA: null, pontosB: null, finalizada: false }
    ];
}

function verificarTorneioConcluido() {
    const todasFinalizadas = finais.every(jogo => jogo.finalizada === true);
    if (todasFinalizadas) {
        const jogoFinal = finais.find(f => f.tipo === '1lugar');
        const campeao = jogoFinal.pontosA > jogoFinal.pontosB ? jogoFinal.timeA : jogoFinal.timeB;
        setTimeout(() => { mostrarAviso(`🏆 O Time ${campeao} é o CAMPEÃO! 🏆`, "sucesso"); }, 300);
    }
}

// FUNÇÕES UTILITÁRIAS

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

function mudarAba(abaId) {
    document.querySelectorAll('.aba').forEach(aba => aba.classList.remove('ativa'));
    document.querySelectorAll('.menu button').forEach(btn => btn.classList.remove('ativo'));
    document.getElementById(abaId).classList.add('ativa');
    document.getElementById(`btn-${abaId}`).classList.add('ativo');
}

function mostrarAviso(mensagem, tipo = 'erro') {
    const toast = document.getElementById('toast');
    toast.textContent = mensaje = mensagem;

    toast.className = 'toast';
    if (tipo === 'info') toast.classList.add('info');
    if (tipo === 'sucesso') toast.classList.add('sucesso');

    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

function resetarTorneio() {
    const confirmar = confirm("🚨 ATENÇÃO: Isso vai apagar o torneio na nuvem para TODO MUNDO. Deseja continuar?");
    if (confirmar) {
        // Remove o nó principal do Firebase. O escutador vai detectar e rodar o gerarPartidasIniciais()
        database.ref('torneio').remove();
        mudarAba('grupos');
        mostrarAviso("Novo torneio iniciado!", "sucesso");
    }
}

// Inicialização do App conectando ao Firebase
escutarBancoDeDados();