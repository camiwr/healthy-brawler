const PROGRESS_KEY = 'healthyBrawler_progress';
const TUTORIAL_KEY = 'healthyBrawler_tutorialSeen'; // <-- ADICIONAR

export class GameProgress {
    // Carrega o nível mais alto desbloqueado
    public static getHighestLevelUnlocked(): number {
        const savedProgress = localStorage.getItem(PROGRESS_KEY);
        // Se não houver progresso salvo, o jogador começa no nível 1
        if (!savedProgress) {
            return 1;
        }
        return parseInt(savedProgress, 10);
    }

    // Desbloqueia o próximo nível
    public static unlockNextLevel(currentLevel: number): void {
        const highestLevel = this.getHighestLevelUnlocked();
        const nextLevel = currentLevel + 1;

        // Só salva se o próximo nível for maior do que o que já está salvo
        if (nextLevel > highestLevel) {
            localStorage.setItem(PROGRESS_KEY, nextLevel.toString());
            console.log(`Nível ${nextLevel} desbloqueado!`);
        }
    }

    // --- ADICIONAR NOVAS FUNÇÕES ABAIXO ---
    
    /**
     * Verifica se o tutorial já foi visto
     */
    public static getTutorialSeen(): boolean {
        return localStorage.getItem(TUTORIAL_KEY) === 'true';
    }

    /**
     * Marca o tutorial como visto
     */
    public static setTutorialSeen(): void {
        localStorage.setItem(TUTORIAL_KEY, 'true');
    }
}