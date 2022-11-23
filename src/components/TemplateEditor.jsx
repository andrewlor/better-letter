import React, { useState, useEffect } from 'react'
import { CSSTransition } from 'react-transition-group'
import './TemplateEditor.sass'

const TemplateEditor = ({ template, save }) => {
    const [editingTemplate, setEditingTemplate] = useState(template)

    useEffect(() => {
        setEditingTemplate(template)
    }, [template])

    const set = (prop) => (value) =>
        setEditingTemplate((t) => ({ ...t, [prop]: value }))

    const setBody = set('body')

    const setTitle = set('title')

    const setVariables = set('variables')

    const modifyVariableValue = (index, propName) => (event) =>
        setVariables(
            editingTemplate?.variables?.map((t, i) =>
                i === index ? { ...t, [propName]: event.target.value } : t
            )
        )

    const addVariable = () => () =>
        setVariables([
            ...editingTemplate.variables,
            { name: '', defaultValue: '' },
        ])

    const onDeleteVariable = (index) => () =>
        setVariables(editingTemplate?.variables?.filter((_, i) => i !== index))

    const canSave =
        editingTemplate?.id === template?.id &&
        JSON.stringify(editingTemplate) !== JSON.stringify(template)

    const undo = () => setEditingTemplate(template)

    return (
        <div className="template-editor-container">
            {editingTemplate ? (
                <>
                    <div className="template-editor">
                        <input
                            type="text"
                            placeholder="Title"
                            value={editingTemplate.title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <div className="variables-header">
                            <p>Variables</p>
                            <span
                                className="material-icons hoverable"
                                onClick={addVariable}
                            >
                                add
                            </span>
                        </div>
                        {editingTemplate?.variables?.map(
                            ({ name, defaultValue }, i) => (
                                <div
                                    key={i}
                                    className="variable-inputs-container"
                                >
                                    <input
                                        value={name}
                                        onChange={modifyVariableValue(
                                            i,
                                            'name'
                                        )}
                                        placeholder="Name"
                                    />
                                    <input
                                        value={defaultValue}
                                        onChange={modifyVariableValue(
                                            i,
                                            'defaultValue'
                                        )}
                                        placeholder="Default"
                                    />
                                    <span
                                        className="material-icons hoverable"
                                        onClick={onDeleteVariable(i)}
                                    >
                                        delete
                                    </span>
                                </div>
                            )
                        )}
                        <textarea
                            className="body"
                            rows="10"
                            placeholder="Body"
                            value={editingTemplate.body}
                            onChange={(e) => setBody(e.target.value)}
                        />
                    </div>
                    <CSSTransition
                        in={canSave}
                        timeout={200}
                        classNames="slide-up"
                        unmountOnExit
                    >
                        <div className="save-bar">
                            <button onClick={undo}>Undo Changes</button>
                            <button
                                className="action"
                                onClick={() => save(editingTemplate)}
                            >
                                Save
                            </button>
                        </div>
                    </CSSTransition>
                </>
            ) : (
                <h3>No template selected</h3>
            )}
        </div>
    )
}

export default TemplateEditor
