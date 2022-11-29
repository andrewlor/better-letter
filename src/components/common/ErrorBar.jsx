import React from 'react'
import { CSSTransition } from 'react-transition-group'
import './ErrorBar.sass'

export default ({ message: { text, type }, clear }) => (
    <CSSTransition
        in={!!text && text.length > 0}
        timeout={200}
        classNames="error-bar"
        unmountOnExit
    >
        <div className={`error-bar ${type}`}>
            <span className="material-icons icon">
                {type === 'success' ? 'done' : 'error'}
            </span>
            {text}
            <span className="material-icons close hoverable" onClick={clear}>
                close
            </span>
        </div>
    </CSSTransition>
)
