require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/',(req,res)=>{
    res.render('index');
})

app.get('/artist-search',(req,res)=>{
    let artist = req.query.artist;

    spotifyApi
  .searchArtists(artist)
  .then(data => {
    console.log('The received data from the API: ', data.body.artists.items[0].images[0].url);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    let artists ={
        artist:data.body.artists.items
    }
    res.render('artist-search-results',artists);

  })
  .catch(err => console.log('The error while searching artists occurred: ', err));

  
})

app.get('/albums/:artistId', (req, res, next) => {
    // .getArtistAlbums() code goes here
    spotifyApi.getArtistAlbums(req.params.artistId)
    .then( (data)=> {
        console.log('Artist albums', data.body.items[0].images);
        let album ={
            albums:data.body.items
        }
        res.render('album',album)
        })
    .catch((err) =>console.error(err) );
  });


app.get('/tracks/:albumId',(req,res,next)=>{
    spotifyApi.getAlbumTracks(req.params.albumId)
    .then( data =>{
      console.log(data.body);
      let track ={
          tracks:data.body.items
      }
      res.render('track',track);
    }).catch( err => console.log('Something went wrong!', err));

})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
