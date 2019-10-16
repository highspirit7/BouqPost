import React from "react";
import Head from "next/head";
import PropTypes from "prop-types";
import withRedux from "next-redux-wrapper";
import { applyMiddleware, compose, createStore } from "redux";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";

import AppLayout from "../containers/AppLayout";
import reducer from "../redux/modules";
import rootSaga from "../redux/sagas";

const BouqPost = ({ Component, store }) => {
  
	return (
		<Provider store={store}>
			<Head>
				<title>BouqPost</title>
				<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.23.6/antd.css" />
			</Head>
			<AppLayout>
				<Component />
			</AppLayout>
		</Provider>
	);
};

BouqPost.propTypes = {
	Component: PropTypes.elementType.isRequired,
	store: PropTypes.object.isRequired
};

const configureStore = (initialState, options) => {
	const sagaMiddleware = createSagaMiddleware();
	const middlewares = [sagaMiddleware];

	//실제 배포말고 개발환경에서만 리덕스 devtool 사용가능하도록 설정
	const enhancer =
		process.env.NODE_ENV === "production"
			? compose(applyMiddleware(...middlewares))
			: compose(
					applyMiddleware(...middlewares),
					!options.isServer && typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== "undefined"
						? window.__REDUX_DEVTOOLS_EXTENSION__()
						: f => f
			  );
	const store = createStore(reducer, initialState, enhancer);
	sagaMiddleware.run(rootSaga);
	return store;
};

export default withRedux(configureStore)(BouqPost);
