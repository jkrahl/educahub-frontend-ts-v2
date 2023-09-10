import PostsPanel from '../../components/PostPanel/PostPanel'
import IPost from '../../interfaces/Post'
import styles from './SResults.module.css'
import { useQuery } from 'react-query'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'

export default function SubjectResults() {
    let params = useParams() as { subject: string, unit: string }

    const queryInfo = useQuery('posts', async () => {
        const res = await fetch(`https://api.educahub.app/posts?subject=${encodeURIComponent(params.subject)}&unit=${encodeURIComponent(params.unit)}`)
        const json = (await res.json()) as IPost[]
        return json
    })

    return (
        <main className={styles.main}>
            <Helmet>
                <title>{params.subject} - {params.unit} - EducaHub</title>
                <meta name="description" content={
                    'Contenido de ' + params.subject + ' - ' + params.unit
                } />
            </Helmet>
            <h1 className={styles.title}>{
                params.subject + ' - ' + params.unit
            }</h1>

            <div
                className="recent-posts"
                style={{
                    marginTop: '4rem',
                }}
            >
                <h2 className={styles.title}>Resultados de búsqueda</h2>
                <PostsPanel
                    posts={queryInfo.data ?? []}
                    loading={queryInfo.isLoading}
                    empty={queryInfo.data?.length === 0}
                />
            </div>
        </main>
    )
}
