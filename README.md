# Drinks-API

This API allows managing different types of alcoholic beverages, specifically Beers, Spirits, and Wines.

Includes create, read, update, and delete operations, to access the API and perform secured operations, you are required to provide a valid API key through the `x-api-key` header.

## Installation
### 1. Clone this repository
    https://github.com/Unnunoctio/Rincon-del-Curao-V2.git

### 2. Install dependencies
    npm install

### 3. Create a `.env` file in the project's root folder and define the environment variables: `PORT`, `DB_URI`, and `API_KEY`
    PORT=3000
    DB_URI=URI_DATABASE
    API_KEY=YOUR_API_KEY

### 4. Start the server
    npm run start

## Endpoints
### Get Drinks
`Get api/v1/drinks`

This endpoint allows you to retrieve the drinks registered in the database.

Optional query parameters:
- `page`: Page number for paginating the results. (default value: 1)
- `limit`: Maximum number of results per page (all drinks: limit=0). (default value: 10)
- `name`: Name of the drink.
- `brand`: Brand of the drink.
- `alcoholic_grade`: Alcohol content of the drink.
- `content`: Volume of the drink in cc or ml.
- `package`: Packaging format of the drink. (e.g: Bottle, Can, Barrel, etc.)
- `category`: Type of drink (Beers, Spirits, or Wines).
- `sub_category`: Subtype related to the type. (e.g: Craft Beers, White Wines, Whiskey, etc.)

### Get Drink by id
`Get api/v1/drinks/:id`

This endpoint allows you to retrieve 1 drink by its identifier.

### Add Drink
`Post api/v1/drinks`

This endpoint allows you to add a new drink to the database.

Request body (in JSON format):
```json
{
  "name": "name of the drink",
  "brand": "brand of the drink",
  "alcoholic_grade": 0,
  "content": 350,
  "package": "Lata",
  "category": "Cervezas",
  "sub_category": "Cervezas Sin Alcohol",
  "made_in": "EEUU",
  "variety": "Ale",
  "bitterness": "25 IBU"
}
```

### Add multiple Drinks using an Excel file
`Post api/v1/drinks/excel`

This endpoint allows you to submit an Excel file with added data so that multiple drinks can be inserted simultaneously.

### Modify Drink
`Patch api/v1/drinks/:id`

This endpoint allows you to modify an existing drink by its identifier.

Request body (in JSON format):
```json
{
  "name": "new name of the drink",
  "content": 500
}
```

### Delete Drink
`Delete api/v1/drinks/:id`

This endpoint allows you to delete an existing drink by its identifier.

## Errors
The API returns the following status codes and error messages in case of issues:

- 400 Bad Request: Error in the request or invalid data.
- 401 Unauthorized: Missing or incorrect API key.
- 404 Not Found: The drink does not exist.
- 500 Internal Server Error: Internal server error.

## Contributions
Contributions are welcome. If you want to improve this project, feel free to create a pull request.