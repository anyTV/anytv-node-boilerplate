Node REST API Boilerplate
=====

[![Build Status](https://travis-ci.org/anyTV/anytv-node-boilerplate.svg?branch=master)](https://travis-ci.org/anyTV/anytv-node-boilerplate)
[![Coverage Status](https://coveralls.io/repos/anyTV/anytv-node-boilerplate/badge.svg?branch=master&service=github)](https://coveralls.io/github/anyTV/anytv-node-boilerplate?branch=master)
[![Dependencies](https://david-dm.org/anyTV/anytv-node-boilerplate.svg)](https://david-dm.org/anyTV/anytv-node-boilerplate)

Table of contents
-----
- [Introduction](#introduction)
- [Running the application](#running-the-application)
- [Creating a controller](#creating-a-controller)
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
  sudo npm install -g forever
  sudo npm start
  ```

5. check http://localhost
6. Update package.json repository link
7. Update config/config.js
8. Don't forget tp.


Creating a controller
-----

Controllers are the heart of your application, as they determine how HTTP requests should be handled. They are located at the `controllers` folder. They are not automatically routed. You must explicitly route them in `config/router.js`. Using sub-folders for file organization is allowed.

Here's a typical controller:

```javascript
// user.js

const util   = require(__dirname + '/../helpers/util'),
const mysql  = require('anytv-node-mysql'),
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

        mysql.use('my_db')
            .query(
                'UPDATE users SET ? WHERE user_id = ? LIMIT 1;',
                [data, id],
                send_response
            )
            .end();
    }

    function send_response (err, result) {
        if (err) {
            return next(err);
        }

        res.send({message: 'User successfully updated'});
    }

    start();
};



exports.delete_user = (req, res, next) => {
...
```

Detailed explanation:

```javascript
const config = require(__dirname + '/../config/config');
const util   = require(__dirname + '/../helpers/util');
const mysql  = require('anytv-node-mysql');
const moment = require('moment');
```

- The first part of the controller contains the config, helpers, and libraries to be used by the controller's functions
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

        mysql.use('my_db')
            .query(
                'UPDATE users SET ? WHERE user_id = ? LIMIT 1;',
                [id, data],
                send_response
            )
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

        res.send({message: 'User successfully updated'});
    }

    start();
```

- `send_response` is common to be the last function to be executed
- use `next` for passing server fault errors
- after all variable and function declarations, call `start`

Notes:
- use `res.warn(status, obj)` or `res.warn(obj)`  instead of `next(error)` if the error is caused by the API caller



## Contributing

Install the tools needed:
```sh
npm install istanbul -g
npm install apidoc -g
npm install mocha -g
npm install --dev
```

## Running test

```sh
npm test
```

## Code coverage

```sh
npm run coverage
```
Then open coverage/lcov-report/index.html.

## API documentation

```sh
npm run docs
```
Then open apidoc/index.html.

## License

MIT


## Author
[Freedom! Labs, any.TV Limited DBA Freedom!](https://www.freedom.tm)
