import React, { useState } from 'react'
import { connect } from 'react-redux'
import ExportPopup from './ExportPopup'
import { useTemplates } from '../hooks'
import TemplateEditor from './TemplateEditor'
import TemplateListItem from './TemplateListItem'
import Login from './Login'
import './App.sass'
import { LOGOUT_REQUESTED } from '../redux'
import Popup from './Popup'

const DEFAULT_TEMPLATE = {
    isOpen: false,
    title: 'New Template',
    body: 'Dear {companyName},\n\nI am applying to your position for {jobName}.\n\nThanks,\n{myName}',
}

const App = ({ user, logout }) => {
    const [templates, setTemplates] = useTemplates()
    const [exportingTemplate, setExportingTemplate] = useState(null)
    const [newTemplate, setNewTemplate] = useState(null)
    const [editingTemplateIndex, setEditingTemplateIndex] = useState(-1)

    const addTemplate = () =>
        setNewTemplate({ title: '', body: '', variables: [] })

    const modifyTemplateValue = (index, propName) => (value) =>
        setTemplates((list) =>
            list.map((t, i) => (i === index ? { ...t, [propName]: value } : t))
        )

    const modifyNewTemplateValue = (propName) => (value) =>
        setNewTemplate((t) => ({ ...t, [propName]: value }))

    const removeTemplate = (index) => () =>
        setTemplates((templates) => templates.filter((_, i) => i !== index))

    const onExport = (template) => () => setExportingTemplate(template)

    const isExporting = exportingTemplate !== null

    const renderTemplates = () => (
        <>
            <div className="menu">
                <span
                    className="material-icons hoverable"
                    onClick={addTemplate}
                >
                    add
                </span>
                <span className="material-icons hoverable" onClick={logout}>
                    logout
                </span>
            </div>
            {templates.map((t, i) => (
                <React.Fragment key={i}>
                    <TemplateListItem
                        toggleOpen={() => setEditingTemplateIndex(i)}
                        handleDelete={removeTemplate(i)}
                        handleExport={onExport(t)}
                        template={t}
                    />
                    {editingTemplateIndex === i && (
                        <Popup
                            onClose={() => setEditingTemplateIndex(-1)}
                            onComplete={() => setEditingTemplateIndex(-1)}
                        >
                            <TemplateEditor
                                template={t}
                                setTitle={modifyTemplateValue(i, 'title')}
                                setBody={modifyTemplateValue(i, 'body')}
                            />
                        </Popup>
                    )}
                </React.Fragment>
            ))}
            <Popup
                title="New Template"
                isVisible={newTemplate}
                onClose={() => setNewTemplate(null)}
                onComplete={() => {
                    setTemplates((list) => [...list, newTemplate])
                    setNewTemplate(null)
                }}
            >
                <TemplateEditor
                    template={newTemplate}
                    setTitle={modifyNewTemplateValue('title')}
                    setBody={modifyNewTemplateValue('body')}
                    setVariables={modifyNewTemplateValue('variables')}
                />
            </Popup>
            {isExporting && (
                <ExportPopup
                    template={exportingTemplate}
                    onClose={() => setExportingTemplate(null)}
                />
            )}
        </>
    )

    return (
        <div className="app">
            {user && user.confirmed_at ? renderTemplates() : <Login />}
        </div>
    )
}

export default connect(
    ({ user }) => ({ user }),
    (dispatch) => ({
        logout: () => dispatch(LOGOUT_REQUESTED()),
    })
)(App)
