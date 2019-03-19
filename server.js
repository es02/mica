import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {schema} from './data/schema';
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

require('dotenv').config()

const APP_PORT: number = process.env.APP_PORT || "80";
const db = process.env.DB;

// Connect to MongoDB with Mongoose.
mongoose
  .connect(
    db,
    {
      useCreateIndex: true,
      useNewUrlParser: true
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const compiler: webpack.Compiler = webpack({
    mode: 'development',
    entry: ['whatwg-fetch', path.resolve(__dirname, 'js', 'app.js')],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
    output: {
        filename: 'app.js',
        path: '/',
    },
});

const app: WebpackDevServer = new WebpackDevServer(compiler, {
    contentBase: '/public/',
    publicPath: '/js/',
    stats: {colors: true},
});

// Serve static resources
app.use('/', express.static(path.resolve(__dirname, 'public')));

// Setup GraphQL endpoint
app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    graphQLHTTP({
        schema: schema,
        pretty: true,
        graphiql: true
    }),
);

app.listen(APP_PORT, () => {
    console.log(`App is now running on http://localhost:${APP_PORT}`);
});
