# Northcoders House of Games API

API written serving data from a PostgreSQL database with data on games, users, reviews and comments. 

A hosted version of this project can be found at https://sb-nc-games-app.herokuapp.com/api

<hr>

## Requirements

Northcoders House of Games API requires the following to run:

* Node.js version 18.0^
* npm version(usually comes with Node.js)
* Postgres version 14.3^

## Installation

To get started fork a copy of this repo and then clone it locally to your machine using the url of your copy.

```
git clone <url>
```

install all the dependencies using npm
```
npm install
```

Add the following files to create the environment variables:
- **.env.test** containing ```PGDATABASE=nc_games_test```
- **.env.development** containing ```PGDATABASE=nc_games```

*N.B. If you are running this on Linux, you will need to add your psql password to both of these files*
```
PGPASSWORD=<your_password>
```
Set up both the test and development databases
```
npm run setup-dbs
```
Seed local databases
```
node ./db/seeds/run-seed.js
```

Run the test suite
```
npm test app.test.js
```
<hr>

## Endpoints

### GET request endpoints

```/api```
serves up a json representing all the available endpoints for the api.

```/api/categories/```
serves up an array of all categories

```/api/reviews/``` serves up an array of all reviews

```/api/reviews/:review_id``` serves a json object of a review

```/api/reviews/:review_id/comments``` serves up an array of comments for a review

```/api/users/``` serves up an array of users

<br>

### POST request endpoints
```/api/reviews/:review_id/comments``` posts a new comment to a review, returning the new comment.

*Example POST request body*
```js
{
    "username": "dav3rid",
    "body": "I disagree, I hated this game"
}
```
<br>

### PATCH request endpoints
```/api/reviews/:review_id``` updates the votes on a review returning the updated review

```/api/comments/:comment_id``` updates the votes on a comment returning the updated comment

*Example PATCH request body*
```js
{"inc_votes": 10}
```
This can also be used to decrease votes by using a negative number
```js
{"inc_votes": -17}
```

<br>

### DELETE request endpoints
```/api/comments/:comment_id``` deletes a comment
<hr>
