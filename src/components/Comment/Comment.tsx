import styles from './Comment.module.css'

export default function Comment({
    user,
    date,
    text,
}: {
    user: string
    date: string
    text: string
}) {
    const formattedDate = new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    return (
        <div className={styles.box}>
            <p>
                {text}
                <br />
                u/{user} · {formattedDate}
            </p>
        </div>
    )
}
