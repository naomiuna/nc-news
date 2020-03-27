# nc-news - backend API project

Backend RESTful API - a database containing articles, comments, topics and users.

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

Install the dependencies:

```
npm i
```

Set up the development and test databases :

```
npm run setup-dbs
```

Seed the development database:

```
npm run seed
```

Run the app. It will run on http://localhost:9090

```
npm start
```

To view all of the available endpoints in JSON format, make a GET /api request.

## Testing

To run tests on the endpoints, type the following in your terminal:

```
npm test
```

To run tests on the util functions:

```
npm test-utils
```

## API endpoints

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

* [Node.js](https://nodejs.org/en/) - JavaScript runtime environment
* [Express.js](https://expressjs.com/) - web application framework
* [Knex.js](https://knexjs.org/) - SQL query builder
* [PostgreSQL](https://www.postgresql.org/) - relational database management
* [Insomnia](https://insomnia.rest/) - can be used to make requests to the server

**Testing**
* [Mocha](https://mochajs.org/) - test framework
* [Chai](https://www.chaijs.com/) - test assertion library
* [Chai Sorted](https://www.npmjs.com/package/chai-sorted). - chai plugin
* [Nodemon](https://nodemon.io/) - utility to restart server
* [Supertest](https://www.npmjs.com/package/supertest) - test assertion library

## Author

* **Naomi Todd** - [naomiuna](https://github.com/naomiuna)
