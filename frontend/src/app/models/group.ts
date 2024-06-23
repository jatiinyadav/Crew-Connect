export interface Group{
    reactions: string[],
    id: number,
    imageUrl: string,
    userName: string,
    message: string,
    sendOn: number,
    audioURL: string | null
}