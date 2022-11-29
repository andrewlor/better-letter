import {
    createAction,
    createReducer,
    configureStore,
    createListenerMiddleware,
    isAnyOf,
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
export const FETCH_TEMPLATES_REQUESTED = createAction(
    'FETCH_TEMPLATES_REQUESTED'
)
export const FETCH_TEMPLATES_SUCCEEDED = createAction(
    'FETCH_TEMPLATES_SUCCEEDED'
)
export const FETCH_TEMPLATES_FAILED = createAction('FETCH_TEMPLATES_FAILED')
export const UPSERT_TEMPLATE_REQUESTED = createAction(
    'UPSERT_TEMPLATE_REQUESTED'
)
export const UPSERT_TEMPLATE_SUCCEEDED = createAction(
    'UPSERT_TEMPLATE_SUCCEEDED'
)
export const UPSERT_TEMPLATE_FAILED = createAction('UPSERT_TEMPLATE_FAILED')
export const DELETE_TEMPLATE_REQUESTED = createAction(
    'DELETE_TEMPLATE_REQUESTED'
)
export const DELETE_TEMPLATE_SUCCEEDED = createAction(
    'DELETE_TEMPLATE_SUCCEEDED'
)
export const DELETE_TEMPLATE_FAILED = createAction('DELETE_TEMPLATE_FAILED')
export const CLEAR_ERROR = createAction('CLEAR_ERROR')
export const SET_SUCCESS_MESSAGE = createAction('SET_SUCCESS_MESSAGE')
export const AI_AUTOFILL_REQUESTED = createAction('AI_AUTOFILL_REQUESTED')
export const AI_AUTOFILL_SUCCEEDED = createAction('AI_AUTOFILL_SUCCEEDED')
export const AI_AUTOFILL_FAILED = createAction('AI_AUTOFILL_FAILED')

const initialState = {
    isLoading: false,
    user: supabase.auth.user(),
    templates: null,
    message: {
        type: 'error',
        text: null,
    },
    autofillResult: null,
}

const clearError = (state) => {
    state.message.text = ''
}

const startLoading = (state) => {
    state.isLoading = true
}

const stopLoading = (state) => {
    state.isLoading = false
    clearError(state)
}

const handleLoginSignup = (state, action) => {
    state.isLoading = false
    state.user = action.payload
}

const handleError = (state, action) => {
    state.isLoading = false
    state.message.text = action.payload
    state.message.type = 'error'
}

const setSuccessMessage = (state, action) => {
    state.message.text = action.payload
    state.message.type = 'success'
}

const reducer = createReducer(initialState, (builder) => {
    builder
        .addCase(SET_SUCCESS_MESSAGE, setSuccessMessage)
        .addCase(CLEAR_ERROR, clearError)
        .addCase(LOGIN_REQUESTED, startLoading)
        .addCase(SIGNUP_REQUESTED, startLoading)
        .addCase(LOGOUT_REQUESTED, startLoading)
        .addCase(FETCH_TEMPLATES_REQUESTED, startLoading)
        .addCase(UPSERT_TEMPLATE_REQUESTED, startLoading)
        .addCase(DELETE_TEMPLATE_REQUESTED, startLoading)
        .addCase(AI_AUTOFILL_REQUESTED, startLoading)
        .addCase(LOGIN_SUCCEEDED, handleLoginSignup)
        .addCase(SIGNUP_SUCCEEDED, handleLoginSignup)
        .addCase(LOGOUT_SUCCEEDED, (state) => {
            stopLoading(state)
            state.user = null
        })
        .addCase(LOGIN_FAILED, handleError)
        .addCase(SIGNUP_FAILED, handleError)
        .addCase(AI_AUTOFILL_FAILED, handleError)
        .addCase(FETCH_TEMPLATES_SUCCEEDED, (state, action) => {
            state.templates = action.payload
            stopLoading(state)
        })
        .addCase(AI_AUTOFILL_SUCCEEDED, (state, action) => {
            state.autofillResult = action.payload
            stopLoading(state)
        })
        .addCase(UPSERT_TEMPLATE_SUCCEEDED, stopLoading)
        .addCase(UPSERT_TEMPLATE_FAILED, handleError)
        .addCase(DELETE_TEMPLATE_SUCCEEDED, stopLoading)
        .addCase(DELETE_TEMPLATE_FAILED, handleError)
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
        listenerApi.dispatch(SIGNUP_SUCCEEDED(user))
    },
})

listenerMiddleware.startListening({
    actionCreator: LOGOUT_REQUESTED,
    effect: async (_, listenerApi) => {
        const { error } = await supabase.auth.signOut()
        if (error) return
        listenerApi.dispatch(LOGOUT_SUCCEEDED())
    },
})

listenerMiddleware.startListening({
    actionCreator: FETCH_TEMPLATES_REQUESTED,
    effect: async (_, listenerApi) => {
        const { data, error } = await supabase.from('templates').select()
        if (error) {
            listenerApi.dispatch(FETCH_TEMPLATES_FAILED(error.message))
            return
        }
        listenerApi.dispatch(FETCH_TEMPLATES_SUCCEEDED(data))
    },
})

listenerMiddleware.startListening({
    actionCreator: UPSERT_TEMPLATE_REQUESTED,
    effect: async (action, listenerApi) => {
        const { error } = await supabase
            .from('templates')
            .upsert(action.payload)
        if (error) {
            listenerApi.dispatch(UPSERT_TEMPLATE_FAILED(error.message))
            return
        }
        listenerApi.dispatch(UPSERT_TEMPLATE_SUCCEEDED())
    },
})

listenerMiddleware.startListening({
    actionCreator: DELETE_TEMPLATE_REQUESTED,
    effect: async (action, listenerApi) => {
        const { error } = await supabase
            .from('templates')
            .delete()
            .eq('id', action.payload)
        if (error) {
            listenerApi.dispatch(DELETE_TEMPLATE_FAILED(error.message))
            return
        }
        listenerApi.dispatch(DELETE_TEMPLATE_SUCCEEDED())
    },
})

listenerMiddleware.startListening({
    matcher: isAnyOf(DELETE_TEMPLATE_SUCCEEDED, UPSERT_TEMPLATE_SUCCEEDED),
    effect: async (_, listenerApi) => {
        listenerApi.dispatch(FETCH_TEMPLATES_REQUESTED())
    },
})

listenerMiddleware.startListening({
    actionCreator: AI_AUTOFILL_REQUESTED,
    effect: async (action, listenerApi) => {
        const response = await fetch(
            'https://uvm5ggl2fhgrldtstgmnmcwimy0lbohn.lambda-url.us-west-2.on.aws/',
            {
                method: 'post',
                body: action.payload,
                headers: {
                    Authorization: `Bearer ${
                        supabase.auth.session()?.access_token
                    }`,
                },
            }
        )
        if (response.status !== 200) {
            listenerApi.dispatch(AI_AUTOFILL_FAILED('Autofill failed.'))
            return
        }
        response
            .text()
            .then((text) => listenerApi.dispatch(AI_AUTOFILL_SUCCEEDED(text)))
    },
})

export const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(listenerMiddleware.middleware),
})
