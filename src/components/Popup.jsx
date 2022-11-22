import React from 'react'
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
        isVisible && (
            <div className="popup-container">
                <div className="popup">
                    <h2>{title}</h2>
                    <div className="content-container">{children}</div>
                    <button
                        className="action-button action"
                        onClick={onComplete}
                    >
                        {actionText}
                    </button>
                    <button className="close-button" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        )
    )
}

Popup.defaultProps = {
    isVisible: true,
    actionText: 'Save',
}

export default Popup
