// assumes env variables are in place in a deployed environment, only load from .env file when running locally
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const app = express()

const { auth } = require('express-openid-connect')
app.use(
  auth({
    authRequired: false,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    secret: process.env.SECRET,
    authorizationParams: {
      response_type: 'code',
    },
  }),
)
app.get('/', async (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.json(req.oidc.user)
  } else {
    res.send('Logged out')
  }
  res.end()
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
