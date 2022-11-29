import React from 'react'
import { CSSTransition } from 'react-transition-group'
import './Popup.sass'

const Popup = ({
    title,
    isVisible,
    children,
    onClose,
    onComplete,
    actionText,
}) => {
    return (
        <CSSTransition
            in={isVisible}
            timeout={200}
            classNames="fade"
            unmountOnExit
        >
            <div className="popup-container">
                <div className="popup">
                    <h2>{title}</h2>
                    {children}
                    {onComplete && (
                        <button
                            className="action-button action"
                            onClick={onComplete}
                        >
                            {actionText}
                        </button>
                    )}
                    <button className="close-button" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </CSSTransition>
    )
}

Popup.defaultProps = {
    isVisible: true,
    actionText: 'Save',
}

export default Popup
