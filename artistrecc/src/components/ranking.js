import React, { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import loadingImage from './Ghost.gif'; // relative path to image 
import "./ranking.css";



const RankingComponent = (props) => {
  const [items, setItems] = useState(["A", "B", "C", "D", "E", "F", "G", "H", "I"]);
  const [currentIdx, setCurrentIdx] = useState(null);
  const [songUrls, setSongURL] = useState(null);
  const [finalSongUrls, setFinalSongURL] = useState(null);
  const [artistPoints, setArtistPoints] = useState({});
  const audioRefs = useRef([]);


  useEffect(() => {
    setSongURL(props.songUrls);
  }, [props.songUrls]);

  useEffect(() => {
    if (songUrls) {
      const previewsArray = songUrls.map(songData => songData[0]);
      setFinalSongURL(previewsArray);
    }
  }, [songUrls]);

  useEffect(() => {
    if (finalSongUrls && finalSongUrls.every(url => url !== null)) {
      calculatePoints(items); // Run calculatePoints once all song URLs are loaded
    }
  }, [finalSongUrls]); // Watch for changes in finalSongUrls

  function finishedLoading() {
    props.updateIsLoading();
  }

  function nextPage() {
    props.nextPage();
  }


  function prevPage() {
    props.prevPage();
  }


  const moveItemUp = () => {
    
    const songTime = audioRefs.current[currentIdx].currentTime;

    if (currentIdx > 0) {
      const updatedItems = [...items];
      const movedItem = updatedItems.splice(currentIdx, 1)[0];
      updatedItems.splice(currentIdx - 1, 0, movedItem);
      setItems(updatedItems);

      //this moves the song sources up as well
      const updatedSongs = [...finalSongUrls];
      const movedSongs = updatedSongs.splice(currentIdx, 1)[0];
      updatedSongs.splice(currentIdx - 1, 0, movedSongs);
      setFinalSongURL(updatedSongs);

      //this moves the song data up as well
      const updatedArtist = [...songUrls];
      const movedArtist = updatedArtist.splice(currentIdx, 1)[0];
      updatedArtist.splice(currentIdx - 1, 0, movedArtist);
      setSongURL(updatedArtist);

      if (audioRefs.current[currentIdx]) {
        audioRefs.current[currentIdx].addEventListener('canplaythrough', () => {
          console.log(songTime);
          audioRefs.current[currentIdx-1].currentTime = songTime;
          console.log(audioRefs.current[currentIdx].currentTime);
          audioRefs.current[currentIdx-1].play();
           
        }, { once: true });
       }


      setCurrentIdx(currentIdx - 1); // Update currentIdx after rearranging items
      calculatePoints(updatedItems); // Recalculate points after rearranging items
    }
  };

  const moveItemDown = () => {
    const songTime = audioRefs.current[currentIdx].currentTime;

    if (currentIdx < items.length - 1) {
      const updatedItems = [...items];
      const movedItem = updatedItems.splice(currentIdx, 1)[0];
      updatedItems.splice(currentIdx + 1, 0, movedItem);
      setItems(updatedItems);

      //this moves the song sources down as well
      const updatedSongs = [...finalSongUrls];
      const movedSongs = updatedSongs.splice(currentIdx, 1)[0];
      updatedSongs.splice(currentIdx + 1, 0, movedSongs);
      setFinalSongURL(updatedSongs);

      //this moves the song data down as well
      const updatedArtist = [...songUrls];
      const movedArtist = updatedArtist.splice(currentIdx, 1)[0];
      updatedArtist.splice(currentIdx + 1, 0, movedArtist);
      setSongURL(updatedArtist);

      if (audioRefs.current[currentIdx]) {
        audioRefs.current[currentIdx].addEventListener('canplaythrough', () => {
          console.log(songTime);
          audioRefs.current[currentIdx+1].currentTime = songTime;
          console.log(audioRefs.current[currentIdx].currentTime);
          audioRefs.current[currentIdx+1].play();
           
        }, { once: true });
       }


      setCurrentIdx(currentIdx + 1); // Update currentIdx after rearranging items
      calculatePoints(updatedItems); // Recalculate points after rearranging items
    }
  };

  const pauseAllExceptIndex = (indexToKeepPlaying) => {
    audioRefs.current.forEach((audio, index) => {
      if (index !== indexToKeepPlaying && audio) {
        audio.pause();
      }
    });
  };

  const calculatePoints = (newItems) => {
    const points = {};
    newItems.forEach((item, index) => {
      const artist = songUrls[index][1];
      const id = songUrls[index][2];
      const position = newItems.indexOf(item) + 1; // Get the position of the item in the ranking
      if (!points[artist]) {
        points[artist] = 0;
      }
      // Assign points inversely proportional to the position
      points[artist] += items.length + 1 - position;
    });
    setArtistPoints(points);
    props.onPointsCalculated(points);
    console.log("Artist Points:", points);
    console.log(songUrls);
  };


  return (
    <div style={{ textAlign: 'center', paddingTop: '10px' }}>
      {!finalSongUrls &&  <img src={loadingImage} alt="music" style={{height: "120px"}}/>}
      {!finalSongUrls && <h2>Loading...</h2>}
      {finalSongUrls && (
        <div>
          {items.map((item, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: "10px 0", border: currentIdx === index ? '2px solid blue' : '1px solid black', padding: '10px', cursor: 'pointer', background: currentIdx === index ? 'rgba(0, 0, 255, 0.1)' : 'transparent' }} onClick={() => { setCurrentIdx(index); audioRefs.current[index].play(); pauseAllExceptIndex(index)} }>
              <span style={{ marginRight: '10px' }}>{item}</span>
              {songUrls ? finishedLoading() : ""}
              {finalSongUrls && <audio ref={(el) => audioRefs.current[index] = el} controls src={finalSongUrls[index]} style={{ marginLeft: "6px", marginRight: "6px", height: "36px" }}></audio>}
            </div>
          ))}
          <div>
          <div>
          <Button
      variant="contained"
      onClick={() => window.location.reload()}
      style={{ marginRight: "8px" }}

    >
      Back
    </Button> 
    <Button
      variant="contained"
      onClick={moveItemUp}
      disabled={currentIdx === null || currentIdx === 0}
      style={{ marginRight: "8px" }}
    >
      Move Up
    </Button>
    <Button
      variant="contained"
      onClick={moveItemDown}
      disabled={currentIdx === null || currentIdx === items.length - 1}
      style={{ marginRight: "8px" }}
    >
      Move Down
    </Button>
     <Button
      variant="contained"
      onClick={() => nextPage()}
    >
      Submit
    </Button> 
  </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RankingComponent;

