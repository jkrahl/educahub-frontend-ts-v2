import { useState } from 'react'
import type { FormEvent } from 'react'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import { useAuth0 } from '@auth0/auth0-react'
import styles from './CommentsPanel.module.css'

export default function CreateCommentBar({ postURL }: { postURL: string }) {
    const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0()

    const [comment, setComment] = useState<string>('')

    const handlePostComment = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // If not authenticated, console log and return
        if (!isAuthenticated) {
            console.log('Not authenticated')
            return
        }

        // If comment is empty, alert
        if (comment.length < 1) {
            alert('El comentario no puede estar vacío')
            return
        }

        // Get access token
        const accessToken = await getAccessTokenSilently({
            authorizationParams: {
                audience: process.env.REACT_APP_AUTH0_AUDIENCE,
                scope: 'read:current_user update:current_user_metadata',
            },
        })

        // Post comment
        const res = await fetch(
            `https://api.educahub.app/posts/` + postURL + '/comments',
            {
                body: JSON.stringify({
                    content: comment,
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                method: 'POST',
            }
        )
        if (!res.ok) {
            alert('Error al publicar comentario')
            return
        }
        // Reload page
        window.location.reload()
    }

    const AlertLogin = () => {
        return (
            <div className={styles.center}>
                <p>Debes iniciar sesión para comentar</p>
            </div>
        )
    }

    return (
        <div>
            {isLoading ? (
                <div className={styles.center}>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : isAuthenticated ? (
                <Form onSubmit={handlePostComment}>
                    <InputGroup>
                        <Form.Control
                            placeholder="Escribe un comentario"
                            aria-label="Escribe un comentario"
                            aria-describedby="Escribe un comentario"
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <Button
                            variant="outline-dark"
                            id="button-addon2"
                            type="submit"
                        >
                            Comentar
                        </Button>
                    </InputGroup>
                </Form>
            ) : (
                <AlertLogin />
            )}
        </div>
    )
}
