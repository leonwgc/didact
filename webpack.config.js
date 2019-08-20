const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const argv = require('yargs').argv;
const process = require('process');
const dist = getPath('./dist');
const isProd = argv.mode === 'production';
const isDev = !isProd;
const isRunInProd = argv.env === 'prod'; //部署到生产否
const chalk = require('chalk');
const htmlsPlugins = [];

htmlsPlugins.push(
	new HtmlWebpackPlugin({
		filename: getPath('./dist/index.html'),
		template: getPath(`./index.html`),
		inject: true,
		hash: false,
		chunks: ['app', 'vendor', 'common', 'runtime']
	})
);

function getStyleLoader(useCss = false) {
	const loaders = [
		{
			loader: 'css-loader',
			options: {
				sourceMap: isDev
			}
		},
		{
			loader: 'less-loader',
			options: {
				relativeUrls: false,
				sourceMap: isDev
			}
		}
	];
	if (useCss) {
		loaders.pop();
	}
	// return extractLess.extract(loaders);
	loaders.unshift(MiniCssExtractPlugin.loader);
	return loaders;
}

function getPath(_path) {
	return path.resolve(__dirname, _path);
}

var config = {
	entry: {app: './play/index.jsx'},
	output: {
		path: dist,
		chunkFilename: `[name].[chunkhash].js`,
		filename: isDev ? '[name].js' : `[name].[chunkhash].js`,
		publicPath: isDev ? '/' : `/`
	},
	devtool: isDev ? 'source-map' : false,
	module: {
		rules: [
			{
				test: /\.less$/,
				use: getStyleLoader()
			},
			{
				test: /\.css$/,
				use: getStyleLoader(true)
			},
			{
				test: /\.(png|jpg|gif|jpeg|svg)$/,
				use: {
					loader: 'url-loader',
					options: {
						limit: isProd ? 10000 : 1,
						name: './images/[name].[hash:8].[ext]'
					}
				}
			},
			{
				test: /\.(ttf|otf|woff|woff2|eot)$/,
				use: {
					loader: 'url-loader',
					options: {
						name: './fonts/[name].[ext]',
						limit: 8192
					}
				}
			},
			{
				test: /\.html$/,
				use: {
					loader: 'html-loader',
					options: {
						minimize: false
					}
				}
			},
			{
				test: /\.json$/,
				use: 'json-loader'
			},
			{
				test: /\.jsx$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			}
		]
	},
	resolve: {
		extensions: ['.js', '.jsx'],
		alias: {
			'~': path.resolve(__dirname, './src')
		}
	},
	optimization: {
		splitChunks: {
			name: false,
			cacheGroups: {
				common: {
					name: 'common',
					chunks: 'initial',
					minChunks: 2
				},
				vendor: {
					name: 'vendor',
					test: /[\\/]node_modules[\\/]/,
					chunks: 'initial',
					priority: 10
				}
			}
		},
		runtimeChunk: {
			name: 'runtime'
		}
	},
	plugins: [
		new CleanPlugin([dist]),
		new MiniCssExtractPlugin({
			filename: `[name].[hash].css`,
			chunkFilename: `[name].[hash].css`
		}),
		new webpack.DefinePlugin({
			__client__: true,
			__production__: isRunInProd,
			__dev__: isDev
		}),
		new webpack.HashedModuleIdsPlugin({
			hashDigestLength: 20
		}),
		...htmlsPlugins
	]
};

if (isDev) {
	config.devServer = {
		disableHostCheck: true,
		contentBase: dist,
		host: '0.0.0.0',
		port: 9001,
		hot: false,
		inline: true,
		open: true,
		useLocalIp: true
	};
} else {
	config.plugins.push(new OptimizeCSSAssetsPlugin());
}

module.exports = config;
