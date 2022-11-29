import React, { useState, useEffect } from 'react'
import { CSSTransition } from 'react-transition-group'
import Popup from '../common/Popup'
import TemplateSettings from './TemplateSettings'
import Info from '../common/Info'
import './TemplateEditor.sass'

const TemplateEditor = ({ template, save, onExport }) => {
    const [editingTemplate, setEditingTemplate] = useState(template)
    const [showSettings, setShowSettings] = useState(false)

    useEffect(() => {
        setEditingTemplate(template)
    }, [template])

    const set = (prop) => (value) =>
        setEditingTemplate((t) => ({ ...t, [prop]: value }))

    const setBody = set('body')

    const setVariables = set('variables')

    const modifyVariableValue = (index, propName) => (event) =>
        setVariables(
            editingTemplate?.variables?.map((t, i) =>
                i === index ? { ...t, [propName]: event.target.value } : t
            )
        )

    const addVariable = () =>
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

    const toggleSettings = () => setShowSettings((v) => !v)

    return (
        <div
            className={`template-editor-container ${
                !editingTemplate && 'empty'
            }`}
        >
            {editingTemplate ? (
                <>
                    <div className="template-editor">
                        <div className="toolbar">
                            <span
                                className="material-icons hoverable"
                                onClick={toggleSettings}
                                data-rh="Settings"
                            >
                                settings
                            </span>
                            <button
                                className="action"
                                onClick={onExport}
                                disabled={canSave}
                            >
                                Export
                            </button>
                        </div>
                        <div className="variables-header">
                            <p>Variables</p>
                            <span
                                className="material-icons hoverable"
                                onClick={addVariable}
                                data-rh="Add Variable"
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
                                        data-rh="Delete Variable"
                                    >
                                        delete
                                    </span>
                                </div>
                            )
                        )}
                        <textarea
                            className="body"
                            rows="20"
                            placeholder="Body"
                            value={editingTemplate.body}
                            onChange={(e) => setBody(e.target.value)}
                        />
                        <Info>
                            Use {'{'}curley braces{'}'} around a variable name
                            to insert it into your letter body. Eg. if your
                            variable name is 'company', write {'{'}company{'}'}.
                        </Info>
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
            {
                <Popup
                    isVisible={showSettings}
                    onComplete={() => {
                        save(editingTemplate)
                        toggleSettings()
                    }}
                    onClose={toggleSettings}
                >
                    <TemplateSettings template={editingTemplate} set={set} />
                </Popup>
            }
        </div>
    )
}

export default TemplateEditor
