export interface Message {
    type: 'chat' | 'update-player-list';
    player?: string;
    content?: any;
}

export interface ChatMessage {
    player: string;
    content: string;
}