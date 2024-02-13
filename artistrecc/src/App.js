import './App.css';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Ranking from './components/ranking.js';
import Results from './components/results.js';

function App() {
  const [step, setStep] = useState(0);
  const [songsURL, setSongURL] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [typedArtist, setArtist] = useState("");
  const [artistPoints, setArtistPoints] = useState({});
  const [top1, setArt1] = useState([]);
  const [top2, setArt2] = useState([]);
  const [top3, setArt3] = useState([]);


  const updateIsLoading = () => {
    setLoading(false);
  };

  const doGoNext = () => {
    handleNext();
  };

  const goBack = () => {
    handleBack();
  };

  const handlePointsCalculated = (points) => {
    setArtistPoints(points);
  };



   function getSongs() 
  {
    setLoading(true);
    fetch("http://localhost:9000/",
    {
    headers: 
    {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'artistValue' : typedArtist
    },
    method: "POST",
    body: JSON.stringify({artist: typedArtist})
    })
      .then(res => res.json()) // Parse the response body as JSON
      .then(data => setSongURL(data.message)) // Update the state variable with fetched data
      .catch(error => console.error(error)); // Log any errors
  }
  
  function getTopImages() 
  {
    fetch("http://localhost:9000/results",
    {
    headers: 
    {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'artistid' : Object.keys(artistPoints)[0]
    },
    method: "POST",
    body: JSON.stringify({artistid: typedArtist})
    })
      .then(res => res.json()) // Parse the response body as JSON
      .then(data => {setArt1([data.message.images[1].url, data.message.name, data.message.genres, data.message.id]); }) // Update the state variable with fetched data
      .catch(error => console.error(error)); // Log any errors
  }

  function getTopImages2() 
  {
    fetch("http://localhost:9000/results",
    {
    headers: 
    {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'artistid' : Object.keys(artistPoints)[1]
    },
    method: "POST",
    body: JSON.stringify({artistid: typedArtist})
    })
      .then(res => res.json()) // Parse the response body as JSON
      .then(data => {setArt2([data.message.images[1].url, data.message.name, data.message.genres, data.message.id]); }) // Update the state variable with fetched data
      .catch(error => console.error(error)); // Log any errors
  }

  function getTopImages3() 
  {
    fetch("http://localhost:9000/results",
    {
    headers: 
    {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'artistid' : Object.keys(artistPoints)[2]
    },
    method: "POST",
    body: JSON.stringify({artistid: typedArtist})
    })
      .then(res => res.json()) // Parse the response body as JSON
      .then(data => {setArt3([data.message.images[1].url, data.message.name, data.message.genres, data.message.id]); }) // Update the state variable with fetched data
      .catch(error => console.error(error)); // Log any errors
  }
  

  const steps = [
    { 
      component: (
        <div>
          <h1 style={{  margin: "0px"}}>Hackify</h1>
          <div className="ol-container">
          <ol>
            <li>Type in your favorite artist.</li>
            <li>You’ll be given nine quick snippets of songs based on your artist.</li>
            <li>Quickly discover new music and artists by ranking the snippets from top to bottom!</li>
          </ol>
          </div>
          <Box className="textField-container" >
          <TextField 
            id="artist-input" 
            label="Enter Artist Here" 
            variant="outlined" 
            onChange={e => setArtist(e.target.value)}
            fullWidth // Optionally, this prop ensures the TextField takes up the full width of its container
            InputProps={{ style: { fontSize: '3em'} }} // Optionally, adjust the font size
          />
        </Box>

        </div>
      ), 
      nextStep: () => {getSongs(); return 1 ;}
    },
    { 
      component: <Ranking songUrls={songsURL} updateIsLoading={updateIsLoading} onPointsCalculated={handlePointsCalculated} nextPage={doGoNext} prevPage={goBack}/>, 
      nextStep: 2
    },
    { 
      component: <Results top1={top1} top2={top2} top3={top3} />, 
      nextStep: () => {
        return 3; // Return the index of the next step
      }
    }
  ];
  

  const handleBack = () => {
    //window.location.reload();
    setLoading(false);
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleNext = () => {
    if(step === 1 )
    {
      getTopImages();
      getTopImages2();
      getTopImages3();

    }
    if (steps[step]?.nextStep !== null) {
      setStep(steps[step]?.nextStep);
    }
  };

  return (
    <Box
    className="app-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {steps[step]?.component}

      <Box mt={2}>
  {step > 0 && step !== 1 && (
    <Button variant="contained" onClick={handleBack} style={{ fontSize: '1.2em', padding: '10px 20px', marginRight: '10px' }}>
      Back
    </Button>
  )}
  {step < steps.length - 1 && !isLoading && step !== 1 && (
    <Button variant="contained" onClick={handleNext} style={{ fontSize: '1.2em', padding: '10px 20px' }}>
      Next
    </Button>
  )}
</Box>

    </Box>
  );
}

export default App;
