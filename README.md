# Biwenger Balance Tracker
This is a personal application to keep track of every user balance in a Biwenger League. This document is intended for those who would like to do something similar, finding inspiration in this project.

## Infrastructure
The application is meant to run on a server, in order to be able to expose the Balances endpoint and to run the tracker CRON jobs, which retrieve the transfers and the bonuses from Biwenger periodically.
Also, all the retrieved data is stored in a MongoDB cluster which must be reachable. I personally use MongoDB Atlas.

## Configuration
The following environment variables are available to configure the application:
* **BIWENGER_BEARER**: The identification bearer of the Biwenger account that will be used for querying the Biwenger API.
* **BIWENGER_LEAGUE_ID**: The id of the Biwenger league that will be tracked.
* **BIWENGER_X_VERSION**: The version of the Biwenger API to use
* **BONUS_RETRIEVAL_LIMIT**: The number of Bonus entries to retrieve in every tracking check. This variable is **optional** and the default values is *5*. 
* **TRANSFER_RETRIEVAL_LIMIT**: The number of TRansfer entries to retrieve in every tracking check. This variable is **optional** and the default values is *5*.
* **DB_URI**: The URI to the MongoDB cluster where the documents will be stored. This URI contains the host and the credentials needed to connect to the database.
* **PORT**: The HTTP port on which the API will be exposed. This variable is automatically set by Heroku.
* **CORS_DOMAIN**: The allowed domain for CORS restriction. This should be restricted to the domain of the fornt-end app. This variable is **optional** and the default value is '*' to allow requests from any domain.
* **JWT_SECRET**: The JWT secret to generate the JWT for user autentication.

## Deployment on Heroku
The server is deployed in a Heroku web dyno, from which it exposes the Balances endpoint. The scripts in the folder *./bin* are scheduled as CRON jobs with the Heroku scheduler to run periodically.

## Run locally
To run locally in a dev environment, the project makes use of the `.dotenv` tool.
Use the following command to run the server loading the environment variables from the not-committed `.env` file:
```
node -r dotenv/config server.js
```

## Usage
Once the application is deployed and running, the endpoint **/api/balances** will provide the balances of all the users in the league in the following format:

```json
[
    {
        "biwengerId": 123456,
        "name": "Mr. Bean",
        "gain": 4375600,
        "spend": 19200216,
        "balance": -14824616
    },
    {}
]
```

TODO