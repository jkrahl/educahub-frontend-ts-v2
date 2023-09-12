// CreatePost.tsx
// This component is the page for creating posts.
// It contains a form for creating posts. First it asks if Document or Question.
// Then it asks for the title, description, subject, unit, and file only in case of document.
import axios from "axios"
import React, { useState } from "react"
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Helmet } from 'react-helmet'
import ISubject from '../../interfaces/Subject'
import { useQuery } from 'react-query'
import { useAuth0 } from "@auth0/auth0-react"
import styles from './CreatePost.module.css'

export default function CreatePost() {
    const [type, setType] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [subject, setSubject] = useState('')
    const [unit, setUnit] = useState('')
    const [file, setFile] = useState<File | null>(null)

    const { getAccessTokenSilently } = useAuth0()

    const subjectsQuery = useQuery('subjects', async () => {
        const res = await fetch(
            'https://raw.githubusercontent.com/jkrahl/selectivitat/main/temari.json'
        )
        const json = (await res.json()) as ISubject[]
        return json
    })

    const handleTypeChange = (e: any) => {
        setType(e.target.value)
    }

    const handleTitleChange = (e: any) => {
        setTitle(e.target.value)
    }

    const handleDescriptionChange = (e: any) => {
        setDescription(e.target.value)
    }

    const handleSubjectChange = (e: any) => {
        setSubject(e.target.value)
    }

    const handleUnitChange = (e: any) => {
        setUnit(e.target.value)
    }

    const handleFileChange = (e: any) => {
        setFile(e.target.files[0])
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const formData = new FormData()
        if (type && title && description && subject && unit) {
            const token = await getAccessTokenSilently()
            formData.append('title', title)
            formData.append('description', description)
            formData.append('subject', subject)
            formData.append('unit', unit)
            formData.append('type', type)
            if (file) {
                formData.append('file', file as Blob)
            }
            const res = await axios('https://api.educahub.app/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                data: formData
            })
            if (res.status === 201) {
                // Redirect
                window.location.href = `/posts/${res.data.url}`
            } else {
                alert(res.data.message)
            }
        }
    }

    return (
        <div>
            <Helmet>
                <title>Crear publicación - EducaHub</title>
                <meta
                    name="description"
                    content="Crea una publicación en EducaHub"
                />
            </Helmet>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="exampleForm.SelectCustom" className={styles.box}>
                    <Form.Select
                        as="select"
                        onChange={handleTypeChange}
                        value={type}
                    >
                        <option value="">Selecciona el tipo de publicación</option>
                        <option value="Document">Documento</option>
                        <option value="Question">Pregunta</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1" className={styles.box}>
                    <Form.Control
                        type="text"
                        placeholder="Título"
                        onChange={handleTitleChange}
                        value={title}
                    />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlTextarea1" className={styles.box}>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Descripción"
                        onChange={handleDescriptionChange}
                        value={description}
                    />
                </Form.Group>
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
                </Form.Group>
                {type === 'Document' && (
                    <Form.Group controlId="formFile" className={styles.box}>
                        <Form.Control
                            type="file"
                            onChange={handleFileChange}
                        />
                    </Form.Group>
                )}
                <Button variant="primary" type="submit" className={styles.box}>
                    Crear publicación
                </Button>
            </Form>
        </div>
    )
}