import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import axios from "axios";
import {
	LOAD_USER_FAILURE,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
	LOG_OUT_FAILURE,
	LOG_OUT_REQUEST,
	LOG_OUT_SUCCESS,
	// LOG_IN_FAILURE,
	// LOG_IN_REQUEST,
	// LOG_IN_SUCCESS
} from "../modules/user";

// function loginAPI() {
// 	// 서버에 요청을 보내는 부분
// 	return axios.get("/oauth/kakao", {
// 		withCredentials: false
// 	});
// }

// function* login() {
// 	try {
// 		yield call(loginAPI);

// 		// throw new Error("Errrrr");
// 		yield put({
// 			// put은 dispatch 동일
// 			type: LOG_IN_SUCCESS
// 		});
// 	} catch (e) {
// 		// loginAPI 실패
// 		console.error(e);
// 		yield put({
// 			type: LOG_IN_FAILURE,
// 			payload: e.message
// 		});
// 	}
// }

// function* watchLogin() {
// 	yield takeEvery(LOG_IN_REQUEST, login);
// }

function logOutAPI() {
	// 서버에 요청을 보내는 부분
	return axios.post(
		"/user/logout",
		{},
		{
			withCredentials: true
		}
	);
}

function* logOut() {
	try {
		// yield call(logOutAPI);
		yield call(logOutAPI);
		yield put({
			// put은 dispatch 동일
			type: LOG_OUT_SUCCESS
		});
	} catch (e) {
		// loginAPI 실패
		console.error(e);
		yield put({
			type: LOG_OUT_FAILURE,
			error: e
		});
	}
}

function* watchLogOut() {
	yield takeEvery(LOG_OUT_REQUEST, logOut);
}

function loadUserAPI(userId) {
	// 서버에 요청을 보내는 부분
	return axios.get(userId ? `/user/${userId}` : "/user/", {
		withCredentials: true
	});
}

function* loadUser(action) {
	try {
		// yield call(loadUserAPI);
		const result = yield call(loadUserAPI, action.data);
		yield put({
			// put은 dispatch 동일
			type: LOAD_USER_SUCCESS,
			data: result.data,
			me: !action.data
		});
	} catch (e) {
		// loginAPI 실패
		console.error(e);
		yield put({
			type: LOAD_USER_FAILURE,
			error: e.message
		});
	}
}

function* watchLoadUser() {
	yield takeEvery(LOAD_USER_REQUEST, loadUser);
}

export default function* userSaga() {
	yield all([fork(watchLogOut), fork(watchLoadUser)]);
}
