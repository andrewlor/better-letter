import { useState, useEffect } from 'react'

export const useTemplates = () => {
    const LS_KEY = 'cover-letter-templates'

    const [templates, setTemplates] = useState(
        JSON.parse(localStorage.getItem(LS_KEY) || '[]')
    )

    useEffect(() => {
        localStorage.setItem(LS_KEY, JSON.stringify(templates))
    }, [JSON.stringify(templates)])

    return [templates, setTemplates]
}
