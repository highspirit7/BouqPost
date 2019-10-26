import { delay, all, fork, put, takeLatest, throttle, call } from "redux-saga/effects";
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
	SEARCH_POSTS_REQUEST,
	SEARCH_POSTS_FAILURE,
	SEARCH_POSTS_SUCCESS,
	LOAD_POST_REQUEST,
	LOAD_POST_FAILURE,
	LOAD_POST_SUCCESS,
	UPDATE_POST_REQUEST,
	UPDATE_POST_FAILURE,
	UPDATE_POST_SUCCESS,
	REMOVE_POST_FAILURE,
	REMOVE_POST_REQUEST,
	REMOVE_POST_SUCCESS,
	LOAD_CATEGORY_POSTS_REQUEST,
	LOAD_CATEGORY_POSTS_FAILURE,
	LOAD_CATEGORY_POSTS_SUCCESS,
	LOAD_USER_POSTS_REQUEST,
	LOAD_USER_POSTS_FAILURE,
	LOAD_USER_POSTS_SUCCESS,
	LOAD_RANDOM_POSTS_FAILURE,
	LOAD_RANDOM_POSTS_SUCCESS,
	LOAD_RANDOM_POSTS_REQUEST,
	LIKE_POST_REQUEST,
	LIKE_POST_SUCCESS,
	LIKE_POST_FAILURE,
	UNLIKE_POST_REQUEST,
	UNLIKE_POST_SUCCESS,
	UNLIKE_POST_FAILURE,
	LOAD_USER_LIKES_SUCCESS,
	LOAD_USER_LIKES_FAILURE,
	LOAD_USER_LIKES_REQUEST
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

function updatePostAPI(postId, postData) {
	return axios.put(`/post/${postId}`, postData, {
		withCredentials: true
	});
}

function* updatePost(action) {
	try {
		yield call(updatePostAPI, action.postId, action.data);

		yield put({
			type: UPDATE_POST_SUCCESS
		});

		yield alert("성공적으로 포스트가 업데이트되었습니다");
		//next로 라우팅을 하고 있기때문에 서버 라우터에서 redirect 사용하지 않고 프론트단에서 라우팅 처리를 한다.(100% 이해를 한 것은 아니지만 우선 이 정도로만)
		yield Router.push("/");
	} catch (e) {
		console.error(e);
		yield put({
			type: UPDATE_POST_FAILURE,
			payload: e.message
		});
	}
}

