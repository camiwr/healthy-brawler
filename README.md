# 🥦 Healthy Brawler

![Phaser](https://img.shields.io/badge/Phaser-3.90.0-purple)
![TypeScript](https://img.shields.io/badge/TypeScript-blue)
![Vite](https://img.shields.io/badge/Vite-fast-yellow)
![Tiled](https://img.shields.io/badge/Editor-Tiled-brightgreen)
![Aseprite](https://img.shields.io/badge/Pixel_Art-Aseprite-blueviolet)

>### 🎮 JOGUE AGORA A VERSAO BETA!
> **[Acesse a versão aqui!](https://healthy-brawler.vercel.app/)**
> *(Hospedado na Vercel)*
 
**Healthy Brawler** é um jogo de aventura e ação 2D (top-down) com uma missão educativa: promover hábitos de alimentação saudável. O jogador controla um personagem que explora o mapa, derrota inimigos (Slimes) e coleta frutas para recuperar vida, aprendendo de forma lúdica a importância de uma vida equilibrada.

Este projeto foi desenvolvido como um jogo educativo focado em estudantes, utilizando uma stack moderna de desenvolvimento de jogos web.

## ✨ Mecânicas Principais

O jogo possui um "game loop" completo com as seguintes mecânicas:

* **Movimentação e Ataque:** Controle em 4 direções (top-down) e ataque com projéteis (barra de espaço).
* **Inimigos (Slimes):** Inimigos com 3 pontos de vida e uma IA simples que persegue o jogador a curta distância (150px).
* **Sistema de Vida:** O jogador tem 5 pontos de vida, com feedback visual (piscar) ao tomar dano ou ser curado.
* **Coletáveis (Frutas):** Coletar frutas (maçã, etc.) cura o jogador em 1 ponto de vida.
* **Coletáveis (Comidas Não-saúdaveis):** Coletar fastfoods (hamburguer, pizza, etc.) diminui a vida do jogador em 1 ponto de vida.
* **Progressão:** O progresso dos níveis desbloqueados é salvo no `localStorage` do navegador, permitindo que o jogador continue de onde parou.
* **Ciclo Completo:** O jogo possui menus, seleção de fases, telas de pausa, Game Over (com opção de tentar novamente) e Vitória (com opção de avançar).

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído usando uma stack robusta para desenvolvimento de jogos web e design:

* **Engine de Jogo:** [Phaser 3](https://phaser.io/) (v3.90.0) - Uma engine poderosa e popular para jogos 2D em HTML5.
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/) - Garante um código mais seguro, organizado e fácil de manter.
* **Build Tool:** [Vite](https://vitejs.dev/) - Oferece um servidor de desenvolvimento HMR (Hot-Reloading) e um processo de build otimizado para produção.
* **Editor de Mapas:** [Tiled](https://www.mapeditor.org/) - Usado para criar os mapas do jogo (`.json`) e posicionar entidades.
* **Criação de Pixel Art:** [Aseprite](https://www.aseprite.org/) - Ferramenta usada para criar e animar os sprites (personagens, inimigos, itens).
* **Design Gráfico (UI/Logo):** [Canva](https://www.canva.com/) - Usado para criar elementos de interface, logo e outros assets visuais do menu.
---

## 🚀 Como Rodar Localmente

Para rodar o projeto na sua máquina, siga estes passos:

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/](https://github.com/)[SEU-USUARIO]/[NOME-DO-REPOSITORIO].git
    cd [NOME-DO-REPOSITORIO]
    ```

2.  **Instale as dependências:**
    (É necessário ter o [Node.js](https://nodejs.org/) instalado)
    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento (Vite):**
    ```bash
    npm run dev
    ```

4.  Abra o seu navegador e acesse `http://localhost:5173` (ou o endereço indicado no terminal).

**Outros Comandos:**

* **Para criar uma build de produção:**
    ```bash
    npm run build
    ```
    (Os arquivos otimizados estarão na pasta `dist`)

---

## 🗺️ Estrutura das Cenas

O jogo é modularizado em várias Cenas do Phaser, cada uma com sua responsabilidade, garantindo um código limpo e organizado:

* **`PreloaderScene`**: Carrega todos os assets (imagens, sprites, mapas) e cria todas as animações globais (ex: `player-walk-down`, `slime-idle`).
* **`SplashScreen`**: O menu principal com o logo e o botão "Jogar".
* **`LevelSelectScene`**: Tela de seleção de fases, que lê o progresso salvo no `GameProgress.ts` (localStorage) para exibir os níveis desbloqueados.
* **`LevelOneScene`, `LevelTwoScene`, `LevelOThreeScene`**: As cenas principais, onde ocorre todo o gameplay (criação do mapa, player, slimes, colisões).
* **`UIScene`**: Renderiza a interface do usuário (corações de vida, botão de pausa) *por cima* da cena do jogo.
* **`GameOverScene` / `VictoryScene`**: Cenas de modal que aparecem ao morrer ou vencer a fase.

---

## 🎯 Próximos Passos

O projeto tem uma base sólida e o "game loop" completo para o Nível 1. Os próximos passos para expandir o jogo incluem:

* [ ] **Criar Novos Níveis:** Implementar novos desafios, explorando diversas areas.
* [ ] **Novos Mapas:** Desenhar novos mapas no Tiled.
* [ ] **Novos Inimigos:** Criar novas classes de inimigos com diferentes IAs.
* [ ] **Novos Coletáveis:** Adicionar mais frutas e itens.
* [ ] **Assets:** Incluir os novos assets (sprites, sons) no `PreloaderScene`.

---

## 🎨 Créditos de Arte (Pixel Art)

Um agradecimento especial aos artistas e às fontes dos assets de pixel art utilizados neste projeto.

* **Tilesets Principais e Personagem**: Kenmi Art - [https://kenmi-art.itch.io/](https://kenmi-art.itch.io/)
* **Assets (Farm RPG)**: EmanuelleDev - [https://emanuelledev.itch.io/farm-rpg](https://emanuelledev.itch.io/farm-rpg)
* **Tileset (Pixel Lands Forest)**: Trislin - [https://trislin.itch.io/pixel-lands-forest](https://trislin.itch.io/pixel-lands-forest)
* **Objetos Diversos**: Trislin - [https://trislin.itch.io/](https://trislin.itch.io/)
* **Sprite (Barco)**: Minzinn - [https://minzinn.itch.io/](https://minzinn.itch.io/)
* **Sprites (Comidas e Frutas)**: FMPixellence - [https://fmpixellence.itch.io/](https://fmpixellence.itch.io/)
* **Tileset (Level 2)**: Cainos - [https://cainos.itch.io/](https://cainos.itch.io/)

---

## 📜 Licença

Este projeto é distribuído sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
