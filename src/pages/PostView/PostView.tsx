import Spinner from 'react-bootstrap/Spinner'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import CommentsPanel from '../../components/CommentsPanel/CommentsPanel'
import LikeButton from '../../components/LikeButton/LikeButton'
import IPost from '../../interfaces/Post'
import styles from './PostView.module.css'
import { useQuery } from 'react-query'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'

export default function PostView() {
    let params = useParams() as { postURL: string }

    const queryInfo = useQuery('post', async () => {
        const res = await fetch(
            `https://api.educahub.app/posts/` + params.postURL
        )
        if (!res.ok) {
            console.log('Error fetching posts')
            throw new Error('Error fetching posts')
        }
        const json = (await res.json()) as IPost
        return json
    })

    return (
        <main className={styles.main}>
            <Helmet>
                <title>
                    {(queryInfo.data?.title || "Post") + ' - ' +( queryInfo.data?.subject || "EducaHub")}
                </title>
                <meta name="description" content={
                    queryInfo.data?.title + ' - ' + queryInfo.data?.description
                } />
            </Helmet>
            <div>
                {queryInfo.isLoading ? ( // If loading
                    <div className={styles.spinner}>
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : (queryInfo.error) ? ( // If error
                    <div className={styles.center}>
                        <span>{(queryInfo.error as any).message}</span>
                    </div>
                ) : (
                    // If loaded
                    <div>
                        <h2 className={styles.title}>
                            {queryInfo.data?.title}
                        </h2>
                        <div id="key-data" className={styles.alignText}>
                            <span>
                                by{' '}
                                <Link to={'/u/' + queryInfo.data?.user}>
                                    u/{queryInfo.data?.user}
                                </Link>
                                {' · '}
                                {queryInfo.data &&
                                    new Date(
                                        queryInfo.data?.createdAt
                                    ).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                            </span>
                            <br />
                            <b>
                                {queryInfo.data?.subject}
                                {' · '}
                                {queryInfo.data?.unit}
                            </b>
                        </div>

                        {queryInfo.data?.description && ( // If description exists
                            <div>
                                <h4>
                                    <span>Descripción</span>
                                </h4>
                                <div className={styles.postContent}>
                                    <p>{queryInfo.data?.description}</p>
                                </div>
                            </div>
                        )}
                        <div className={styles.likes}>
                            <LikeButton
                                postURL={queryInfo.data?.url as string}
                            />
                        </div>
                        {queryInfo.data?.type === 'Document' && (
                            <ButtonGroup>
                                <Button
                                    variant="primary"
                                    href={
                                        'https://educahub.s3.eu-central-1.amazonaws.com/' +
                                        queryInfo.data.url +
                                        '.pdf'
                                    }
                                    target="_blank"
                                >
                                    Ver
                                    <External />
                                </Button>
                                <Button
                                    variant="success"
                                    href={
                                        'https://educahub.s3.eu-central-1.amazonaws.com/' +
                                        queryInfo.data.url +
                                        '.pdf'
                                    }
                                >
                                    Descargar
                                </Button>
                            </ButtonGroup>
                        )}
                        <div className={styles.comments}>
                            <h4>
                                <span>Comentarios</span>
                            </h4>
                            <CommentsPanel
                                postURL={queryInfo.data?.url as string}
                            />
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}

function External() {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M15.6396 7.02527H12.0181V5.02527H19.0181V12.0253H17.0181V8.47528L12.1042 13.3892L10.6899 11.975L15.6396 7.02527Z"
                fill="currentColor"
            />
            <path
                d="M10.9819 6.97473H4.98193V18.9747H16.9819V12.9747H14.9819V16.9747H6.98193V8.97473H10.9819V6.97473Z"
                fill="currentColor"
            />
        </svg>
    )
}
