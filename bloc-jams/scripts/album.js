var setSong = function (songNumber) {

    if (currentSoundFile) {
        currentSoundFile.stop();
    }

    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: [ 'mp3' ],
        preload: true
    });
    setVolume(currentVolume);
};

var setVolume = function (volume) {
  if (currentSoundFile) {
      currentSoundFile.setVolume(volume);
  }
};

var getSongNumberCell = function (number) {
  return $('.song-item-number[data-song-number="' + number + '"]');
};

var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     var $row = $(template);

     var clickHandler = function () {

         var songNumber = parseInt($(this).attr('data-song-number'));

         if (setSong !== null) {
             var currentlyPlayingCell = getSongNumberCell(setSong);
             currentlyPlayingCell.html(setSong);
         }
         if (setSong !== songNumber) {
             setSong = songNumber;
             currentSoundFile.play();
             $(this).html(pauseButtonTemplate);
             currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
             updatePlayerBarSong();
         } else if (setSong === songNumber) {
             if (currentSoundFile.isPaused()) {
                    $(this).html(pauseButtonTemplate);
                    $('.main-controls .play-pause').html(playerBarPauseButton);
                    currentSoundFile.play();
                 } else {
                    $(this).html(playButtonTemplate);
                    $('.main-controls .play-pause').html(playerBarPlayButton);
                    currentSoundFile.pause();
                }
            }
        };

     var onHover = function (event) {
         var songNumberCell = $(this).find('.song-item-number');
         var songNumber = songNumberCell.attr('data-song-number');

         if (songNumber !== setSong) {
             songNumberCell.html(playButtonTemplate);
         }
     };

     var offHover = function (event) {
       var songNumberCell = $(this).find('.song-item-number');
       var songNumber = songNumberCell.attr('data-song-number');

         if (songNumber !== setSong) {
           songNumberCell.html(songNumber);
       }
     };

     
     $row.find('.song-item-number').click(clickHandler);
     $row.hover(onHover, offHover);
     return $row;
 };

var $albumTitle = $('.album-view-title');
var $albumArtist = $('.album-view-artist');
var $albumReleaseInfo = $('.album-view-release-info');
var $albumImage = $('.album-cover-art');
var $albumSongList = $('.album-view-song-list');

  var setCurrentAlbum = function(album) {
      currentAlbum = album;
      $albumTitle.text(album.title);
      $albumArtist.text(album.artist);
      $albumReleaseInfo.text(album.year + ' ' + album.label);
      $albumImage.attr('src', album.albumArtUrl);

     $albumSongList.empty();

     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
 };

  var trackIndex = function (album, song) {
    return album.songs.indexOf(song);
  };

 var updatePlayerBarSong = function() {

     $('.currently-playing .song-name').text(currentSongFromAlbum.title);
     $('.currently-playing .artist-name').text(currentAlbum.artist);
     $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);

     $('.main-controls .play-pause').html(playerBarPauseButton);
 };

  var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
  var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
  var playerBarPlayButton = '<span class="ion-play"></span>';
  var playerBarPauseButton = '<span class="ion-pause"></span>';


  // store the current playing song
 var currentAlbum = null;
 var setSong = null;
 var currentSongFromAlbum = null;
 var currentSoundFile = null;
 var currentVolume = 80;

 var $previousButton = $('.main-controls .previous');
 var $nextButton = $('.main-controls .next');

 var previousSong = function () {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // decrement the song number
     currentSongIndex --;

     if (currentSongIndex < 0) {
         currentSongIndex = currentAlbum.songs.length -1;
     }

     // save the last song number
     var lastSongNumber = setSong;

     // set the new current song
     setSong = currentSongIndex + 1;
     currentSoundFile.play();
     currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

     // update the player bar
     updatePlayerBarSong();

     $(".main-controls .play-pause").html(playerBarPauseButton);

     var $previousSongNumberCell =  getSongNumberCell(setSong);
     var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

     $previousSongNumberCell.html(pauseButtonTemplate);
     $lastSongNumberCell.html(lastSongNumber);
 };

 var nextSong = function () {
   var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
   // increment the song number
     currentSongIndex++;

     if (currentSongIndex >= currentAlbum.songs.length) {
         currentSongIndex = 0;
     }

     // save the last song number before changing it
     var lastSongNumber = setSong;

     // set a new current song
     setSong = currentSongIndex + 1;
     currentSoundFile.play();
     currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

     // update the player bar
     updatePlayerBarSong();

     var $nextSongNumberCell = getSongNumberCell(setSong);
     var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

     $nextSongNumberCell.html(pauseButtonTemplate);
     $lastSongNumberCell.html(lastSongNumber);
 };


 $(document).ready(function () {
         setCurrentAlbum(albumPicasso);
         $previousButton.click(previousSong);
         $nextButton.click(nextSong);
     });

     var albums = [albumPicasso, albumMarconi, albumCher];
     var index = 1;

     // albumImage.addEventListener
     $albumImage.on("click", function(event) {
        setCurrentAlbum(albums[index]);
        index++;
        if (index == albums.length) {
            index = 0;
        }
     });

