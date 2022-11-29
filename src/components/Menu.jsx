import React from 'react'
import { connect } from 'react-redux'
import { UPSERT_TEMPLATE_REQUESTED, LOGOUT_REQUESTED } from '../redux'
import './Menu.sass'

const DEFAULT_TEMPLATE = {
    title: 'New Template',
    body: '',
    variables: [],
}

const Menu = ({ logout, addTemplate, user }) => (
    <div className="menu">
        <span
            className="material-icons first hoverable"
            onClick={addTemplate}
            data-rh="Add Template"
            data-rh-at="right"
        >
            add
        </span>
        <span
            className="material-icons"
            data-rh={user?.email}
            data-rh-at="right"
        >
            account_circle
        </span>
        <span
            className="material-icons hoverable"
            onClick={logout}
            data-rh="Log Out"
            data-rh-at="right"
        >
            logout
        </span>
    </div>
)

export default connect(
    ({ user }) => ({ user }),
    (dispatch) => ({
        addTemplate: () =>
            dispatch(UPSERT_TEMPLATE_REQUESTED(DEFAULT_TEMPLATE)),
        logout: () => dispatch(LOGOUT_REQUESTED()),
    })
)(Menu)
