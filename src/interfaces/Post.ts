export default interface IPost {
    type: string
    title: string
    description?: string
    user: string
    tags?: string[]
    url: string
    createdAt: string
    subject?: string
    unit?: string
}