/* eslint-disable prefer-const */
const express = require('express');
const os = require('os');

const app = express();

app.use(express.static('dist'));
app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));
app.listen(8080, () => console.log('Listening on port 8080!'));

app.get('/api/getVideos', (req, res) => {
  // eslint-disable-next-line no-underscore-dangle
  let _items = [];
  _items.push(
    {
      title: 'How to prepare a great beer',
      type: 'video',
      source: 'facebook',
      videoId: '1052114818157758',
      views: 4569654
    }
  );
  _items.push(
    {
      type: 'video',
      source: 'url',
      url: 'http://cdn.playbuzz.com/content/feed/video-1.mp4',
      views: 8820
    },
  );
  _items.push(
    {
      title: 'Be a winner!',
      type: 'video',
      source: 'youtube',
      views: 12451409
    }
  );
  _items.push(
    {
      title: 'Top 10 fastest cars in the world',
      type: 'video',
      source: 'youtube',
      videoId: 'h8MbhS5XKow',
      views: 25560867
    }
  );

  _items.push(
    {
      title: 'A funny dog barking',
      type: 'video',
      source: 'youtube',
      videoId: 'MveqXxB12YA',
      views: 4287171
    }
  );

  res.send(JSON.stringify({ items: _items }));
});
