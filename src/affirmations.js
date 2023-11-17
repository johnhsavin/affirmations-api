const admin = require('firebase-admin')
const { connectFirestore } = require('./firestore')

exports.getAffirmations = (req, res) => {
  const db = connectFirestore()
  db.collection('affirmations').orderBy("created_at", "desc").get()
    .then(collection => {
      const affirmationList = collection.docs.map(doc => {
        let affirm = doc.data()
        affirm.id = doc.id
        return affirm
      })
      res.set('Cache-Control', 'public, max-age=60, s-maxage=60')
      res.send(affirmationList)
    })
    .catch(err => res.status(500).send('Error getting affirmations: ' + err.message))
}

exports.postAffirmations = (req, res) => {
  if(!req.body || !req.body.text || !req.body.displayName || !req.body.photoUrl) {
    res.status(400).send('Invalid request')
  }
  const db = connectFirestore()
  const { uid, text, displayName, photoUrl } = req.body
  const now = admin.firestore.FieldValue.serverTimestamp()
  const newAffirmation = {
    uid,
    created_at: now,
    text,
    displayName,
    photoUrl
  }
  db.collection('affirmations').add(newAffirmation)
    .then(() => {
      this.getAffirmations(req, res) // pass response to get all affirmations
    })
    .catch(err => res.status(500).send('Error posting affirmation: ' + err.message))
}