import { all, delay, fork, put, takeLatest, call } from "redux-saga/effects";
import axios from "axios";
import Router from "next/router";
import { ADD_POST_REQUEST, ADD_POST_SUCCESS, ADD_POST_FAILURE } from "../modules/post";

function addPostAPI(postData) {
	return axios.post("/post", postData, {
		withCredentials: true
	});
}

function* addPost(action) {
	try {
		// const result = yield call(addPostAPI, action.data);
		// yield delay(1000);
		yield put({
			type: ADD_POST_SUCCESS
			// data: result.data,
    });
    alert("새 포스트를 추가하였습니다");
    Router.push("/");
	} catch (e) {
		yield put({
			type: ADD_POST_FAILURE,
			payload: e.message
		});
	}
}

function* watchAddPost() {
	yield takeLatest(ADD_POST_REQUEST, addPost);
}

export default function* postSaga() {
	yield all([fork(watchAddPost)]);
}
