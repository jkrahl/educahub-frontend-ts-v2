import Spinner from 'react-bootstrap/Spinner'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import ISubject from '../../interfaces/Subject'
import styles from './Subjects.module.css'
import { Helmet } from 'react-helmet'

export default function Subjects() {
    const queryInfo = useQuery('subjects', async () => {
        const url = 'https://raw.githubusercontent.com/jkrahl/selectivitat/main/temari.json'
        const res = await fetch(url)
        if (!res.ok) {
            console.log('Error fetching subjects')
            throw new Error('Error fetching subjects')
        }
        const json = (await res.json()) as ISubject[]
        return json
    }
    )

    return (
        <main>
            <Helmet>
                <title>Asignaturas - EducaHub</title>
                <meta name="description" content={
                    'Lista de asignaturas de selectividad en Cataluña'
                } />
            </Helmet>
            <h1 className={styles.center}>Asignaturas</h1>
            <div className={styles.subjects}>
                {queryInfo.isLoading ? ( // If loading
                    <div>
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                ) : (queryInfo.error) ? ( // If error
                    <div>
                        <span>{(queryInfo.error as any).message}</span>
                    </div>
                ) : (
                    // If loaded
                    <div>
                        <ul>
                            {queryInfo.data?.map((subject, index) => (
                                <li key={index} className={styles.schoolSubjects}>
                                    <Link to={'/subjects/' + encodeURIComponent(subject.name)}>
                                        {subject.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </main>
    )
}
