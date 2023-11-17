const express = require('express')
const cors = require('cors')
const { getAffirmations, postAffirmations } = require('./src/affirmations')
const PORT = process.env.PORT || 3000

const app = express()
app.use(cors())

app.get('/affirmations', getAffirmations)
app.post('/affirmations', postAffirmations)

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}...`)
})
