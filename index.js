const express = require('express');
const axios = require('axios');
const ejs = require('ejs');
const path = require('path');

const app = express();
const port = 3000;
app.use(express.static("public"));
const apiKey = 'AIzaSyBayyWeJS7xX-f1pSFeyl6M0hYkeR8k3Lg';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

async function getRandomBook() {
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const randomPage = Math.floor(Math.random() * 1000) + 1;

      const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=javascript&key=${apiKey}&country=US&startIndex=${randomPage}`;

      const response = await axios.get(apiUrl);

      if (response.data.items && response.data.items.length > 0) {
        const book = response.data.items[0].volumeInfo;

        const bookInfo = {
          title: book.title,
          authors: book.authors ? book.authors.join(', ') : 'Unknown',
          publishDate: book.publishedDate || 'Unknown',
          coverURL: book.imageLinks ? book.imageLinks.thumbnail : 'Not available',
          googleBooksURL: book.infoLink
        };

        return bookInfo;
      }
    } catch (error) {
      console.error(`Error fetching random book information (Attempt ${attempt}):`, error.message);
    }
  }

  throw new Error('Unable to fetch book information after multiple attempts');
}

app.get('/', async (req, res) => {
  try {
    const bookInfo = await getRandomBook();

    res.render('index.ejs', { bookInfo });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Internal Server Error');
  }
});




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
