Node REST API Boilerplate
=====

[![Build Status](https://travis-ci.org/anyTV/anytv-node-boilerplate.svg?branch=master)](https://travis-ci.org/anyTV/anytv-node-boilerplate)
[![Coverage Status](https://coveralls.io/repos/anyTV/anytv-node-boilerplate/badge.svg?branch=master&service=github)](https://coveralls.io/github/anyTV/anytv-node-boilerplate?branch=master)
[![Dependencies](https://david-dm.org/anyTV/anytv-node-boilerplate.svg)](https://david-dm.org/anyTV/anytv-node-boilerplate)
[![bitHound Dependencies](https://www.bithound.io/github/anyTV/anytv-node-boilerplate/badges/dependencies.svg)](https://www.bithound.io/github/anyTV/anytv-node-boilerplate/master/dependencies/npm)
[![bitHound Code](https://www.bithound.io/github/anyTV/anytv-node-boilerplate/badges/code.svg)](https://www.bithound.io/github/anyTV/anytv-node-boilerplate)

Table of contents
-----
- [Introduction](#introduction)
- [Running the application](#running-the-application)
- [Creating a controller](#creating-a-controller)
- [Setting environment configs](#setting-environment-configs)
- [Contributing](#contributing)
- [Running test](#running-test)
- [Code coverage](#code-coverage)
- [API documentation](#api-documentation)
- [License](#license)
- [Author](#author)

Introduction
-----
A boilerplate for REST APIs. Can also be used for server-side rendered web pages.
This project **strictly** uses the [company's JS conventions](https://github.com/anyTV/JS-conventions).

## Running the application


1. Download Zip
2. Extract to your project's folder
3. Import `database/schema.sql` and `database/seed.sql`
  ```sh
  mysql -uroot < database/schema.sql
  mysql -uroot < database/seed.sql
  ```

4. Run this commands :
  ```sh
  npm install -g grunt-cli
  npm install
  grunt #or npm run dev-server
  ```

5. check http://localhost:<config.app.PORT>
6. Update package.json details
7. Update config/config.js
8. Don't forget to pull.


Creating a controller
-----

Controllers are the heart of your application, as they determine how HTTP requests should be handled. They are located at the `controllers` folder. They are not automatically routed. You must explicitly route them in `config/router.js`. Using sub-folders for file organization is allowed.

Here's a typical controller:

```javascript
// user.js

require('app-module-path/register');

const util   = require('../helpers/util');
const mysql  = require('anytv-node-mysql');
const squel  = require('squel');
const moment = require('moment');



exports.update_user = (req, res, next) => {

    const data = util.get_data(
        {
            user_id: '',
            _first_name: '',
            _last_name: ''
        },
        req.body
    );


    function start () {
        let id;

        if (data instanceof Error) {
            return res.warn(400, {message: data.message});
        }

        id = data.user_id;
        delete data.user_id;

        const query = squel.update()
            .table('users')
            .setFields(data)
            .where('user_id = ?', id)
            .limit(1);
        
        mysql.use('my_db')
            .squel(query, send_response)
            .end();
    }


    function send_response (err, result) {
        if (err) {
            return next(err);
        }

        res.send({ message: 'User successfully updated' });
    }

    start();
};



exports.delete_user = (req, res, next) => {
...
```

Detailed explanation:

```javascript
require('app-module-path/register');

const util   = require('../helpers/util');
const mysql  = require('anytv-node-mysql');
const squel  = require('squel');
const moment = require('moment');
```

- The first part of the controller contains the helpers, and libraries to be used by the controller's functions
- The `app-module-path/register` module prevents the usage of `__dirname` in requiring local modules
- Notice the order of imported files, local files first followed by 3rd-party libraries
- This block should always be followed by at least one new line to separate them visually easily



```javascript
exports.update_user = (req, res, next) => {
```

- snake_case on exported function names
- `req` is an object from express, it contains user's request
- `res` also an object from express, use this object to respond to the request
- `next` a function from express, use this to pass to the next middleware which is the error handler


```javascript
    const data = util.get_data(
        {
            user_id: '',
            _first_name: '',
            _last_name: ''
        },
        req.body
    ),
```

- it is common to use `data` as the variable to store the parameters given by the user
- `util.get_data` helps on filtering the request payload
- putting an underscore as first character makes it optional
- non-function variables are also declared first
- new line after non-function variables to make it more readable

```javascript
    function start () {

        let id;

        if (data instanceof Error) {
            return res.warn(400, {message: data.message});
        }

        id = data.id;
        delete data.id;

        const query = squel.update()
            .table('users')
            .setFields(data)
            .where('user_id = ?', id)
            .limit(1);
        
        mysql.use('my_db')
            .squel(query, send_response)
            .end();
    }
```

- `start` function is required for uniformity
- the idea is to have the code be readable like a book, from top-to-bottom
- since variables are declared first and functions are assigned to variables, we thought of having `start` function to denote the start of the process
- as much as possible, there should be no more named functions inside this level except for `forEach`, `map`, `filter`, and `reduce`. If lodash is available, use it.

```javascript
    function send_response (err, result) {

        if (err) {
            return next(err);
        }

        res.send({ message: 'User successfully updated' });
    }

    start();
```

- `send_response` is common to be the last function to be executed
- use `next` for passing server fault errors
- after all variable and function declarations, call `start`

Notes:
- use `res.warn(status, obj)` or `res.warn(obj)`  instead of `next(error)` if the error is caused by the API caller


## Setting environment configs

The default configuration uses `development`. Any changes on the files inside that folder will be ignored.
If you want your config to be added on the repo permanently, add it on `config.js`.
Just make sure that it's not confidential.

`production` is a dedicated config folder for the production environment. Use it via setting `$NODE_ENV` to `production`
```sh
export NODE_ENV=production
```


## Contributing

Install the tools needed:
```sh
npm install istanbul -g
npm install apidoc -g
npm install mocha -g
npm install --only=dev
```

## Production Config
- Please take a look at [Production Config Cleanup Guide](https://docs.google.com/document/d/1Mb1I0jg1ICVZrsGC4NoucKmf115J5-Yk6PWeWgdkPiY/edit#)
- For production config, it should be added as a submodule.
```sh
git submodule add -b <branch> <https repository> config/env/production
```
- Whenever there are changes in production, you should update the submodule too.
```sh
git submodule init
git submodule foreach git pull
```


## Running test

```sh
npm test
# or
grunt test
```

## Test Driven Development (TDD)

- Use npm scripts or grunt tasks that watches the tests.
```sh
npm run dev-tests
# or
grunt dev-tests
```

## Code coverage

```sh
npm run coverage
```
Then open `coverage/lcov-report/index.html`.

## API documentation

```sh
npm run docs
```
Then open `apidoc/index.html`.

## License

MIT


## Author
[Freedom! Labs, any.TV Limited DBA Freedom!](https://www.freedom.tm)
