## NestJS Deleventus API

# Prerequisites

- Node: Node.js (version 16 or higher)
- Package manager: npm or yarn
- Postgres (version 14 or higher)
- Postman

# Installation

1. Clone the repository: git clone https://github.com/firerum/deleventus-backend.git
2. Navigate to the project directory: `cd deleventus-backend`
3. Install dependencies: `npm install` or `yarn install`
4. Copy the .env.example file to .env and update the variables with your own values.

# Running the app

`npm run start:dev`

# Usage

## Auth Routes

## sign up a user

- Send a POST request to /v1/api/auth/signup with a JSON payload containing the data.

```json
{
  "first_name": "spider-man",
  "last_name": "true",
  "email": "webspider@spider.com",
  "password": "1234"
}
```

- This returns a full user object with a valid token which can then be used to access all authenticated routes on the app

## sign in

If you are a registered user, you can

- Send a post request to /v1/api/auth/signin with a JSON payload containing the data.

```json
{
  "email": "webspider@spider.com",
  "password": "1234"
}
```

- This returns a full user object with a valid token which can then be used to access all authenticated routes on the app

## The users, events, comments, attendees are all authenticated

## Get all users

- Send a GET request to `/v1/api/users`. This will return an array list of all users.

## Get a specific user

- Send a GET request to `/v1/api/users/{id}`, where {id} is the ID of the user you want to retrieve.

## Update a user

- Send a PUT request to `/v1/api/users/{id}`, where {id} is the ID of the user you want to update.\* Include a JSON payload containing the updated user data.

```json
{
  "first_name": "John",
  "last_name": "Doe"
}
```

## Delete a user

- Send a DELETE request to `/v1/api/users/{id}`, where {id} is the ID of the user you want to delete.

## Events

Upon sign up/sign in, with a valid token, you can:

- Send a POST request to /v1/api/events with a JSON payload containing the data. e.g

```json
{
  "name": "",
  "category": "", // it can be one of [wedding, birthday, convocation or others]
  "venue": "",
  "description": "",
  "date_of_event": "",
  "visibility": "" // it can be one of [public, private]
}
```

- This returns the full event object

## Get all events

- Send a GET request to `/v1/api/events`. This will return an array list of all events.
