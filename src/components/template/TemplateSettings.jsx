import React from 'react'
import Info from '../common/Info'

const TemplateSettings = ({ template, set }) => {
    return (
        <>
            <h2>Settings</h2>
            <p className="label">Title</p>
            <input
                type="text"
                placeholder="Title"
                value={template.title}
                onChange={(e) => set('title')(e.target.value)}
            />
            <Info>
                You can use variables in your filename! Just use {'{'}curley
                braces{'}'} around the variable name.
            </Info>
            <p className="label">File Name</p>
            <input
                type="text"
                placeholder="File name"
                value={template.filename}
                onChange={(e) => set('filename')(e.target.value)}
            />
        </>
    )
}

export default TemplateSettings
