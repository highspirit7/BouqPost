const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true"
});
const webpack = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = withBundleAnalyzer({
	distDir: ".next",
	// analyzeServer: ["server", "both"].includes(process.env.BUNDLE_ANALYZE),
	// analyzeBrowser: ["browser", "both"].includes(process.env.BUNDLE_ANALYZE),
	// bundleAnalyzerConfig: {
	// 	server: {
	// 		analyzerMode: "static",
	// 		reportFilename: "../bundles/server.html"
	// 	},
	// 	browser: {
	// 		analyzerMode: "static",
	// 		reportFilename: "../bundles/client.html"
	// 	}
	// },
	webpack(config) {
		const prod = process.env.NODE_ENV === "production";

		const plugins = [...config.plugins, new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/ko$/)];
		if (prod) {
			plugins.push(new CompressionPlugin());
			// main.js.gz와 같은 식으로 .gz 확장자를 붙이고 크기는 약 3 or 4분의 1로 압축시킨다.
		}
		return {
			...config,
			mode: prod ? "production" : "development",
			devtool: prod ? "hidden-source-map" : "eval",
			plugins
		};
	}
});
