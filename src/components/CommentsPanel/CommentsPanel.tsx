import styles from './CommentsPanel.module.css'
import Spinner from 'react-bootstrap/Spinner'
import CreateCommentBar from './CreateCommentBar'
import Comment from '../Comment/Comment'
import IComment from '../../interfaces/Comment'
import { useQuery } from 'react-query'

export default function CommentsPanel({ postURL }: { postURL: string }) {
    const queryInfo = useQuery('comments-' + postURL, async () => {
        const res = await fetch(
            `https://api.educahub.app/posts/` + postURL + '/comments'
        )
        if (!res.ok) {
            console.log('Error fetching comments')
            throw new Error('Error fetching comments')
        }
        const json = (await res.json()) as IComment[]
        return json
    })

    return (
        <div>
            <CreateCommentBar postURL={postURL} />
            {queryInfo.isLoading ? (
                <div className={styles.center}>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : queryInfo.error || queryInfo.data?.length === 0 ? (
                <div className={styles.center}>
                    <p style={{
                        marginTop: '1rem',
                    }}>No se encontraron comentarios</p>
                </div>
            ) : (
                <>
                    {queryInfo.data?.map((comment: IComment) => (
                        <Comment
                            user={comment.user}
                            date={comment.createdAt}
                            text={comment.text}
                        />
                    ))}
                </>
            )}
        </div>
    )
}
