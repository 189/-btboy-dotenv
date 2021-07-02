


The package is a zero-dependency module that loads environment variables from files named `.env`、`.env.[process.env.NODE_ENV].local`、`.env.[process.env.NODE_ENV]` and so on into `process.env`

Read priority: `.env.[process.env.NODE_ENV]` > `.env.local` > `.env`


Now we suppose that you have set `process.env.NODE_ENV = "development"`, and then the pkg will read `.env.development`  `.env.local` `.env` one by one, ingore files which not exist, parse variable and value from those files, at last put into `process.env`


#### Install

```shell
$ npm install -i @btboy/dotenv
```


#### Usage

```js
import initEnv from "@btboy/dotenv";

initEnv({});
```


#### Options
##### cwd
Default: `process.cwd()`

You may specify a custom path your `.env` files. the module will find them here.

```
initEnv({cwd: process.cwd()});
```

##### Debug
Default: `false`

You may turn on logging to help debug why certain keys or values are not being set as you expect.

```
initEnv({Debug: true });
```
##### encoding
Default: `utf8`
You may specify the encoding of your file containing environment variables.

```
initEnv({encoding: `utf8` });
```




