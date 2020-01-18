const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CheckerPlugin } = require("awesome-typescript-loader");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = (env, argv) => {
    const config = {
        entry: {
            main: "./src/index.tsx"
        },

        output: {
            filename: "[name].js",
            chunkFilename: "[name].js",
            path: path.resolve(__dirname, "dist"),
            pathinfo: false
        },

        optimization: {
            concatenateModules: false,
            splitChunks: {
                chunks: "all",
                maxInitialRequests: Infinity,
                minSize: 0,
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                        name: "vendor",
                        reuseExistingChunk: true
                    },
                    default: {
                        name: "default",
                        priority: -20,
                        reuseExistingChunk: true
                    }
                }
            }
        },

        performance: {
            hints: false,
            maxEntrypointSize: 512000,
            maxAssetSize: 512000
        },

        devtool:
            argv.mode === "development" ? "cheap-module-source-map" : "source-map",

        resolve: {
            extensions: [".ts", ".tsx", ".js", ".mjs", ".json"],
            alias: {
                "api": path.resolve(__dirname, 'src/api/'),
                "common": path.resolve(__dirname, 'src/common/'),
                "components": path.resolve(__dirname, 'src/components/'),
                "store": path.resolve(__dirname, 'src/store/'),
                "utils": path.resolve(__dirname, 'src/utils/'),
            }
        },

        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: ["awesome-typescript-loader"]
                },
                {
                    test: /\.scss$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            'css-loader',
                            'sass-loader',
                            {
                                loader: 'sass-resources-loader',
                                options: {
                                    resources: ['./src/styles/variables.scss', './src/styles/mixins.scss']
                                },
                            },
                        ]
                    })
                },
                {
                    test: /\.css$/,
                    use: [
                        "style-loader",
                        "css-loader",
                        {
                            loader: "postcss-loader",
                            options: { plugins: [require("autoprefixer")] }
                        }
                    ]
                },
                { test: /\.(png|jpg|gif|svg)$/i, use: [{ loader: 'url-loader', options: { limit: 8192 } }] },
                {
                    test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }]
                }
            ]
        },

        plugins: [
            new HtmlWebpackPlugin({
                filename: "index.html",
                template: "public/index.html"
            }),
            new ExtractTextPlugin({
                filename: 'style.css'
            }),
            new CheckerPlugin()
        ],

        devServer: {
            publicPath: 'http://127.0.0.1/',
            port: '8088',
            hot: true,
            inline: true,
            headers: { 'Access-Control-Allow-Origin': '*' },
            stats: {
                colors: true
            },
            compress: true,
            overlay: {
                warnings: true,
                errors: true
            },
            progress: true,
            stats: "errors-only",
            open: false,
            contentBase: path.join(__dirname, "public"),
            watchContentBase: true,
            watchOptions: {
                ignored: /node_modules/
            }
        },

        node: {
            fs: "empty"
        }
    };

    return config;
};