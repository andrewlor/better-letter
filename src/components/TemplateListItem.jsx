import React, { useState } from 'react'
import './TemplateListItem.sass'

const TemplateListItem = ({
    toggleOpen,
    handleDelete,
    handleExport,
    template,
    isOpen,
}) => {
    const [showIcons, setShowIcons] = useState(false)

    return (
        <div className="template-list-item">
            <div
                className="button"
                onMouseEnter={() => setShowIcons(true)}
                onMouseLeave={() => setShowIcons(false)}
            >
                {template.title}
            </div>
            {showIcons && (
                <>
                    <div
                        className="icons-container left"
                        onMouseEnter={() => setShowIcons(true)}
                        onMouseLeave={() => setShowIcons(false)}
                    >
                        <span
                            className="material-icons expand"
                            onClick={toggleOpen}
                        >
                            edit
                        </span>
                    </div>
                    <div
                        className="icons-container right"
                        onMouseEnter={() => setShowIcons(true)}
                        onMouseLeave={() => setShowIcons(false)}
                    >
                        <span
                            className="material-icons create"
                            onClick={handleExport}
                        >
                            create_new_folder
                        </span>
                        <span className="material-icons" onClick={handleDelete}>
                            delete
                        </span>
                    </div>
                </>
            )}
        </div>
    )
}

export default TemplateListItem
