import React, { useState } from 'react'
import './App.sass'
import ExportPopup from './ExportPopup'
import { useTemplates } from './hooks'
import TemplateEditor from './TemplateEditor'
import TemplateListItem from './TemplateListItem'

const DEFAULT_TEMPLATE = {
    isOpen: false,
    title: 'New Template',
    body: 'Dear {companyName},\n\nI am applying to your position for {jobName}.\n\nThanks,\n{myName}',
}

const App = ({}) => {
    const [templates, setTemplates] = useTemplates()
    const [exportingTemplate, setExportingTemplate] = useState(null)

    const addTemplate = () =>
        setTemplates((list) => [...list, DEFAULT_TEMPLATE])

    const toggleTemplateOpen = (index) => () =>
        setTemplates((list) =>
            list.map((t, i) => (i === index ? { ...t, isOpen: !t.isOpen } : t))
        )

    const modifyTemplateValue = (index, propName) => (value) =>
        setTemplates((list) =>
            list.map((t, i) => (i === index ? { ...t, [propName]: value } : t))
        )

    const removeTemplate = (index) => () =>
        setTemplates((templates) => templates.filter((_, i) => i !== index))

    const onExport = (template) => () => setExportingTemplate(template)

    const isExporting = exportingTemplate !== null

    return (
        <div className="app">
            <button className="add-template-button" onClick={addTemplate}>
                +
            </button>
            {templates.map((t, i) => (
                <React.Fragment key={i}>
                    <TemplateListItem
                        toggleOpen={toggleTemplateOpen(i)}
                        handleDelete={removeTemplate(i)}
                        handleExport={onExport(t)}
                        isOpen={t.isOpen}
                        template={t}
                    />
                    {t.isOpen && (
                        <TemplateEditor
                            template={t}
                            setTitle={modifyTemplateValue(i, 'title')}
                            setBody={modifyTemplateValue(i, 'body')}
                        />
                    )}
                </React.Fragment>
            ))}
            {isExporting && (
                <ExportPopup
                    template={exportingTemplate}
                    onClose={() => setExportingTemplate(null)}
                />
            )}
        </div>
    )
}

export default App
