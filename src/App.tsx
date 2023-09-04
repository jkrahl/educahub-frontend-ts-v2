import React from 'react'
import './App.css'
import { useAuth0 } from '@auth0/auth0-react'

export default function App() {
    const { isLoading, isAuthenticated, error, getAccessTokenSilently } =
        useAuth0()

    const getAccessToken = async () => {
        const accessToken = await getAccessTokenSilently({
            authorizationParams: {
                audience: process.env.REACT_APP_AUTH0_AUDIENCE,
                scope: 'read:current_user update:current_user_metadata',
            },
        })
        return accessToken
    }

    return (
        <div className="App">
            <header className="App-header">
                {isLoading ? (
                    <div>Loading ...</div>
                ) : isAuthenticated ? (
                    <div>
                        <button
                            onClick={async () => {
                                navigator.clipboard.writeText(
                                    await getAccessToken()
                                )
                            }}
                        >
                            Copy Access Token
                        </button>
                        <LogoutButton />
                    </div>
                ) : (
                    <LoginButton />
                )}
                {error && <div>Oops... {error.message}</div>}
            </header>
        </div>
    )
}

function LoginButton() {
    const { loginWithRedirect } = useAuth0()

    return <button onClick={() => loginWithRedirect()}>Log In</button>
}

function LogoutButton() {
    const { logout } = useAuth0()

    return (
        <button
            onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
            }
        >
            Log Out
        </button>
    )
}
