import React, { useState, useRef } from 'react'
import pdfMake from '../pdfMake'
import copy from 'copy-to-clipboard'
import { useEffect } from 'react'
import { autofillVariableValue } from '../util'
import './Export.sass'

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

const ExportPopup = ({
    template,
    setSuccessMessage,
    getAutofill,
    autofillResult,
}) => {
    const [variables, setVariables] = useState({})
    const [step, setStep] = useState(0)
    const [preview, setPreview] = useState('')
    const [autofillSelection, setAutofillSelection] = useState(null)
    const [hasSelectedText, setHasSelectedText] = useState(false)

    const textAreaRef = useRef()

    useEffect(() => {
        if (!template) {
            setVariables({})
            return
        }
        setVariables(
            Object.fromEntries(
                template?.variables?.map(({ name, defaultValue }) => [
                    name,
                    defaultValue || autofillVariableValue(name),
                ])
            )
        )
    }, [template?.id])

    useEffect(() => {
        if (
            !autofillSelection ||
            autofillSelection.length < 1 ||
            autofillSelection.split(' ').length > 20
        ) {
            setHasSelectedText(false)
        } else {
            setHasSelectedText(true)
        }
    }, [autofillSelection])

    useEffect(() => {
        setPreview(getExportString())
    }, [step])

    useEffect(() => {
        setPreview((text) =>
            text.replace(autofillSelection, autofillSelection + autofillResult)
        )
    }, [autofillResult])

    const handleInputChange = (variableName) => (e) =>
        setVariables((vars) => ({ ...vars, [variableName]: e.target.value }))

    const getExportString = (tempStr = template?.body) => {
        Object.entries(variables).forEach(([name, value]) => {
            tempStr = tempStr.replaceAll(`{${name}}`, value)
        })

        return tempStr
    }

    const getFilename = () => {
        if (template.filename && template.filename.length > 0)
            return getExportString(template.filename)

        return template.title
    }

    const handleExport = () => {
        try {
            pdfMake
                .createPdf({
                    content: preview,
                    defaultStyle: {
                        font: 'Poppins',
                    },
                })
                .download(getFilename())
        } catch (e) {
            return
        }
        setSuccessMessage('PDF successfully generated')
    }

    const copyText = () => {
        copy(getExportString())
        setSuccessMessage('Copied to clipboard')
    }

    const autofill = () => {
        if (!hasSelectedText) return
        getAutofill(autofillSelection)
        setHasSelectedText(false)
    }

    const updateSelection = () => {
        const selection = window.getSelection().toString().trim()
        setAutofillSelection(selection)
    }

    return (
        <div className="export">
            <h2>Export</h2>

            {step === 0 ? (
                <>
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
                </>
            ) : (
                <>
                    <p className="subtitle">
                        Make final changes to customize your letter below. Try
                        the AI Autocomplete feature by selecting text and
                        hitting the magic button!
                    </p>
                    <div className="preview-toolbar">
                        <p className="label">Preview</p>
                        <button
                            onClick={autofill}
                            data-rh={
                                hasSelectedText
                                    ? 'AI Autocomplete'
                                    : 'Please select text below (max 20 words)'
                            }
                        >
                            <span
                                className={`material-icons hoverable ${
                                    !hasSelectedText && 'disabled'
                                }`}
                            >
                                auto_fix_normal
                            </span>
                        </button>
                    </div>
                    <textarea
                        ref={textAreaRef}
                        rows="20"
                        value={preview}
                        onChange={(e) => setPreview(e.target.value)}
                        onSelect={updateSelection}
                    />
                </>
            )}
            {step === 0 ? (
                <button className="action" onClick={() => setStep(1)}>
                    Continue
                </button>
            ) : (
                <>
                    <button className="action" onClick={handleExport}>
                        Generate PDF
                    </button>
                    <button className="action" onClick={copyText}>
                        Copy as Text
                    </button>
                </>
            )}
        </div>
    )
}

export default ExportPopup
