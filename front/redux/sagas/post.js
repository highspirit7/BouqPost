import { all, fork, put, takeLatest, throttle, call } from "redux-saga/effects";
import axios from "axios";
// import Router from "next/router";

import {
	ADD_POST_REQUEST,
	ADD_POST_SUCCESS,
	ADD_POST_FAILURE,
	SCRAPING_REQUEST,
	SCRAPING_SUCCESS,
	SCRAPING_FAILURE,
	LOAD_POSTS_REQUEST,
	LOAD_POSTS_FAILURE,
	LOAD_POSTS_SUCCESS
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

		yield alert("새 포스트가 저장되었습니다!");
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

//lastId가 0이면 DB에서 제일 최신 포스트부터 조회하도록 해줄 것.
function loadPostsAPI(lastId = 0, limit = 5) {
	return axios.get(`/posts?lastId=${lastId}&limit=${limit}`);
}

function* loadPosts(action) {
	try {
		const result = yield call(loadPostsAPI, action.lastId);

		yield put({
			type: LOAD_POSTS_SUCCESS,
			payload: result.data
		});
	} catch (e) {
		console.error(e);
		yield put({
			type: LOAD_POSTS_FAILURE,
			payload: e.message
		});
	}
}

function* watchLoadPosts() {
	yield throttle(1500, LOAD_POSTS_REQUEST, loadPosts);
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
			payload: result.data
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
	yield all([fork(watchAddPost), fork(watchScrapingForPost), fork(watchLoadPosts)]);
}
