import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import {
    AI_AUTOFILL_REQUESTED,
    FETCH_TEMPLATES_REQUESTED,
    SET_SUCCESS_MESSAGE,
} from '../redux'
import Login from './Login'
import Menu from './Menu'
import TemplateList from './template/TemplateList'
import TemplateEditor from './template/TemplateEditor'
import Loader from './common/Loader'
import ExportPopup from './ExportPopup'
import { UPSERT_TEMPLATE_REQUESTED, CLEAR_ERROR } from '../redux'
import './App.sass'
import '../common.sass'
import ErrorBar from './common/ErrorBar'
import Popup from './common/Popup'

const App = ({
    user,
    templates,
    fetchTemplates,
    isLoading,
    updateTemplate,
    message,
    clearError,
    setSuccessMessage,
    getAutofill,
    autofillResult,
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
            <Popup
                isVisible={!!exportingTemplate}
                onClose={() => setExportingTemplate(null)}
            >
                <ExportPopup
                    template={exportingTemplate}
                    setSuccessMessage={setSuccessMessage}
                    autofillResult={autofillResult}
                    getAutofill={getAutofill}
                />
            </Popup>
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
    ({ user, templates, isLoading, message, autofillResult }) => ({
        user,
        templates,
        isLoading,
        message,
        autofillResult,
    }),
    (dispatch) => ({
        fetchTemplates: () => dispatch(FETCH_TEMPLATES_REQUESTED()),
        updateTemplate: (t) => dispatch(UPSERT_TEMPLATE_REQUESTED(t)),
        clearError: () => dispatch(CLEAR_ERROR()),
        setSuccessMessage: (text) => dispatch(SET_SUCCESS_MESSAGE(text)),
        getAutofill: (text) => dispatch(AI_AUTOFILL_REQUESTED(text)),
    })
)(App)
