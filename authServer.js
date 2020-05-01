require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json())

let refreshTokens = []

app.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, senha) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: senha.name })
    res.json({ accessToken: accessToken })
  })
})


app.post('/acesso', (req, res) => {
  // Authenticate User

  const email = req.body.email
  const senha = { name: email }

  const accessToken = generateAccessToken(senha)
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
  refreshTokens.push(refreshToken)
  res.json({ accessToken: accessToken, refreshToken: refreshToken })
})

function generateAccessToken(senha) {
  return jwt.sign(senha, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
}

app.listen(4000)