import React from 'react'
import './Info.sass'

const Info = ({ children }) => (
    <p className="info">
        <span className="material-icons">info</span>
        {children}
    </p>
)

export default Info
