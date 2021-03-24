export interface Message {
    type: 'chat' | 'update-player-list' | 'vote-game' | 'update-voted-game-list';
    player?: string;
    content?: any;
}

export interface ChatMessage {
    player: string;
    content: string;
}