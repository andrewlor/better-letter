import React from 'react'
import './TemplateEditor.sass'

const TemplateEditor = ({ template, setTitle, setBody, setVariables }) => {
    const modifyVariableValue = (index, propName) => (event) =>
        setVariables(
            template?.variables?.map((t, i) =>
                i === index ? { ...t, [propName]: event.target.value } : t
            )
        )

    const onDeleteVariable = (index) => () =>
        setVariables(template?.variables?.filter((_, i) => i !== index))

    return (
        <div className="template-editor">
            <input
                type="text"
                placeholder="Title"
                value={template.title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <div className="variables-header">
                <p>Variables</p>
                <span
                    className="material-icons hoverable"
                    onClick={() =>
                        setVariables([
                            ...template.variables,
                            { name: '', defaultValue: '' },
                        ])
                    }
                >
                    add
                </span>
            </div>
            {template?.variables?.map(({ name, defaultValue }, i) => (
                <div key={i} className="variable-inputs-container">
                    <input
                        value={name}
                        onChange={modifyVariableValue(i, 'name')}
                        placeholder="Name"
                    />
                    <input
                        value={defaultValue}
                        onChange={modifyVariableValue(i, 'defaultValue')}
                        placeholder="Default"
                    />
                    <span
                        className="material-icons hoverable"
                        onClick={onDeleteVariable(i)}
                    >
                        delete
                    </span>
                </div>
            ))}
            <textarea
                className="body"
                rows="10"
                placeholder="Body"
                value={template.body}
                onChange={(e) => setBody(e.target.value)}
            />
        </div>
    )
}

export default TemplateEditor
