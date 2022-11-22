import React, { useState } from 'react'
import { connect } from 'react-redux'
import { LOGIN_REQUESTED, SIGNUP_REQUESTED } from '../redux'
import './Login.sass'

const Login = ({ isLoading, login, signup, error, user }) => {
    const [credentials, setCredentials] = useState({ email: '', password: '' })

    const handleInputChange = (prop) => (e) =>
        setCredentials((o) => ({ ...o, [prop]: e.target.value }))

    const renderLoginForm = () => (
        <>
            <input
                type="text"
                placeholder="Email"
                value={credentials.email}
                onChange={handleInputChange('email')}
            />

            <input
                type="password"
                placeholder="Password"
                value={credentials.password}
                onChange={handleInputChange('password')}
            />

            {error && <div className="error">{error}</div>}

            <button className="action" onClick={() => login(credentials)}>
                Log In
            </button>
            <button onClick={() => signup(credentials)}>Sign Up</button>
        </>
    )

    return (
        <div className="login">
            {isLoading
                ? 'Loading...'
                : user && !user.confirmed_at
                ? `Verification email sent to ${user.email}. Please verify your email there to complete account signup.`
                : renderLoginForm()}
        </div>
    )
}

export default connect(
    ({ isLoading, error, user }) => ({ isLoading, error, user }),
    (dispatch) => ({
        login: (user) => dispatch(LOGIN_REQUESTED(user)),
        signup: (user) => dispatch(SIGNUP_REQUESTED(user)),
    })
)(Login)
