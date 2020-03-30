const path = require('path');
const MyWebpackPlugin = require('./my-webpack-plugin');
const webpack = require('webpack');
const childProcess = require('child_process'); // node modul로 터미널 명령어 실행가능
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        main: './src/app2.js'
    },
    output:{
        path: path.resolve('./dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                use: [
                    process.env.NODE_ENV === 'production'
                        ? MiniCssExtractPlugin.loader  // 프로덕션 환경
                        : 'style-loader',  // 개발 환경
                        'css-loader',
                        'sass-loader',
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader', // url-loader base 64 인코딩 하여 바로 로딩
                options:{              // file-loader 새로게 저장하여 불러옴
                    // publicPath:'./dist/', // 반환
                    name: '[name].[ext]?[hash]', // 이름.확장자  // hash는 quirystring으로 캐쉬 문제 해결
                    limit: 20000, // 20kb 이하 url-loader 이상 file-loader 사용
                }
            },
            {
                test: /\.jsx/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            }
        ]
    },
    plugins:[
        // new MyWebpackPlugin(),
        new webpack.BannerPlugin({
            banner: `
                Buile Date : ${new Date().toLocaleDateString()}
                `
                // Commit Version : ${childProcess.execSync('git rev-parse --short HEAD')}
                // Author : ${childProcess.execSync('git config user.name')}
        }),
        new webpack.DefinePlugin({ // process.env.NODE.ENV
            VERSION: JSON.stringify('v.1.2.3'),
            PRODUCTION: JSON.stringify(false),
            MAX_COUNT: JSON.stringify(999),
            'api.domain': JSON.stringify('http://dev.api.domain.com'),
        }),
        new HtmlWebpackPlugin({  // build 할때 template에 번들된 index.html 파일에 main.js를 붙쳐준다.
            template: './src/index.html',
            templateParameters: { // 템플릿에 주입할 파라매터 변수 지정
                env: process.env.NODE_ENV === 'development' ? '(개발용)' : '',
            },
            minify: process.env.NODE_ENV === 'production' ? {
                collapseWhitespace: true, // 빈칸 제거 
                removeComments: true, // 주석 제거 
            } : false,
            hash: true, // 정적 파일을 불러올때 쿼리문자열에 웹팩 해쉬값을 추가한다
        }),
        new CleanWebpackPlugin(), // dist 제거 후 재생성.
        ...(
            process.env.NODE_ENV === 'production'
                ? [new MiniCssExtractPlugin({ filename: `[name].css` })]
                : []
        ),// js 파일 용량이 클경우 브라우저 로딩 속도가 느려질수 있기 때문에, js 파일에 css를 분리하여 1개의 js파일과 1개의 css파일로 만들어 준다.
    ],
}