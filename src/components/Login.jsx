import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import {
    LOGIN_REQUESTED,
    SIGNUP_REQUESTED,
    SET_SUCCESS_MESSAGE,
} from '../redux'
import './Login.sass'

const Login = ({ isLoading, login, signup, user, setSuccessMessage }) => {
    const [credentials, setCredentials] = useState({ email: '', password: '' })

    useEffect(() => {
        if (window.location.hash?.length > 0) {
            setSuccessMessage('Email successfully confirmed. Please login.')
        }
    }, [])

    const handleInputChange = (prop) => (e) =>
        setCredentials((o) => ({ ...o, [prop]: e.target.value }))

    const renderLoginForm = () => (
        <div className="login">
            <div className="title-container">
                <h1>Better&nbsp;Letter</h1>
                <span className="material-icons">history_edu</span>
            </div>
            <input
                type="text"
                placeholder="Email"
                value={credentials.email}
                onChange={handleInputChange('email')}
                disabled={isLoading}
            />
            <input
                type="password"
                placeholder="Password"
                value={credentials.password}
                onChange={handleInputChange('password')}
                disabled={isLoading}
            />
            <button className="action" onClick={() => login(credentials)}>
                Log In
            </button>
            <button onClick={() => signup(credentials)}>Sign Up</button>
        </div>
    )

    return (
        <div className="login-container">
            {user && !user.confirmed_at
                ? `Verification email sent to ${user.email}. Please verify your email there to complete account signup.`
                : renderLoginForm()}
        </div>
    )
}

export default connect(
    ({ isLoading, user }) => ({ isLoading, user }),
    (dispatch) => ({
        login: (user) => dispatch(LOGIN_REQUESTED(user)),
        signup: (user) => dispatch(SIGNUP_REQUESTED(user)),
        setSuccessMessage: (message) => dispatch(SET_SUCCESS_MESSAGE(message)),
    })
)(Login)
