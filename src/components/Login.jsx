import React, { useState } from 'react'
import { connect } from 'react-redux'
import { LOGIN_REQUESTED, SIGNUP_REQUESTED } from '../redux'
import './Login.sass'

const Login = ({ isLoading, login, signup, user }) => {
    const [credentials, setCredentials] = useState({ email: '', password: '' })

    const handleInputChange = (prop) => (e) =>
        setCredentials((o) => ({ ...o, [prop]: e.target.value }))

    const renderLoginForm = () => (
        <div className="login">
            <h1>betterletter</h1>
            <p>Make better letters.</p>
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
            <button
                className="action"
                onClick={() => login(credentials)}
                disabled={isLoading}
            >
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
    })
)(Login)
