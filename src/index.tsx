import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Auth0Provider } from '@auth0/auth0-react'
import Home from './pages/Home/Home'
import NavBar from './components/NavBar/NavBar'
import SearchResults from './pages/SearchResults/SearchResults'
import PostView from './pages/PostView/PostView'
import SubjectResults from './pages/SubjectResults/SubjectResults'
import {
    createBrowserRouter,
    RouterProvider,
    Outlet,
    createRoutesFromElements,
    Route,
} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/posts/:postURL" element={<PostView />} />
            <Route path="/subjects/:subject/:unit" element={<SubjectResults />} />
        </Route>
    )
)

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    <React.StrictMode>
        <Auth0Provider
            domain={process.env.REACT_APP_AUTH0_DOMAIN as string}
            clientId={process.env.REACT_APP_AUTH0_CLIENT_ID as string}
            authorizationParams={{
                redirect_uri: window.location.origin,
                audience: process.env.REACT_APP_AUTH0_AUDIENCE,
                scope: 'read:current_user update:current_user_metadata',
            }}
        >
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </Auth0Provider>
    </React.StrictMode>
)

function Layout() {
    return (
        <>
            <NavBar />
            <div className="container">
                <Outlet />
            </div>
        </>
    )
}
