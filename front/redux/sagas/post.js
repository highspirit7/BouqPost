import { all, fork, put, takeLatest, call, delay } from "redux-saga/effects";
import axios from "axios";
import Router from "next/router";
import {
	ADD_POST_REQUEST,
	ADD_POST_SUCCESS,
	ADD_POST_FAILURE,
	SCRAPING_REQUEST,
	SCRAPING_SUCCESS,
	SCRAPING_FAILURE
} from "../modules/post";

function addPostAPI(postData) {
	return axios.post("/post", postData, {
		withCredentials: true
	});
}

function* addPost(action) {
	try {
		const result = yield call(addPostAPI, action.data);

		yield put({
			type: ADD_POST_SUCCESS,
			data: result.data
		});
		console.dir(result.data);
		// alert("새 포스트를 추가하였습니다");
		// Router.push("/");
	} catch (e) {
		console.error(e);
		yield put({
			type: ADD_POST_FAILURE,
			payload: e.message
		});
	}
}

function* watchAddPost() {
	yield takeLatest(ADD_POST_REQUEST, addPost);
}

function scrapingForPostAPI(url) {
	return axios.post(
		"/post/scraping",
		{ url: url },
		{
			withCredentials: true
		}
	);
}

function* scrapingForPost(action) {
	try {
    const result = yield call(scrapingForPostAPI, action.url);
    
    // yield delay(2000);
		yield put({
			type: SCRAPING_SUCCESS,
			data: result.data
		});

		// alert("새 포스트를 추가하였습니다");
		// Router.push("/");
	} catch (e) {
		console.error(e);
		yield put({
			type: SCRAPING_FAILURE,
			payload: e.message
		});
	}
}

function* watchScrapingForPost() {
	yield takeLatest(SCRAPING_REQUEST, scrapingForPost);
}

export default function* postSaga() {
	yield all([fork(watchAddPost), fork(watchScrapingForPost)]);
}
