import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import { FETCH_TEMPLATES_REQUESTED, SET_SUCCESS_MESSAGE } from '../redux'
import Login from './Login'
import Menu from './Menu'
import TemplateList from './TemplateList'
import TemplateEditor from './TemplateEditor'
import Loader from './Loader'
import ExportPopup from './ExportPopup'
import { UPSERT_TEMPLATE_REQUESTED, CLEAR_ERROR } from '../redux'
import './App.sass'
import '../common.sass'
import ErrorBar from './ErrorBar'

const App = ({
    user,
    templates,
    fetchTemplates,
    isLoading,
    updateTemplate,
    message,
    clearError,
    setSuccessMessage,
}) => {
    const [exportingTemplate, setExportingTemplate] = useState(null)
    const [selectedTemplateId, setSelectedTemplateId] = useState(null)

    useEffect(() => {
        fetchTemplates()
    }, [user?.id])

    const selectedTemplate = templates?.find((t) => t.id === selectedTemplateId)

    const renderTemplates = () => (
        <div className="app">
            <Menu />
            <TemplateList
                templates={templates}
                selectedId={selectedTemplateId}
                handleTemplateClick={setSelectedTemplateId}
            />
            <TemplateEditor
                template={selectedTemplate}
                save={updateTemplate}
                onExport={() => setExportingTemplate(selectedTemplate)}
            />
            <CSSTransition
                in={!!exportingTemplate}
                timeout={200}
                classNames="fade"
                unmountOnExit
            >
                <ExportPopup
                    template={exportingTemplate}
                    onClose={() => setExportingTemplate(null)}
                    setSuccessMessage={setSuccessMessage}
                />
            </CSSTransition>
        </div>
    )

    return (
        <>
            <Loader isLoading={isLoading} />
            <ErrorBar message={message} clear={clearError} />
            {user && user.confirmed_at ? renderTemplates() : <Login />}
        </>
    )
}

export default connect(
    ({ user, templates, isLoading, message }) => ({
        user,
        templates,
        isLoading,
        message,
    }),
    (dispatch) => ({
        fetchTemplates: () => dispatch(FETCH_TEMPLATES_REQUESTED()),
        updateTemplate: (t) => dispatch(UPSERT_TEMPLATE_REQUESTED(t)),
        clearError: () => dispatch(CLEAR_ERROR()),
        setSuccessMessage: (text) => dispatch(SET_SUCCESS_MESSAGE(text)),
    })
)(App)
