export default interface IComment {
    uuid: string
    user: string
    text: string
    tags?: string[]
    createdAt: string
}
