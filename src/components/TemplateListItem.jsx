import React, { useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import { formatDate } from '../util'
import './TemplateListItem.sass'

const TemplateListItem = ({ template, onClick, selected, onDelete }) => {
    const [showIcon, setShowIcon] = useState(false)

    return (
        <div
            className={`template-list-item ${selected && 'selected'}`}
            onClick={onClick}
            onMouseEnter={() => setShowIcon(true)}
            onMouseLeave={() => setShowIcon(false)}
        >
            <div>
                <h3>{template?.title}</h3>
                <p>{formatDate(new Date(template?.created_at))}</p>
            </div>
            <CSSTransition
                in={showIcon}
                timeout={200}
                classNames="fade"
                unmountOnExit
            >
                <span className="material-icons hoverable" onClick={onDelete}>
                    delete
                </span>
            </CSSTransition>
        </div>
    )
}

export default TemplateListItem
