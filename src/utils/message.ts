export interface Message {
    type: 'chat' | 'update-player-list';
    player?: string;
    content?: any;
}