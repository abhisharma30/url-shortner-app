const express = require('express');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const ejs = require('ejs');

const app = express();
const PORT = 3000;

// In-memory storage for URL mappings
const urlDatabase = {};

// Set EJS as the view engine
app.set('view engine', 'ejs');
// Set the views directory
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: true }));

// Serve HTML form for input
app.get('/', (req, res) => {
  res.render('index', { urlDatabase });
});

// Handle form submission
app.post('/shorten', (req, res) => {
  const longUrl = req.body.url;
  const shortUrl = generateShortUrl();
  urlDatabase[shortUrl] = longUrl;
  res.redirect('/');
});

// Redirect short URLs to original URLs
app.get('/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl;
  const longUrl = urlDatabase[shortUrl];
  if (longUrl) {
    res.redirect(longUrl);
  } else {
    res.status(404).send('URL not found');
  }
});

// Generate a unique short URL
function generateShortUrl() {
  return shortid.generate();
}

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
