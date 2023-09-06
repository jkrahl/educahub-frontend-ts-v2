import SearchBar from '../../components/SearchBar/SearchBar'
import PostsPanel from '../../components/PostPanel/PostPanel'
import IPost from '../../interfaces/Post'
import styles from './Search.module.css'
import { useQuery } from 'react-query'

export default function SearchResults() {
    // Get query from URL
    const urlParams = new URLSearchParams(window.location.search)
    const query = urlParams.get('q')


    const queryE = encodeURIComponent(urlParams.get('q') as string)
    const queryInfo = useQuery('posts', async () => {
        const res = await fetch(`https://api.educahub.app/posts?q=` + queryE)
        const json = (await res.json()) as IPost[]
        return json
    })

    if (!query) {
        return (
            <div className={styles.center}>
                <h1>404 Not Found</h1>
            </div>
        )
    }

    return (
        <main className={styles.main}>
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
