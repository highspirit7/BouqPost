import React from "react";
// import Helmet from "react-helmet";
import PropTypes from "prop-types";
import Document, { Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";

class MyDocument extends Document {
	static async getInitialProps(context) {
		//styled component를 SSR로 적용하기 위해서 getInitialProps 내에서 세팅이 필요.
		//이렇게 해주기 전에는 새로고침 시 styled component의 css가 적용이 되지 않은채로 잠깐 보여지는 현상이 발생한다. SSR이 적용된 컴포넌트들이 css 스타일 없이 html 뼈대만 갖춘채 렌더링되기 때문.
		const sheet = new ServerStyleSheet();
		const originalRenderPage = context.renderPage;

		try {
			//_document.js가 _app.js의 상위 컴포넌트인데 _app.js에서 사용되는 getInitialProps가 제대로 동작하려면 _document.js에서도 하위 컴포넌트인 App(_app.js)을 렌더링해주는 부분이 있어야 한다.
			context.renderPage = () =>
				originalRenderPage({
					enhanceApp: App => props => sheet.collectStyles(<App {...props} />)
				});

			const initialProps = await Document.getInitialProps(context);

			return {
				...initialProps,
				// helmet: Helmet.renderStatic(),
				styles: (
					<>
						{initialProps.styles}
						{sheet.getStyleElement()}
					</>
				)
			};
		} finally {
			sheet.seal();
		}

		// const page = context.renderPage(App => props => sheet.collectStyles(<App {...props} />));
		// console.log(page);
		// const styleTags = sheet.getStyleElement();
		// return { ...page, helmet: Helmet.renderStatic(), styleTags };
	}

	// render() {
	// 	//아래와 같이 html이나 body 태그 등에 직접 attributes 세팅해주고 하려면 next에서는 _document.js 파일을 생성해야 해야 한다.
	// 	//근본적으로 위와 같이 해주는 이유는 검색엔진 봇에 검색될 수 있게 하기 위함. 결국 SEO
	// 	//<Main />은 각 라우트에 해당하는 페이지가 렌더링되는 부분이며,
	// 	//<NextScript />는 Next.js 관련한 자바스크립트 파일이다.
	// 	return (
	// 		<html>
	// 			<head>
				
	// 			</head>
	// 			<body>
	// 				<Main />
	// 				<NextScript />
	// 			</body>
	// 		</html>
	// 	);
	// }
}

MyDocument.propTypes = {
	helmet: PropTypes.object.isRequired,
	styleTags: PropTypes.object
};

export default MyDocument;
