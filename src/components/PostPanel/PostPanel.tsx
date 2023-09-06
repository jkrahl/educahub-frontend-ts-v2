import styles from './PostPanel.module.css'
import Spinner from 'react-bootstrap/Spinner'
import Post from '../Post/Post'
import IPost from '../../interfaces/Post'

export default function PostsPanel({ posts, loading, empty }:{posts: IPost[], loading: boolean, empty: boolean}) {
    return (
        <div>
                {loading ? (
                    <div className={styles.center}>
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : empty ? (
                    <div className={styles.center}>
                        <p>No se encontraron resultados</p>
                    </div>
                ) : (
                    posts.map((post: IPost) => (
                        <Post
                            type={post.type}
                            title={post.title}
                            user={post.user}
                            date={post.createdAt}
                            subject={post.subject || ''}
                            unit={post.unit || ''}
                            url={post.url}
                        />
                    ))
                )}
                </div>
    )
}