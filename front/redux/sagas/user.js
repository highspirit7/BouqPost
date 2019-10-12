import { all, delay, fork, put, takeEvery, call } from "redux-saga/effects";
import axios from "axios";
import {
	LOG_IN_FAILURE,
	LOG_IN_REQUEST,
	LOG_IN_SUCCESS,
	LOG_OUT_FAILURE,
	LOG_OUT_REQUEST,
	LOG_OUT_SUCCESS
} from "../modules/user";

function loginAPI() {
	// 서버에 요청을 보내는 부분
	return axios.post("/login");
}

function* login() {
	try {
		// yield call(loginAPI);
		yield delay(1000);
		// throw new Error("Errrrr");
		yield put({
			// put은 dispatch 동일
			type: LOG_IN_SUCCESS
		});
	} catch (e) {
		// loginAPI 실패
		console.error(e);
		yield put({
			type: LOG_IN_FAILURE,
			payload: e.message
		});
	}
}

function* watchLogin() {
	yield takeEvery(LOG_IN_REQUEST, login);
}

function logOutAPI() {
  // 서버에 요청을 보내는 부분
  return axios.post('/user/logout', {}, {
    withCredentials: true,
  });
}

function* logOut() {
  try {
    // yield call(logOutAPI);
    yield call(logOutAPI);
    yield put({ // put은 dispatch 동일
      type: LOG_OUT_SUCCESS,
    });
  } catch (e) { // loginAPI 실패
    console.error(e);
    yield put({
      type: LOG_OUT_FAILURE,
      error: e,
    });
  }
}

function* watchLogOut() {
  yield takeEvery(LOG_OUT_REQUEST, logOut);
}

export default function* userSaga() {
	yield all([fork(watchLogin)]);
}
