# fetch-client-api

create a fetch client api 💫

## Usage

### installation

```sh
# 🔥
yarn add fetch-client-api node-fetch

# or good old npm
npm i -S fetch-client-api node-fetch
```

### Examples

```js
const fetch = require('node-fetch')

// import lib
const { createClient } = require('./src')

// Setup your client
const TOKEN = '9c3e88c1e2a7168c8c2a4f88d13bf248f505e40df41fe3a89ee4e7d528af3c0b'
const client = createClient(fetch)({
  baseUrl: 'http://localhost:3002/json/200',
  headers: { Authorization: `Bearer ${TOKEN}` },
  queryParams: { token: 'BASDFKJASDF'}
})

// for status codes > 299 it will throw an error
// if response is json you can access by error.payload
// extra fields provided error.statusCode error.statusText

// sample request call
client.api('PUT', '/')
  .then(res => console.log('ook>', res))
  .catch(err => console.log('err>', err.payload? err.payload : err.message))

// payload of a GET request is transform to query-string
client.api.get('/', { sample: 'queryparam' })
  .then(res => console.log('ook>', res))
  .catch(err => console.log('err>', err.payload? err.payload : err.message))

// you can provide a map function and a grab function if the response is not an arrray
client.api.get('/', null, ({name}) => name, response => response.cars.currentYear)
  .then(res => console.log('ook>', res))
  .catch(err => console.log('err>', err.payload? err.payload : err.message))

// you can .get, .post, put, .delete
client.api.post('/', { sample: 'body/payload' })
  .then(res => console.log('ook>', res))
  .catch(err => console.log('err>', err.payload? err.payload : err.message))
```
