import React from 'react'

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