function* watchUpdatePost() {
	yield takeLatest(UPDATE_POST_REQUEST, updatePost);
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
	return axios.get(`/post/${postId}`, {
		withCredentials: true
	});
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

function removePostAPI(postId) {
	return axios.delete(`/post/${postId}`, {
		withCredentials: true
	});
}

function* removePost(payload) {
	try {
		const result = yield call(removePostAPI, payload.postId);
		yield put({
			type: REMOVE_POST_SUCCESS,
			data: result.data
		});
	} catch (e) {
		console.error(e);
		yield put({
			type: REMOVE_POST_FAILURE,
			error: e
		});
	}
}

function* watchRemovePost() {
	yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

//lastId가 0이면 DB에서 제일 최신 포스트부터 조회하도록 해줄 것.
function searchPostsAPI(keyword, lastId = 0) {
	return axios.get(`/search/${encodeURIComponent(keyword)}?lastId=${lastId}`);
}

function* searchPosts(action) {
	try {
		const result = yield call(searchPostsAPI, action.keyword, action.lastId);
		// yield delay(1500);
		yield put({
			type: SEARCH_POSTS_SUCCESS,
			payload: result.data
		});
	} catch (e) {
		console.error(e);
		yield put({
			type: SEARCH_POSTS_FAILURE,
			payload: e.message
		});
	}
}

function* watchSearchPosts() {
	yield throttle(1500, SEARCH_POSTS_REQUEST, searchPosts);
}

//lastId가 0이면 DB에서 제일 최신 포스트부터 조회하도록 해줄 것.
function loadCategoryPostsAPI(category, lastId = 0, limit = 5) {
	return axios.get(`/category/${category}?lastId=${lastId}&limit=${limit}`);
}

function* loadCategoryPosts(action) {
	try {
		const result = yield call(loadCategoryPostsAPI, action.category, action.lastId);

		yield put({
			type: LOAD_CATEGORY_POSTS_SUCCESS,
			payload: result.data
		});
	} catch (e) {
		console.error(e);
		yield put({
			type: LOAD_CATEGORY_POSTS_FAILURE,
			payload: e.message
		});
	}
}

function* watchLoadCategoryPosts() {
	yield takeLatest(LOAD_CATEGORY_POSTS_REQUEST, loadCategoryPosts);
}

function loadUserPostsAPI(userId, lastId = 0, limit = 5) {
	return axios.get(`/user/${userId}?lastId=${lastId}&limit=${limit}`);
}

function* loadUserPosts(payload) {
	try {
		const result = yield call(loadUserPostsAPI, payload.user_id, payload.lastId);

		yield put({
			type: LOAD_USER_POSTS_SUCCESS,
			data: {
				posts: result.data.rows,
				count: result.data.count
			}
		});
	} catch (e) {
		console.error(e);
		yield put({
			type: LOAD_USER_POSTS_FAILURE,
			payload: e.message
		});
	}
}

function* watchLoadUserPosts() {
	yield takeLatest(LOAD_USER_POSTS_REQUEST, loadUserPosts);
}

function loadRandomPostsAPI() {
	return axios.get(`/posts/random`);
}

function* loadRandomPosts() {
	try {
		const result = yield call(loadRandomPostsAPI);

		yield put({
			type: LOAD_RANDOM_POSTS_SUCCESS,
			payload: result.data
		});
	} catch (e) {
		console.error(e);
		yield put({
			type: LOAD_RANDOM_POSTS_FAILURE,
			payload: e.message
		});
	}
}

function* watchLoadRandomPosts() {
	yield takeLatest(LOAD_RANDOM_POSTS_REQUEST, loadRandomPosts);
}

function likePostAPI(postId) {
	return axios.post(
		`/post/${postId}/like`,
		{},
		{
			withCredentials: true
		}
	);
}

function* likePost(payload) {
	try {
		const result = yield call(likePostAPI, payload.postId);
		yield put({
			type: LIKE_POST_SUCCESS,
			data: {
				postId: payload.postId,
				userId: result.data.userId
			}
		});
	} catch (e) {
		console.error(e);
		yield put({
			type: LIKE_POST_FAILURE,
			error: e
		});
	}
}

function* watchLikePost() {
	yield takeLatest(LIKE_POST_REQUEST, likePost);
}

function unlikePostAPI(postId) {
	return axios.delete(`/post/${postId}/like`, {
		withCredentials: true
	});
}

function* unlikePost(payload) {
	try {
		const result = yield call(unlikePostAPI, payload.postId);
		yield put({
			type: UNLIKE_POST_SUCCESS,
			data: {
				postId: payload.postId,
				userId: result.data.userId
			}
		});
	} catch (e) {
		console.error(e);
		yield put({
			type: UNLIKE_POST_FAILURE,
			error: e
		});
	}
}

function* watchUnlikePost() {
	yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
}

function loadUserLikesAPI(lastId = 0, limit = 5) {
	return axios.get(`/posts/likes?lastId=${lastId}&limit=${limit}`, {
		withCredentials: true
	});
}

function* loadUserLikes(payload) {
	try {
		const result = yield call(loadUserLikesAPI, payload.lastId);

		yield put({
			type: LOAD_USER_LIKES_SUCCESS,
			data: result.data
		});
	} catch (e) {
		console.error(e);
		yield put({
			type: LOAD_USER_LIKES_FAILURE,
			payload: e.message
		});
	}
}

function* watchLoadUserLikes() {
	yield takeLatest(LOAD_USER_LIKES_REQUEST, loadUserLikes);
}

export default function* postSaga() {
	yield all([
		fork(watchAddPost),
		fork(watchScrapingForPost),
		fork(watchLoadPosts),
		fork(watchLoadPost),
		fork(watchUpdatePost),
		fork(watchRemovePost),
		fork(watchSearchPosts),
		fork(watchLoadCategoryPosts),
		fork(watchLoadUserPosts),
		fork(watchLoadRandomPosts),
		fork(watchLikePost),
		fork(watchUnlikePost),
		fork(watchLoadUserLikes)
	]);
}
