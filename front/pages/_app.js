import React from "react";
import Head from "next/head";
import PropTypes from "prop-types";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import { applyMiddleware, compose, createStore } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import axios from "axios";
import App from "next/app";

import AppLayout from "../components/AppLayout";
import reducer from "../redux/modules";
import rootSaga from "../redux/sagas";
import { LOAD_USER_REQUEST } from "../redux/modules/user";
import { LOAD_CATEGORIES } from "../redux/modules/categories";

class BouqPost extends App {
	render() {
		const { Component, store, pageProps } = this.props;
		return (
			<Provider store={store}>
				<Head>
					<meta charSet="utf-8" />
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no viewport-fit=cover"
					/>
					<meta name="description" content="서평 및 독서 관련 글 공유 서비스" />
					<meta name="keywords" content="졸꾸,독서,서평,글쓰기,책,빡독" />
					<meta property="og:type" content="website" />
					<meta property="og:title" content="BouqPost - 졸꾸러기를 위한 콘텐츠 공유 서비스" />
					<meta property="og:description" content="서평 및 독서 관련 글 공유 서비스" />
					<meta property="og:url" content="http://bouqpost.xyz"></meta>
					<meta name="author" content="Jiyeol Lee" />
					<title>BouqPost - 졸꾸러기를 위한 콘텐츠 공유 서비스</title>
					<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.23.6/antd.css" />
				</Head>
				<style jsx global>{`
					body {
						background: #f0f2f5;
					}
				`}</style>
				<AppLayout>
					<Component {...pageProps} />
				</AppLayout>
			</Provider>
		);
	}
}

BouqPost.propTypes = {
	Component: PropTypes.elementType.isRequired,
	store: PropTypes.object.isRequired,
	pageProps: PropTypes.object.isRequired
};

BouqPost.getInitialProps = async context => {
	//Component는 자식 컴포넌트 객체(로드될) and ctx는 부모 컴포넌트(_app) 컨텍스트 객체
	const { ctx, Component } = context;
	let pageProps = {};
	const state = ctx.store.getState();

	//프론트 서버에서 백엔드 서버로 요청시 브라우저(알아서 쿠키 넣어줌)가 개입하는 것이 아니기 때문에 직접 쿠키를 axios로 요청 시 넣어서 보내준다.
	const cookie = ctx.isServer ? ctx.req.headers.cookie : "";

	if (ctx.isServer && cookie) {
		// axios.defaults.headers.Cookie = "";
		axios.defaults.headers.Cookie = cookie;
	}

	//유저 정보 로드하는 액션 먼저 취하고 그 다음 자식 컴포넌트들의 getInitialProps가 실행된다. 원하는 동작 의도대로 순서 잘 맞추어야 한다.
	if (!state.user.myInfo) {
		ctx.store.dispatch({
			type: LOAD_USER_REQUEST
		});
	}

	ctx.store.dispatch({
		type: LOAD_CATEGORIES
	});

	if (Component.getInitialProps) {
		//최상위 부모 컴포넌트가 자신의 컨텍스트(ctx)를 자식 컴포넌트에게 넘겨주는 코드로 보인다..
		//pageProps 인자를 isRequired로 해놓았기때문에 존재하지 않을 때 빈 객체라도 세팅.
		pageProps = (await Component.getInitialProps(ctx)) || {};
	}
	// console.log(pageProps);
	return { pageProps };
};

const configureStore = (initialState, options) => {
	const sagaMiddleware = createSagaMiddleware();
	const middlewares = [sagaMiddleware];

	//실제 배포말고 개발환경에서만 리덕스 devtool 사용가능하도록 설정
	const enhancer =
		// process.env.NODE_ENV === "production"
		// 	? compose(applyMiddleware(...middlewares))
		// 	: compose(
		// 			applyMiddleware(...middlewares),
		// 			!options.isServer && typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== "undefined"
		// 				? window.__REDUX_DEVTOOLS_EXTENSION__()
		// 				: f => f
		//     );

		compose(
			applyMiddleware(...middlewares),
			!options.isServer && typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== "undefined"
				? window.__REDUX_DEVTOOLS_EXTENSION__()
				: f => f
		);
	const store = createStore(reducer, initialState, enhancer);

	/**
	 * next-redux-saga depends on `sagaTask` being attached to the store.
	 * It is used to await the rootSaga task before sending results to the client.
	 */
	store.sagaTask = sagaMiddleware.run(rootSaga);
	return store;
};

export default withRedux(configureStore)(withReduxSaga(BouqPost));
