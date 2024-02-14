var express = require('express');
var router = express.Router();
var SpotifyWebApi = require('spotify-web-api-node');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
router.use(cors());
var app = express();
router.use(cors());


var spotifyApi = new SpotifyWebApi({
  clientId: '9602c1d158b24f4dbb806eb8733e8e00',
  clientSecret: process.env.clientsecret,
  redirectUri: 'http://localhost:3000/'
});

spotifyApi.clientCredentialsGrant().then(
  function(data) {
    console.log("Set Access Token");
    spotifyApi.setAccessToken(data.body['access_token']);``
  },
  function(err) {
    console.log('Something went wrong when retrieving an access token', err);
  }
);

/* GET home page. */
router.post('/', function(req, res, next) 
{
  var artistArray = [];
  var songsSnippets = [];

  console.log(req.headers.artistvalue);

  spotifyApi.searchArtists(req.headers.artistvalue)
  .then(function(data) {
    console.dir(data.body.artists.items[0].id);
          spotifyApi.getArtistRelatedArtists(data.body.artists.items[0].id)
          .then(function(data) {
            //console.log(data.body.artists);
            data.body.artists.sort((a, b) => a.popularity - b.popularity);
            const threeLeastPopular = data.body.artists.slice(0, 3);
            //console.log(threeLeastPopular);
            getTracks(threeLeastPopular);

            async function getTracks(threeData) {
              try {
                const songsData = []; // Initialize the array to store song data
                for (const artist of threeData) {
                  const topTracks = await spotifyApi.getArtistTopTracks(artist.id, 'US');
                  for (let j = topTracks.body.tracks.length - 1; j >= (topTracks.body.tracks.length - 3); j--) {
                    const track = topTracks.body.tracks[j];
                    const audioPreviewURL = await getPreviews(track.id);
                    const songData = [audioPreviewURL, artist.id, artist.id]; // Array containing preview URL, song title, and artist name
                    songsData.push(songData);
                  }
                }
                console.log(songsData); // Array of song data containing preview URL, song title, and artist name
                res.json({message: songsData});
              } catch (error) {
                 res.status(400).send({
                  message: 'This is an error!'
               });
                console.error('Error:', error);
              }
            }
            
            async function getPreviews(songID) {
              try {
                const url = `https://open.spotify.com/embed/track/${songID}`;
                const response = await axios.get(url);
                const $ = cheerio.load(response.data);
                const scriptContent = $('#__NEXT_DATA__').html();
                const jsonData = JSON.parse(scriptContent);
                const audioPreviewURL = jsonData.props.pageProps.state.data.entity.audioPreview.url;
                return audioPreviewURL;
              } catch (error) {
                console.error('Error fetching and parsing data:', error);
                throw error;
              }
            }

          }, function(err) {
            done(err);
          });

  }, function(err) {
    console.error(err);
  });
  
});

router.post('/results', function(req, res, next) 
{
  console.log("ran");
  console.log(req.headers.artistid);
  spotifyApi.getArtist(req.headers.artistid)
  .then(function(data) {
    console.log('Artist information', data.body);
    res.json({message: data.body});
  }, function(err) {
    console.error(err);
  });
  
  }, function(err) {
    console.error(err);
  });

  router.post('/similarArtists', function(req, res, next) 
{
  console.log("ran similar artists");
  console.log(req.headers.artistid);
  spotifyApi.getArtistRelatedArtists(req.headers.artistid)
  .then(function(data) {
    res.json({message: data.body});
  }, function(err) {
    done(err);
  });

  }, function(err) {
    console.error(err);
  });



module.exports = router;
