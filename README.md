# 🏐 Tabela Bola Fora

Um aplicativo web leve e responsivo desenvolvido para automatizar a marcação de pontos, classificação e chaves de torneios de vôlei de areia. Construído com foco em usabilidade mobile para ser utilizado diretamente na beira da quadra.

## 🎯 Sobre o Projeto

O **Tabela Bola Fora** foi criado para substituir as planilhas de papel e automatizar a matemática do torneio. Ele gerencia 4 times (Amarelo, Rosa, Azul e Roxo) através de uma fase de grupos completa, calcula a tabela de classificação automaticamente e gera as chaves de mata-mata (Semifinais, Disputa de 3º Lugar e Grande Final).

### 🚀 Funcionalidades Principais

- **Fase de Grupos Automatizada:** Partidas geradas em uma ordem fixa e otimizada para o revezamento dos times.
- **Validação de Regras Oficiais:** O sistema não permite salvar resultados inválidos ou empates. Ele reconhece a vitória no set de 15 pontos e aplica automaticamente a regra do "vai a dois" (ex: 16x14, 21x19).
- **Classificação Inteligente:** Cálculo automático de vitórias com critério de desempate por **Confronto Direto**.
- **Geração de Mata-Mata:** Assim que a fase de grupos termina, o sistema cruza os times (1º x 4º e 2º x 3º) para as semifinais e posteriormente para as finais.
- **Persistência de Dados (Offline-first):** Utiliza o `localStorage` do navegador. Se o celular descarregar ou a página for atualizada acidentalmente, nenhum dado do torneio é perdido.
- **Interface Otimizada:** Design baseado na paleta de cores oficial do grupo e layout em formato de "cards", otimizado para leitura sob a luz do sol e toques rápidos na tela do celular.

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Estruturação semântica e interface.
- **CSS3:** Estilização responsiva, CSS Grid, Flexbox e variáveis de cores nativas.
- **JavaScript (Vanilla):** Lógica de negócios, manipulação do DOM e gerenciamento de estado (localStorage) sem dependência de frameworks externos.

## 📱 Como Acessar (Live Demo)

O projeto está hospedado no GitHub Pages e pode ser acessado por qualquer dispositivo móvel através do link:
👉 **[Acessar Tabela Bola Fora](https://louisebraga.github.io/tabela-bola-fora/)**

*Dica: Para a melhor experiência, abra o link no navegador do seu celular (Chrome/Safari) e selecione a opção "Adicionar à Tela Inicial". O sistema funcionará como um aplicativo nativo em tela cheia.*

## 💻 Como rodar o projeto localmente

1. Faça o clone deste repositório:
```bash
   git clone [https://github.com/LouiseBraga/tabela-bola-fora.git](https://github.com/LouiseBraga/tabela-bola-fora.git)
   ```

2. Navegue até a pasta do projeto:
```bash
    cd tabela-bola-fora
```

3. Abra o arquivo index.html em qualquer navegador web, ou utilize a extensão Live Server do VS Code.



## 👤 Autora
Desenvolvido por Louise Marcelle Braga.