require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose')
const dns = require("dns");
const Url = require('./model/url')

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
app.post('/api/shorturl', (req, res) => {
  const hostname = new URL(req.body.url).hostname;
  dns.lookup(hostname, async (err, address, family) => {
    if (err) {
      res.json({ error: "invalid url" });
    } else {
      const { _id: id } = await Url.create(req.body)
       res.status(201).json({ originalUrl: req.body.url, shortUrl: id })
    }
  })
  app.get('/api/shorturl/:id', async (req, res) => {

    const { url } = await Url.findOne({ _id: req.params.id })
    // console.log(id)
  res.redirect(url)
})
  

})
app.listen(port,async () => {
  try {
    // await mongoose.connect(process.env.MONGO_URI)
    await mongoose.connect(
      process.env.MONGO_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`Listening on port ${port}`);
  } catch (error) {
    console.log(error);
  }
})
