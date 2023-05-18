## NestJS Deleventus API

# Prerequisites

- Node: Node.js (version 14 or higher)
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

## Create a user 

- Send a POST request to /v1/api/users with a JSON payload containing the data.

```json
{
  "first_name": "spider-man",
  "last_name": "true",
  "phone_no": "21",
  "gender": "male",
  "password": "1234",
}
```

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
