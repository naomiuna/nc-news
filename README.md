# nc-news - backend API project

Backend RESTful API - database containing articles, comments, topics and users.

Frontend project creating a reddit-style news site to follow.

**[*Hosted on Heroku here*](https://nt-nc-news.herokuapp.com/api)**

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Installing

Clone this repo:

```bash
git clone https://github.com/naomiuna/nc-news

cd nc-news
```

Install the dependencies (detail below):

```
npm i
```

Set up the development and test databases:

```
npm run setup-dbs
```

Seed the development database:

```
npm run seed
```

Run the app on port 9090.

```
npm start
```

## Testing

To run tests on the endpoints:

```
npm test
```

To run tests on the util functions:

```
npm test-utils
```

## API endpoints

To view all of the available endpoints in JSON format with examples, make a GET /api request.
The following endpoints are available:

```http
GET /api/topics

GET /api/users/:username

GET /api/articles/:article_id
PATCH /api/articles/:article_id

POST /api/articles/:article_id/comments
GET /api/articles/:article_id/comments

GET /api/articles

PATCH /api/comments/:comment_id
DELETE /api/comments/:comment_id

GET /api
```

### Built With

* [Node.js](https://nodejs.org/en/) v12.16.1 - JavaScript runtime environment
* [Express.js](https://expressjs.com/) v4.17.1 - web application framework
* [Knex.js](https://knexjs.org/) v0.20.13 - SQL query builder
* [PostgreSQL](https://www.postgresql.org/) v7.18.2 - relational database management

**Testing**
* [Mocha](https://mochajs.org/) v7.1.1 - test framework
* [Chai](https://www.chaijs.com/) v4.2.0 - test assertion library
* [Chai Sorted](https://www.npmjs.com/package/chai-sorted) v0.2.0 - chai plugin
* [Nodemon](https://nodemon.io/) v2.0.2 - utility to restart server
* [Supertest](https://www.npmjs.com/package/supertest) v4.0.2 - test assertion library

## Deployment

This application was deployed using heroku. Please see the heroku [getting started guide](https://devcenter.heroku.com/start) for instructions on how to deploy your version of the nc-news application onto the web.

## Author

* **[Naomi Todd]**(https://github.com/naomiuna)
