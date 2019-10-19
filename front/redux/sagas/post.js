import { all, fork, put, takeLatest, throttle, call } from "redux-saga/effects";
import axios from "axios";
import Router from "next/router";

import {
	ADD_POST_REQUEST,
	ADD_POST_SUCCESS,
	ADD_POST_FAILURE,
	SCRAPING_REQUEST,
	SCRAPING_SUCCESS,
	SCRAPING_FAILURE,
	LOAD_POSTS_REQUEST,
	LOAD_POSTS_FAILURE,
	LOAD_POSTS_SUCCESS,
	LOAD_POST_REQUEST,
	LOAD_POST_FAILURE,
	LOAD_POST_SUCCESS
} from "../modules/post";

function addPostAPI(postData) {
	return axios.post("/post", postData, {
		withCredentials: true
	});
}

function* addPost(action) {
	try {
		yield call(addPostAPI, action.data);

		yield put({
			type: ADD_POST_SUCCESS
		});
    
    //next로 라우팅을 하고 있기때문에 서버 라우터에서 redirect 사용하지 않고 프론트단에서 라우팅 처리를 한다.(100% 이해를 한 것은 아니지만 우선 이 정도로만)
		yield Router.push("/");
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

//포스트 하나 조회(포스트 수정용)
function loadPostAPI(postId) {
	return axios.get(`/post/${postId}`);
}

function* loadPost(action) {
	try {
		const result = yield call(loadPostAPI, action.postId);
    // yield console.log(result.data);
		yield put({
			type: LOAD_POST_SUCCESS,
			payload: result.data
		});
	} catch (e) {
		console.error(e);
		yield put({
			type: LOAD_POST_FAILURE,
			payload: e.message
		});
	}
}

function* watchLoadPost() {
	yield takeLatest(LOAD_POST_REQUEST, loadPost);
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

		yield put({
			type: SCRAPING_SUCCESS,
			payload: result.data
		});
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
	yield all([fork(watchAddPost), fork(watchScrapingForPost), fork(watchLoadPosts), fork(watchLoadPost)]);
}
