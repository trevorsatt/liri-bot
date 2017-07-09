var spotify = require('spotify');
var twitter = require('twitter');
var key = require('./key');
var request = require('request');


var userInput = process.argv[2];
var userChoice = process.argv[3];

var movieTitle;
var movieYear;
var movieRating;
var movieCountry;
var movieLang;
var moviePlot;
var movieActor;
var tomatoRating;
var tomatoURL;
var parsedData;


function twitterData(){

    var client = new twitter(key.twitterKey);

    var params = {  
                    screen_name: 'trevorsatt',
                    count:21
                 };

 client.get('statuses/user_timeline', params, function(error, tweets, response) {
           
            if (!error) {

                for(var i = 1; i <= 20; i++){
                  console.log('TWEET #' + i + ':');
                  console.log(tweets[i]['text']);
                  console.log('============================');
                }
            }

            else {
              console.log(error);
            }
    });
}

function spotifyData(){
      var client = new spotify(key.spotifyKey);

        if(process.argv.length >=4 || typeof userChoice === 'string') {

              spotify.search({type:'track', query: userChoice}, function(err, data){
                    
                    if(!err) {
                      displaySpotify(data);
                    }
                 
                    else {
                      throw err;
                    }
              });
        }

        else if(process.argv.length < 4) {

              spotify.search({type:'track', query: "4 AM 2 Chainz" }, function(err, data){

                  if(!err) {

                    displaySpotify(data);
                  }
               
                  else {
                    throw err;
                  }
            });
        }
}

function displaySpotify(data){
      var artists = data['tracks']['items'][1]['artists'][0]['name'];
      var album = data['tracks']['items'][1]['album']['name'];
      var songPreview = data['tracks']['items'][1]['external_urls']['spotify'];
      var track = data['tracks']['items'][1]['name'];
      
      console.log('Artist: ' + artists);
      console.log('Track: ' + track);
      console.log('Album ' + album);
      console.log('Song Preview: ' + songPreview);
}

function movieData(){
    if(process.argv.length >=4 || typeof userChoice === 'string')    
        
        request('http://www.omdbapi.com/?t=' + userChoice +'&tomatoes=true',function(error, response, body){
           
            if (!error && response.statusCode == 200) {
                  
                  parsedData = JSON.parse(body);
                  displayMovie(parsedData);
              
            }
            else{
              throw error;
            }
        });
    else if(process.argv.length < 4){
        
        request('http://www.omdbapi.com/?t=' + 'Mr. Nobody' +'&tomatoes=true',function(error, response, body){
            
            if (!error && response.statusCode == 200) {
                  parsedData = JSON.parse(body);
                  displayMovie(parsedData);
              
            }
            else {
              throw error;
            }
        });
    }
}

function displayMovie(parsedData){

      movieTitle = parsedData['Title'];
      movieYear = parsedData['Year'];
      movieRating = parsedData['imdbRating'];
      movieCountry = parsedData['Country'];
      movieLang = parsedData['Language'];
      moviePlot = parsedData['Plot'];
      movieActor = parsedData['Actors'];
      tomatoRating = parsedData['tomatoRating'];
      tomatoURL = parsedData['tomatoURL'];
      //Movie info
      console.log('Movie Title: ' + movieTitle);
      console.log('Year: ' + movieYear);
      console.log('Imdb Rating: ' + movieRating);
      console.log('Country: ' + movieCountry);
      console.log('Language: ' + movieLang);
      console.log('Plot: ' + moviePlot);
      console.log('Actor: ' + movieActor);
      console.log('Rotton Tomatoes Rating: ' + tomatoRating);
      console.log('Rotton URL: ' + tomatoURL);

}
function readData(){

var fs = require('fs');

  fs.readFile('random.txt','utf8', function(err,data){
      if(err) throw err;

      var dataSplit = data.split(',');
          userInput = dataSplit[0];
          userChoice = dataSplit[1];

      switch(userInput){

          case "my-tweets":
            twitterData();
            break;

          case "spotify-this-song":
            spotifyData();
            break;
        
          case "movie-this":
            movieData();
            break;
      }

  });

}


switch(userInput){
     
      case "do-what-it-says":
          readData();
          break;
      
      case "my-tweets":
          twitterData();
          break;
     
      case "spotify-this-song":
          spotifyData();
          break;
      
      case "movie-this":
          movieData();
          break;

      default:
          console.log('Error!!');
}