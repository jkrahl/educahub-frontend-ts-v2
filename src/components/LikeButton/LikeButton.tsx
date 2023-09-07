import { useQuery } from 'react-query'
import { useAuth0 } from '@auth0/auth0-react'
import ILikes from '../../interfaces/Likes'

export default function LikeButton({ postURL }: { postURL: string }) {
    const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0()

    const queryInfo = useQuery<ILikes>('likes-' + postURL, async () => {
        const accessToken = await getAccessTokenSilently({
            authorizationParams: {
                audience: process.env.REACT_APP_AUTH0_AUDIENCE,
                scope: 'read:current_user update:current_user_metadata',
            },
        })
        const response = await fetch(
            'https://api.educahub.app/posts/' + postURL + '/likes',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Inicia sesión para ver los likes')
            }
            throw new Error('Network response was not ok')
        }
        const json = (await response.json()) as ILikes
        return json
    })

    if (isLoading || queryInfo.isLoading) return <p>Cargando likes...</p>
    if (!isAuthenticated) return <p>Inicia sesión para ver los likes</p>
    if (queryInfo.error) return <p>{(queryInfo.error as any).message}</p>
    return (
        <LikeBadge
            liked={queryInfo.data?.userLiked || false}
            likes={queryInfo.data?.likes || 0}
            postURL={postURL}
        />
    )
}

function LikeBadge({ liked, likes, postURL }: { liked: boolean; likes: number, postURL: string }) {
    const { getAccessTokenSilently } = useAuth0()

    const likePost = async () => {
        const accessToken = await getAccessTokenSilently({
            authorizationParams: {
                audience: process.env.REACT_APP_AUTH0_AUDIENCE,
                scope: 'read:current_user update:current_user_metadata',
            },
        })
        const response = await fetch(
            'https://api.educahub.app/posts/' + postURL + '/likes',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Inicia sesión para dar like')
            }
            throw new Error('Network response was not ok')
        }
        // Reload window
        window.location.reload()
    }

    const unlikePost = async () => {
        const accessToken = await getAccessTokenSilently({
            authorizationParams: {
                audience: process.env.REACT_APP_AUTH0_AUDIENCE,
                scope: 'read:current_user update:current_user_metadata',
            },
        })
        const response = await fetch(
            'https://api.educahub.app/posts/' + postURL + '/likes',
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Inicia sesión para dar like')
            }
            throw new Error('Network response was not ok')
        }
        // Reload window
        window.location.reload()
    }

    if (liked) {
        return (
            <img
                src={'https://img.shields.io/badge/Liked-' + likes + '-red'}
                alt={likes + 'likes'}
                onClick={unlikePost}
            />
        )
    } else {
        return (
            <img
                src={'https://img.shields.io/badge/Like-' + likes + '-blue'}
                alt={likes + 'likes'}
                onClick={likePost}
            />
        )
    }
}
