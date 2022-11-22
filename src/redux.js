import {
    createAction,
    createReducer,
    configureStore,
    createListenerMiddleware,
} from '@reduxjs/toolkit'
import { supabase } from './supabase'

export const LOGIN_REQUESTED = createAction('LOGIN_REQUESTED')
export const LOGIN_FAILED = createAction('LOGIN_FAILED')
export const LOGIN_SUCCEEDED = createAction('LOGIN_SUCCEEDED')
export const SIGNUP_REQUESTED = createAction('SIGNUP_REQUESTED')
export const SIGNUP_SUCCEEDED = createAction('SIGNUP_SUCCEEDED')
export const SIGNUP_FAILED = createAction('SIGNUP_FAILED')
export const LOGOUT_REQUESTED = createAction('LOGOUT_REQUESTED')
export const LOGOUT_SUCCEEDED = createAction('LOGOUT_SUCCEEDED')

const initialState = {
    isLoading: false,
    user: supabase.auth.user(),
    templates: null,
    error: null,
}

const setLoading = (state) => {
    state.isLoading = true
}

const handleLoginSignup = (state, action) => {
    state.isLoading = false
    state.user = action.payload
}

const handleError = (state, action) => {
    state.isLoading = false
    state.error = action.payload
}

const reducer = createReducer(initialState, (builder) => {
    builder
        .addCase(LOGIN_REQUESTED, setLoading)
        .addCase(SIGNUP_REQUESTED, setLoading)
        .addCase(LOGOUT_REQUESTED, setLoading)
        .addCase(LOGIN_SUCCEEDED, handleLoginSignup)
        .addCase(SIGNUP_SUCCEEDED, handleLoginSignup)
        .addCase(LOGOUT_SUCCEEDED, (state) => {
            state.isLoading = false
            state.user = null
        })
        .addCase(LOGIN_FAILED, handleError)
        .addCase(SIGNUP_FAILED, handleError)
})

const listenerMiddleware = createListenerMiddleware()

listenerMiddleware.startListening({
    actionCreator: LOGIN_REQUESTED,
    effect: async (action, listenerApi) => {
        const { user, error } = await supabase.auth.signIn(action.payload)
        if (error) {
            listenerApi.dispatch(LOGIN_FAILED(error.message))
            return
        }
        console.log(user)
        listenerApi.dispatch(LOGIN_SUCCEEDED(user))
    },
})

listenerMiddleware.startListening({
    actionCreator: SIGNUP_REQUESTED,
    effect: async (action, listenerApi) => {
        const { user, error } = await supabase.auth.signUp(action.payload)
        if (error) {
            listenerApi.dispatch(SIGNUP_FAILED(error.message))
            return
        }
        console.log(user)
        listenerApi.dispatch(SIGNUP_SUCCEEDED(user))
    },
})

listenerMiddleware.startListening({
    actionCreator: LOGOUT_REQUESTED,
    effect: async (action, listenerApi) => {
        const { error } = await supabase.auth.signOut()
        if (error) return
        listenerApi.dispatch(LOGOUT_SUCCEEDED())
    },
})

export const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(listenerMiddleware.middleware),
})
