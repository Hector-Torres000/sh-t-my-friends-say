const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const PORT = 8001;
require('dotenv').config();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const dbConnectionStr = process.env.DB_string;
const client = new MongoClient(dbConnectionStr, { useUnifiedTopology: true });

app.get('/', async (request, response) => {
  let data = await client
    .db('friend-quote')
    .collection('quote')
    .find()
    .toArray();
  return response.render('index.ejs', { quotes: data });
});

client.connect((err) => {
  if (err) {
    console.error(err);
    return false;
  }
  app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

app.post('/addQuote', async (request, response) => {
  const reqData = {
    friend: request.body.friend,
    quote: request.body.quote,
  };
  let data = await client
    .db('friend-quote')
    .collection('quote')
    .insertOne(reqData);
  console.log('Shit Quote Added');
  return response.redirect('/');
});

// app.put('/addOneLike', (request, response) => {
//   db.collection('rappers')
//     .updateOne(
//       {
//         stageName: request.body.stageNameS,
//         birthName: request.body.birthNameS,
//         likes: request.body.likesS,
//       },
//       {
//         $set: {
//           likes: request.body.likesS + 1,
//         },
//       },
//       {
//         sort: { _id: -1 },
//         upsert: true,
//       }
//     )
//     .then((result) => {
//       console.log('Added One Like');
//       response.json('Like Added');
//     })
//     .catch((error) => console.error(error));
// });

// app.delete('/deleteRapper', (request, response) => {
//   db.collection('rappers')
//     .deleteOne({ stageName: request.body.stageNameS })
//     .then((result) => {
//       console.log('Rapper Deleted');
//       response.json('Rapper Deleted');
//     })
//     .catch((error) => console.error(error));
// });
