# webpack-yarn-sample
how to use webpack with yarn and npm scripts

## Initializing a new project

1. initialize project

```
yarn init -y
```

2. add webpack

```
yarn add webpack webpack-cli --dev
```

3. run webpack

```
yarn webpack
```

usually webpack will require configuration but with webpack 4 onwards it follows convention over configuration. However it is still not all that useful, if we start using more loaders and stuff

- default entry file => src/index.js
- default output file => dist/main.js

production mode

```
yarn webpack --mode development
```

adding scripts to package.json

```
"scripts": {
    "build": "webpack --mode production",
    "build:dev": "webpack --mode development"
  }
```

```
yarn build
yarn build:dev
```

```
yarn add @babel/core @babel/preset-env babel-loader --dev
```

Babel Core: it has all logic necessary for transformations and also some polyfills;
Babel Preset Env: it is able to choose the right transformations/polyfills depending on the target browser list;
Babel Loader: it will be responsible for receiving the input file from Webpack and passing it through BabelJS.

create .babelrc file with content

```json
{
  "presets": [
    "@babel/preset-env"
  ]
}
```

add browser list to package.json

this could be added to webpack config but it's better to keep it here since the webpack config is a nodejs file it tends to grow

```json
"browserslist": [
  "last 2 versions",
  "not dead"
]
```

to see list of browsers list

```
npx browserslist
```

```
yarn add webpack-dev-server html-webpack-plugin --dev
```

add plugins to webpack config file. webpack.config.js

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require('path');

module.exports = (env = {}, argv = {}) => ({
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader"
      }
    ]
  },
  plugins: [
    // Any option given to Webpack client can be captured on the "argv"
    argv.mode === "development" ? new HtmlWebpackPlugin() : null
  ].filter(
    // To remove any possibility of "null" values inside the plugins array, we filter it
    plugin => !!plugin
  )
});
```

Webpack accepts both an Object or a Function as configuration. When you provide it as a function, it will inject the env and the argv as parameters:

- env: everything the client (webpack-cli) receives under the env param comes as an env object property, e.g.:

```
--env.test or --env.customValue="Hello there!"
```

- argv: all the arguments given to webpack config that are part of the configuration schema, e.g.:

```
--mode=production
```

- change the package.json to add these option to run webpack devserver

```
"scripts": {
  "build": "webpack --mode=production",
  "start:dev": "webpack-dev-server --mode=development"
}
```

```
yarn start:dev
```

- to link the the compiled code to actual source code add this to webpack config file

```
devtool: "source-map",
```

- restart the server after adding this. you can see the actual file.

## Adding other loaders (for files other than js)

### image support

```
yarn add file-loader --dev
```

- to webpack.config.js file. in the module rules section

```
{
  test: /\.(gif|png|jpe?g|svg)$/i,
  use: 'file-loader'
}
```

- using image loader together with file loader for optimized image serving

```
yarn add image-webpack-loader --dev
```

- webpack.config.js rules will become

```
{
  test: /\.(gif|png|jpe?g|svg)$/i,
  use: [
    'file-loader',
    {
      loader: 'image-webpack-loader',
      options: {
        disable: true // Disables on development mode
      }
    }
  ]
}
```

### Audio and video support

- loading other media files. add this as a separate rule for different type of files.


```
{
  test: /\.(ogg|mp3|wav|mpe?g)$/i,
  use: 'file-loader'
}
```

### CSS support

- loading css files

```
yarn add  css-loader style-loader --dev
```

- webpack config rule


```javascript
{                
  test: [/.css$/],                
  use:[                    
   'style-loader',                  
   'css-loader'
  ]            
}
```

- css-loader take all the styles referenced in our application and convert it into string with JS module
- style-loader take this string as input and put them inside style tag in index.html


### SaaS support

- dependencies

```
yarn add node-sass sass-loader --dev
```

- wepack config change. this is like a pipeline cuz of this order of loaders matters.

```javascript
{
  test: [/.css$|.scss$/],
  use:[  
   'style-loader',
   'css-loader',
   'sass-loader'
  ]
}
```

### Styles in production

- each import adds style tag inline to the header
- to package all into single minified css file

```
yarn add mini-css-extract-plugin --dev
```

- webpack config - import

```
const MiniCssExtractPlugin = require(“mini-css-extract-plugin”);
```

- webpack config. the rule will now look like this


```javascript

{
  test: [/.css$|.scss$/],
  use: [
    argv.mode === "production"
      ? MiniCssExtractPlugin.loader
      : "style-loader",
    {
      loader: "css-loader", options: {
        sourceMap: true
      }
    },
    {
      loader: "sass-loader", options: {
        sourceMap: true
      }
    }
  ]
}
```

- webpack config. plugin section will look like this

```javascript
plugins: [
    // Any option given to Webpack client can be captured on the "argv"
    argv.mode === "development" ? new HtmlWebpackPlugin() : null,
    argv.mode === "production"
      ? new MiniCssExtractPlugin({
          filename: "[name].css",
          chunkFilename: "[id].css"
        })
      : null
  ].filter(
    // To remove any possibility of "null" values inside the plugins array, we filter it
    plugin => !!plugin
  )
```

## Keep it clean : Splitting webpack config file

- move all rules to a single file and put it under webpack folder. module.rules.js

```javascript
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => [
  {
    test: /\.js$/,
    use: "babel-loader"
  },
  {
    test: /\.(gif|png|jpe?g|svg)$/i,
    use: [
      "file-loader",
      {
        loader: "image-webpack-loader",
        options: {
          disable: true // webpack@2.x and newer
        }
      }
    ]
  },
  {
    test: /\.(ogg|mp3|wav|mpe?g)$/i,
    use: "file-loader"
  },
  {
    test: [/.css$|.scss$/],
    use: [
      argv.mode === "production"
        ? MiniCssExtractPlugin.loader
        : "style-loader",
      {
        loader: "css-loader", options: {
          sourceMap: true
        }
      },
      {
        loader: "sass-loader", options: {
          sourceMap: true
        }
      }
    ]
  }
];
```

- webpack config rules will change to 

```
module: {
  rules: require("./webpack/module.rules")(env, argv)
},
```

