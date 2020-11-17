const functions = require('firebase-functions');
const algoliasearch = require('algoliasearch');

const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;

const client = algoliasearch(APP_ID, ADMIN_KEY)
const index = client.initIndex('actors')

exports.addToIndex = functions.firestore.document(`actors/{actorId}`)
    .onCreate(snapshot => {
        const data = snapshot.data()
        const objectID = snapshot.id
        return index.saveObject({ ...data, objectID })
    })

exports.updateIndex = functions.firestore.document(`actors/{actorId}`)
    .onUpdate(change => {
        const newData = change.after.data()
        const objectID = change.after.id
        return index.saveObject({ ...newData, objectID })
    })

exports.deleteIndex = functions.firestore.document(`actors/{actorId}`)
    .onDelete(snapshot => index.deleteBy({objectID: snapshot.id}))
