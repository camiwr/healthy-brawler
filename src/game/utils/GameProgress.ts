const PROGRESS_KEY = 'healthyBrawler_progress';

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
}