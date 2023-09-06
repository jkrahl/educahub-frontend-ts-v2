import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { useState } from 'react'

export default function SearchBar() {
    const [search, setSearch] = useState('')

    // Placeholder will be a random value from the array
    const placeholders = [
        'Derivadas',
        'Dinámica',
        'República',
        'Torque',
    ]
    const placeholder = placeholders[Math.floor(Math.random() * placeholders.length)]

    const handleSearchWord = (e: any) => {
        e.preventDefault()
        // Redirect to search page
        if (search) {
            window.location.href = '/search/?q=' + search
        }
    }

    return (
        <div
            style={{
                width: '100%',
            }}
        >
            <Form onSubmit={handleSearchWord}>
            <InputGroup>
                <Form.Control
                    placeholder={placeholder}
                    aria-label="Buscador"
                    aria-describedby="Buscador"
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button variant="outline-dark" id="button-addon2" type="submit">
                    Buscar
                </Button>
            </InputGroup>
            </Form>

        </div>
    )
}
