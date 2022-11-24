import React, { useState } from 'react'
import pdfMake from '../pdfMake'
import copy from 'copy-to-clipboard'
import './ExportPopup.sass'
import { useEffect } from 'react'

// useEffect(() => {
//     const openSplit = template.body.split('{')
//     const closeSplit = template.body.split('}')

//     if (template.body !== null && openSplit.length === closeSplit.length) {
//         closeSplit
//             .filter((s) => s.includes('{'))
//             .map((s) => s.split('{')[1])
//             .forEach((variableName) =>
//                 setVariables((vars) => ({
//                     ...vars,
//                     [variableName]:
//                         variableName === 'date'
//                             ? new Date().toLocaleDateString()
//                             : '',
//                 }))
//             )
//     }
// }, [template.body])

const ExportPopup = ({ template, onClose, setSuccessMessage }) => {
    const [variables, setVariables] = useState({})

    useEffect(() => {
        if (!template) {
            setVariables({})
            return
        }
        setVariables(
            Object.fromEntries(
                template?.variables?.map(({ name, defaultValue }) => [
                    name,
                    defaultValue,
                ])
            )
        )
    }, [template?.id])

    const handleInputChange = (variableName) => (e) =>
        setVariables((vars) => ({ ...vars, [variableName]: e.target.value }))

    const getExportString = () => {
        let tempStr = template?.body

        Object.entries(variables).forEach(([name, value]) => {
            tempStr = tempStr.replaceAll(`{${name}}`, value)
        })

        return tempStr
    }

    const handleExport = () => {
        try {
            pdfMake
                .createPdf({
                    content: getExportString(),
                    defaultStyle: {
                        font: 'Poppins',
                    },
                })
                .open()
        } catch (e) {
            return
        }
        setSuccessMessage('PDF successfully generated')
    }

    const copyText = () => {
        copy(getExportString())
        setSuccessMessage('Copied to clipboard')
    }

    return (
        <div className="export-popup-container">
            <div className="export-popup">
                <h2>Export</h2>
                <p className="subtitle">
                    Fill in variable values to generate a pdf from your{' '}
                    {template?.title} template.
                </p>
                {Object.entries(variables).map(([name]) => (
                    <React.Fragment key={name}>
                        <p className="label">{name}</p>
                        <input
                            placeholder={name}
                            value={variables[name]}
                            onChange={handleInputChange(name)}
                        />
                    </React.Fragment>
                ))}
                <button className="action" onClick={handleExport}>
                    Generate PDF
                </button>
                <button className="action" onClick={copyText}>
                    Copy as Text
                </button>
                <button className="close-button" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    )
}

export default ExportPopup
