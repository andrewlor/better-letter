import React from 'react'
import { connect } from 'react-redux'
import { UPSERT_TEMPLATE_REQUESTED, LOGOUT_REQUESTED } from '../redux'
import './Menu.sass'

const DEFAULT_TEMPLATE = {
    title: 'New Template',
    body: 'Dear {company},\n\nI am applying to your position for {job}.\n\nThanks,\n{name}',
    variables: [
        { name: 'company', defaultValue: '' },
        { name: 'job', defaultValue: 'Software Engineer' },
        { name: 'name', defaultValue: '' },
    ],
}

const Menu = ({ logout, addTemplate }) => (
    <div className="menu">
        <span className="material-icons hoverable" onClick={addTemplate}>
            add
        </span>
        <span className="material-icons hoverable last" onClick={logout}>
            logout
        </span>
    </div>
)

export default connect(null, (dispatch) => ({
    addTemplate: () => dispatch(UPSERT_TEMPLATE_REQUESTED(DEFAULT_TEMPLATE)),
    logout: () => dispatch(LOGOUT_REQUESTED()),
}))(Menu)
