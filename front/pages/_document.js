import React from "react";
// import Helmet from "react-helmet";
import PropTypes from "prop-types";
import Document, { Main, NextScript, Head } from "next/document";
import { ServerStyleSheet } from "styled-components";

class MyDocument extends Document {
	static getInitialProps({ renderPage }) {
		// Step 1: Create an instance of ServerStyleSheet
		const sheet = new ServerStyleSheet();

		// Step 2: Retrieve styles from components in the page
		const page = renderPage(App => props => sheet.collectStyles(<App {...props} />));

		// Step 3: Extract the styles as <style> tags
		const styleTags = sheet.getStyleElement();

		// Step 4: Pass styleTags as a prop
		return { ...page, styleTags };
	}

	render() {
		return (
			<html>
				<Head>
					{/* Step 5: Output the styles in the head  */}
					<meta charSet="utf-8" />
					<meta name="viewport" content="initial-scale=1.0, width=device-width" />
					{this.props.styleTags}
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</html>
		);
	}
}

MyDocument.propTypes = {
	helmet: PropTypes.object.isRequired,
	styleTags: PropTypes.object
};

export default MyDocument;
