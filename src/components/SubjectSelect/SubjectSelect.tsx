// SubjectSelect.tsx
// This component is two select boxes that allow the user to select a subject and a unit.
// Subjects and units are fetched from a JSON file on GitHub.
import { useState } from 'react'
import styles from './SubjectSelect.module.css'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ISubject from '../../interfaces/Subject'
import { useQuery } from 'react-query'

export default function SubjectSelect() {
    const [subject, setSubject] = useState('')
    const [unit, setUnit] = useState('')

    const subjectsQuery = useQuery('subjects', async () => {
        const res = await fetch(
            'https://raw.githubusercontent.com/jkrahl/selectivitat/main/temari.json'
        )
        const json = (await res.json()) as ISubject[]
        return json
    })

    const handleSubjectChange = (e: any) => {
        setSubject(e.target.value)
    }

    const handleUnitChange = (e: any) => {
        setUnit(e.target.value)
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
        if (subject && unit) {
            window.location.href =
                '/subjects/' +
                encodeURIComponent(subject) +
                '/' +
                encodeURIComponent(unit)
        }
    }

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="exampleForm.SelectCustom" className={styles.box}>
                    <Form.Select
                        as="select"
                        onChange={handleSubjectChange}
                        value={subject}
                    >
                        <option value="">Selecciona una materia</option>
                        {subjectsQuery.data?.map((subject) => (
                            <option key={subject.name} value={subject.name}>
                                {subject.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group controlId="exampleForm.SelectCustom" className={styles.box}>
                    <Form.Select
                        as="select"
                        onChange={handleUnitChange}
                        value={unit}
                    >
                        <option value="">Selecciona una unidad</option>
                        {subjectsQuery.data
                            ?.find((s) => s.name === subject)
                            ?.units.map((unit) => (
                                <option key={unit} value={unit}>
                                    {unit}
                                </option>
                            ))}
                    </Form.Select>
                </Form.Group >
                <Button variant="primary" type="submit" className={styles.box}>
                    Buscar por unidad
                </Button>
            </Form>
        </div>
    )
}
