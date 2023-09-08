import SearchBar from '../../components/SearchBar/SearchBar'
import PostsPanel from '../../components/PostPanel/PostPanel'
import IPost from '../../interfaces/Post'
import styles from './Home.module.css'
import { useQuery } from 'react-query'
import { Helmet } from 'react-helmet'

export default function Home() {
    const queryInfo = useQuery('posts', async () => {
        const res = await fetch('https://api.educahub.app/posts')
        if (!res.ok) {
            console.log('Error fetching posts')
            return []
        }
        const json = (await res.json()) as IPost[]
        return json
    })

    return (
        <main className={styles.main}>
            <Helmet>
                <title>EducaHub</title>
                <meta
                    name="description"
                    content="Recursos educativos para estudiantes de Cataluña"
                />
            </Helmet>
            <h1 className={styles.title}>EducaHub</h1>
            <div id="buscador" className={styles.center}>
                <SearchBar />
            </div>

            <div
                className="recent-posts"
                style={{
                    marginTop: '4rem',
                }}
            >
                <h2 className={styles.title}>Recientes</h2>
                <PostsPanel
                    posts={queryInfo.data ?? []}
                    loading={queryInfo.isLoading}
                    empty={queryInfo.data?.length === 0}
                />
            </div>
        </main>
    )
}
