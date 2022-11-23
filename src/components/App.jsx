import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { FETCH_TEMPLATES_REQUESTED } from '../redux'
import Login from './Login'
import Menu from './Menu'
import TemplateList from './TemplateList'
import TemplateEditor from './TemplateEditor'
import Loader from './Loader'
import { UPSERT_TEMPLATE_REQUESTED } from '../redux'
import './App.sass'
import '../common.sass'

const App = ({
    user,
    templates,
    fetchTemplates,
    isLoading,
    updateTemplate,
}) => {
    const [exportingTemplate, setExportingTemplate] = useState(null)
    const [selectedTemplateId, setSelectedTemplateId] = useState(null)

    useEffect(() => {
        fetchTemplates()
    }, [user?.id])

    const renderTemplates = () => (
        <div className="app">
            <Menu />
            <TemplateList
                templates={templates}
                selectedId={selectedTemplateId}
                handleTemplateClick={setSelectedTemplateId}
            />
            <TemplateEditor
                template={templates?.find((t) => t.id == selectedTemplateId)}
                save={updateTemplate}
            />
        </div>
    )

    return (
        <>
            <Loader isLoading={isLoading} />
            {user && user.confirmed_at ? renderTemplates() : <Login />}
        </>
    )
}

export default connect(
    ({ user, templates, isLoading }) => ({ user, templates, isLoading }),
    (dispatch) => ({
        fetchTemplates: () => dispatch(FETCH_TEMPLATES_REQUESTED()),
        updateTemplate: (t) => dispatch(UPSERT_TEMPLATE_REQUESTED(t)),
    })
)(App)
