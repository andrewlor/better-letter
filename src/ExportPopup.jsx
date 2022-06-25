import React, { useState, useEffect } from 'react'
import pdfMake from './pdfMake'
import './ExportPopup.sass'

const ExportPopup = ({ template, onClose }) => {
    const [variables, setVariables] = useState({})

    const variableNames = Object.keys(variables)

    useEffect(() => {
        const openSplit = template.body.split('{')
        const closeSplit = template.body.split('}')

        if (template.body !== null && openSplit.length === closeSplit.length) {
            closeSplit
                .filter((s) => s.includes('{'))
                .map((s) => s.split('{')[1])
                .forEach((variableName) =>
                    setVariables((vars) => ({
                        ...vars,
                        [variableName]:
                            variableName === 'date'
                                ? new Date().toLocaleDateString()
                                : '',
                    }))
                )
        }
    }, [template.body])

    const handleInputChange = (variableName) => (e) =>
        setVariables((vars) => ({ ...vars, [variableName]: e.target.value }))

    const handleExport = () => {
        let tempStr = template.body

        variableNames.forEach((variableName) => {
            tempStr = tempStr.replaceAll(
                `{${variableName}}`,
                variables[variableName]
            )
        })

        pdfMake.createPdf({ content: tempStr }).open()
    }

    return (
        <div className="export-popup-container">
            <div className="export-popup">
                <h2>Generate Document: {template.title}</h2>
                <p className="subtitle">
                    Fill in variable values to generate a pdf from your{' '}
                    {template.title} template.
                </p>
                {variableNames.map((variableName) => (
                    <React.Fragment key={variableName}>
                        <p>{variableName}</p>
                        <input
                            placeholder={variableName}
                            value={variables[variableName]}
                            onChange={handleInputChange(variableName)}
                        />
                    </React.Fragment>
                ))}
                <button className="export-button" onClick={handleExport}>
                    Generate PDF
                </button>
                <button className="close-button" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    )
}

export default ExportPopup
