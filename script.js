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
let elenco = [];

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
            elenco = dados.elenco || []; // <-- Lê o elenco da nuvem
            
            renderizarJogos();
            atualizarClassificacao();
            renderizarMataMata();
            renderizarElenco(); // <-- Renderiza a tela nova
        } else {
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



// GESTÃO DE ELENCO E TIMES

let idEmEdicao = null;

function adicionarJogador() {
    const nomeInput = document.getElementById('novo-nome');
    const tipoInput = document.getElementById('novo-tipo');
    const nomeCadastrar = nomeInput.value.trim();
    
    if (nomeCadastrar === '') return mostrarAviso("Digite o nome do jogador.");

    // Checa se já existe um jogador com esse nome (ignorando maiúsculas/minúsculas)
    const jogadorExistente = elenco.find(j => j.nome.toLowerCase() === nomeCadastrar.toLowerCase());

    if (idEmEdicao !== null) {
        // MODO EDIÇÃO
        if (jogadorExistente && jogadorExistente.id !== idEmEdicao) {
            return mostrarAviso("Este nome já está cadastrado em outro jogador!");
        }
        
        const jogador = elenco.find(j => j.id === idEmEdicao);
        if (jogador) {
            jogador.nome = nomeCadastrar;
            jogador.tipo = tipoInput.value;
        }
        
        // Finaliza a edição e volta o botão ao normal
        idEmEdicao = null;
        const btnSalvar = document.querySelector('.card-cadastro .btn-salvar');
        btnSalvar.textContent = "Salvar no Sistema";
        btnSalvar.style.backgroundColor = ""; // Reseta cor
        btnSalvar.style.color = "";
        
        mostrarAviso("Cadastro atualizado com sucesso!", "sucesso");

    } else {
        // MODO CADASTRO NOVO
        if (jogadorExistente) {
            return mostrarAviso("Este nome já está cadastrado! Use um sobrenome ou apelido para diferenciar.");
        }

        const novoJogador = {
            id: Date.now().toString(),
            nome: nomeCadastrar,
            tipo: tipoInput.value,
            presente: false,
            time: 'Sem Time'
        };
        elenco.push(novoJogador);
        mostrarAviso("Jogador cadastrado com sucesso!", "sucesso");
    }

    nomeInput.value = ''; // Limpa o campo
    salvarElencoNuvem();
}

function editarJogador(id) {
    const jogador = elenco.find(j => j.id === id);
    if (jogador) {
        // Preenche os campos com os dados do jogador
        document.getElementById('novo-nome').value = jogador.nome;
        document.getElementById('novo-tipo').value = jogador.tipo;
        
        // Define que estamos em modo de edição
        idEmEdicao = id;
        
        // Altera o visual do botão para chamar a atenção
        const btnSalvar = document.querySelector('.card-cadastro .btn-salvar');
        btnSalvar.textContent = "Salvar Edição";
        btnSalvar.style.backgroundColor = "#ffc107"; // Amarelo
        btnSalvar.style.color = "#000";
        
        // Rola a tela suavemente para o topo onde estão os campos
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function identificarJogadorPorNome(nome) {
    return elenco.find(j => j.nome.toLowerCase() === nome.toLowerCase());
}

function escalarJogador() {
    const inputJogador = document.getElementById('busca-jogador-input');
    const nomeJogador = inputJogador.value.trim();
    const timeEscolhido = document.getElementById('escolha-time').value;

    if (!nomeJogador) return mostrarAviso("Digite ou selecione um jogador!");

    // VALIDAÇÃO 2: Verificar se o jogador realmente existe no sistema
    const jogador = identificarJogadorPorNome(nomeJogador);
    if (!jogador) {
        return mostrarAviso("Jogador não encontrado! Verifique a grafia ou cadastre-o primeiro.");
    }
    
    if (jogador.presente && jogador.time !== 'Sem Time') {
        return mostrarAviso("Este jogador já está escalado em um time!");
    }

    // VALIDAÇÃO 3: Limitar o time a no máximo 4 integrantes (Quarteto)
    const totalNoTime = elenco.filter(j => j.time === timeEscolhido && j.presente).length;
    if (totalNoTime >= 4) {
        return mostrarAviso(`O Time ${timeEscolhido} já está completo (máximo 4 jogadores)!`);
    }

    // Executa a escalação na nuvem
    jogador.presente = true;
    jogador.time = timeEscolhido;
    
    // Limpa o campo de busca para o próximo jogador
    inputJogador.value = '';
    
    salvarElencoNuvem();
    mostrarAviso(`${jogador.nome} escalado no time ${timeEscolhido}!`, "sucesso");
}

function removerDoTime(id) {
    const jogador = elenco.find(j => j.id === id);
    if (jogador) {
        jogador.presente = false;
        jogador.time = 'Sem Time';
        salvarElencoNuvem();
    }
}

function removerJogador(id) {
    if(confirm("Tem certeza que deseja excluir este jogador do banco de dados permanentemente?")) {
        elenco = elenco.filter(j => j.id !== id);
        salvarElencoNuvem();
    }
}

function salvarElencoNuvem() {
    database.ref('torneio').update({ elenco: elenco });
}

function renderizarElenco() {
    const datalistBusca = document.getElementById('lista-jogadores-disponiveis');
    const timesDiv = document.getElementById('times-formados');
    const corpoTabela = document.getElementById('corpo-tabela-elenco');
    
    // 1. Atualizar o Datalist de Busca (Apenas com quem está sem time)
    datalistBusca.innerHTML = '';
    let disponiveis = elenco.filter(j => j.time === 'Sem Time' || !j.presente);
    
    // Organiza em ordem alfabética para facilitar a visualização do filtro
    disponiveis.sort((a, b) => a.nome.localeCompare(b.nome));

    disponiveis.forEach(j => {
        // Alimenta as opções de autocompletar do campo de texto
        datalistBusca.innerHTML += `<option value="${j.nome}"></option>`;
    });

    // 2. Renderizar os 4 Times (Cards de Visualização)
    timesDiv.innerHTML = '';
    times.forEach(nomeTime => {
        const jogadoresDoTime = elenco.filter(j => j.time === nomeTime && j.presente);
        let coresBorda = { 'Amarelo': '#ffc107', 'Rosa': '#e83e8c', 'Azul': '#007bff', 'Roxo': '#6f42c1' };
        
        let listaHtml = jogadoresDoTime.length === 0 ? '<li style="color: #999; text-align:center; margin-top: 10px;">Vazio</li>' : '';
        
        jogadoresDoTime.forEach(j => {
            let icone = j.tipo === 'mensalista' ? '⭐️' : '';
            listaHtml += `
                <li style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px dashed #ddd;">
                    <span style="font-weight: bold;">${j.nome} ${icone}</span>
                    <button onclick="removerDoTime('${j.id}')" style="background: transparent; border: none; color: #dc3545; font-size: 1.2rem; cursor: pointer; padding: 0 5px;">&times;</button>
                </li>
            `;
        });

        timesDiv.innerHTML += `
            <div class="time-container" style="border-top: 4px solid ${coresBorda[nomeTime]}">
                <div class="time-header" style="color: ${coresBorda[nomeTime]}; text-transform: uppercase;">${nomeTime} (${jogadoresDoTime.length}/4)</div>
                <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.9rem;">
                    ${listaHtml}
                </ul>
            </div>
        `;
    });

    // 3. Renderizar Tabela Geral de Cadastros (Oculta por padrão, agora com os botões Editar e Excluir)
    corpoTabela.innerHTML = '';

    // Cria uma cópia do array de elenco e organiza em ordem alfabética (de A a Z)
    let elencoOrdenado = [...elenco].sort((a, b) => a.nome.localeCompare(b.nome));

    elencoOrdenado.forEach(j => {
        let tagClass = j.tipo === 'mensalista' ? 'background: #ffd700; color: #856404;' : 'background: #17a2b8; color: #fff;';
        let texto = j.tipo === 'mensalista' ? 'Mensalista' : 'Diarista';
        corpoTabela.innerHTML += `
            <tr>
                <td style="font-weight: bold; color: var(--azul-oficial);">${j.nome}</td>
                <td><span style="${tagClass} padding: 2px 6px; border-radius: 10px; font-size: 0.8rem;">${texto}</span></td>
                <td>
                    <button style="background: #ffc107; color: #000; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; margin-right: 5px;" onclick="editarJogador('${j.id}')" title="Editar">✏️</button>
                    <button style="background: #dc3545; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer;" onclick="removerJogador('${j.id}')" title="Excluir">🗑️</button>
                </td>
            </tr>
        `;
    });
}