import React from 'react'
import './TemplateEditor.sass'

const TemplateEditor = ({ template, setTitle, setBody }) => {
    return (
        <div className="template-editor">
            <input
                type="text"
                placeholder="Title"
                value={template.title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
                className="body"
                rows="25"
                placeholder="Body"
                value={template.body}
                onChange={(e) => setBody(e.target.value)}
            />
        </div>
    )
}

export default TemplateEditor
