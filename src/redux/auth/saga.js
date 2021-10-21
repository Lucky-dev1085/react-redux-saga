
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { auth } from '../../helpers/Firebase';
import {
    LOGIN_USER,
    SIGNUP_USER,
    REGISTER_USER,
    LOGOUT_USER
} from '../actions';

import {
    loginUserSuccess,
    loginUserError,
    signupUserSuccess,
    signupUserError,
    registerUserSuccess,
    registerUserError
} from './actions';

const loginWithEmailPasswordAsync = async (email, password) =>
    await auth.signInWithEmailAndPassword(email, password)
        .then(authUser => authUser)
        .catch(error => error);

function* loginWithEmailPassword({ payload }) {
    const { email, password } = payload.user;
    const { history } = payload;
    try {
        const loginUser = yield call(loginWithEmailPasswordAsync, email, password);
        if (!loginUser.message) {
            localStorage.setItem('user_id', loginUser.user.uid);
            yield put(loginUserSuccess(loginUser.user));
            history.push('/');
        } else {
            yield put(loginUserError(loginUser.message));
        }
    } catch (error) {
        yield put(loginUserError(error));

    }
}

const signupWithEmailPasswordAsync = async (email, password) =>
    await auth.createUserWithEmailAndPassword(email, password)
        .then(authUser => authUser)
        .catch(error => error);

function* signupWithEmailPassword({ payload }) {
    const { email, password } = payload.user;
    // const { history } = payload
    try {
        const signupUser = yield call(signupWithEmailPasswordAsync, email, password);
        if (!signupUser.message) {
            localStorage.setItem('user_id', signupUser.user.uid);
            yield put(signupUserSuccess(signupUser.user));
            // history.push('/')
        } else {
            yield put(signupUserError(signupUser.message));

        }
    } catch (error) {
        yield put(signupUserError(error));
    }
}

const registerWithEmailPasswordAsync = async (email, password) =>
    await auth.createUserWithEmailAndPassword(email, password)
        .then(authUser => authUser)
        .catch(error => error);

function* registerWithEmailPassword({ payload }) {
    const { email, password } = payload.user;
    const { history } = payload
    try {
        const registerUser = yield call(registerWithEmailPasswordAsync, email, password);
        if (!registerUser.message) {
            localStorage.setItem('user_id', registerUser.user.uid);
            yield put(registerUserSuccess(registerUser.user));
            // history.push('/')
        } else {
            yield put(registerUserError(registerUser.message));

        }
    } catch (error) {
        yield put(registerUserError(error));
    }
}



const logoutAsync = async (history) => {
    await auth.signOut().then(authUser => authUser).catch(error => error);
    history.push('/')
}

function* logout({ payload }) {
    const { history } = payload
    try {
        yield call(logoutAsync, history);
        localStorage.removeItem('user_id');
    } catch (error) {
    }
}



export function* watchRegisterUser() {
    yield takeEvery(REGISTER_USER, registerWithEmailPassword);
}

export function* watchSignupUser() {
    yield takeEvery(SIGNUP_USER, signupWithEmailPassword);
}

export function* watchLoginUser() {
    yield takeEvery(LOGIN_USER, loginWithEmailPassword);
}

export function* watchLogoutUser() {
    yield takeEvery(LOGOUT_USER, logout);
}


export default function* rootSaga() {
    yield all([
        fork(watchLoginUser),
        fork(watchLogoutUser),
        fork(watchRegisterUser),
        fork(watchSignupUser)
    ]);
}