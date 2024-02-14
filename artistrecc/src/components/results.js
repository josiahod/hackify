import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import GenrePieChart from './piechart';
import Button from '@mui/material/Button';
import "./ranking.css";



function Results(props) {
  const [open, setOpen] = useState(false);
  const [artistPopup, setArtistPop] = useState(false);
  const [relatedArtists, getArtistRelatedArtists] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [showPie, setShowPie] = useState(false);
  const [top1, setTop1] = useState([]);
  const [top2, setTop2] = useState([]);
  const [top3, setTop3] = useState([]);

  useEffect(() => {
    setTop1(props.top1);
    setTop2(props.top2);
    setTop3(props.top3);
  }, [props.top1, props.top2, props.top3]);

  const handleClose = () => {
    setOpen(false);
    getArtistRelatedArtists(null)
    setArtistPop(false)
    setSelectedArtist(null);
    setShowPie(false);
  };

  const handleArtistClick = (artist) => {
    setSelectedArtist(artist);
    getRelated(artist.id);
    setArtistPop(true)
    setOpen(true);
  };

  const handlePieChart= (title) => {
    console.log(top1);
    setShowPie(true);
    console.log("ran pie chart");
    setOpen(true);
  };

  const artists = [
    {name: top1[1], image: top1[0],  song: Array.isArray(top1[2]) ? top1[2].join(", ") : top1[2], id:top1[3] },
    { name: top2[1], image: top2[0], song: Array.isArray(top2[2]) ? top2[2].join(", ") : top2[2], id:top2[3]},
    { name: top3[1], image: top3[0], song: Array.isArray(top3[2]) ? top3[2].join(", ") : top3[2], id:top3[3] }
  ];


  function getRelated(id) 
  {
    fetch("https://hackify-production.up.railway.app/similarArtists",
    {
    headers: 
    {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'artistid' : id
    },
    method: "POST",
    body: JSON.stringify({artistid: id})
    })
      .then(res => res.json()) // Parse the response body as JSON
      .then(data => {getArtistRelatedArtists(data.message.artists) }) // Update the state variable with fetched data
      .catch(error => console.error(error)); // Log any errors
  }

  
  return (
    <div style={{ margin: '5.0px' }}>
         <h3>Results</h3>
         <Dialog open={open} onClose={handleClose}PaperProps={{
                style: {
                padding: "15px", // Add padding
              //  maxWidth: "calc(50% - 40px)", // Set maxWidth to 100% minus padding
              //  width: "100%", // Set width to 100%
                //height: "calc(50%)", // Set height to 100% minus padding
                maxHeight: "50%", // Set maxHeight to 100% minus padding
                },
            }}>
        <DialogTitle style={{ backgroundColor: 'black' }}>{selectedArtist ? selectedArtist.name : ""}</DialogTitle>
        {top1[2] && showPie && <GenrePieChart genres={top1[2].concat(top2[2], top3[2])}/> }
        {artistPopup && relatedArtists === null ? (
  <p style={{ textAlign: "center", fontWeight: "bold" }}>Loading...</p>
) : (
  relatedArtists && (
    <div>
      <p style={{ textAlign: 'center', fontWeight: "bold" }}>Related Artists</p>
      <ul>
        <li>{relatedArtists[0] ? relatedArtists[0].name : ""}</li>
        <li>{relatedArtists[1] ? relatedArtists[1].name : ""}</li>
        <li>{relatedArtists[2] ? relatedArtists[2].name : ""}</li>
      </ul>
    </div>
  )
)}

       
      </Dialog>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {artists.map((artist, index) => (
          <div id="topArtists" key={index} style={{ marginBottom: '35px', display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: '1', marginRight: '20px' }}>
              <h3>{index+1 + " - "}{artist.name}</h3>
              <p>{artist.song}</p>
            </div>
            <img
              src={artist.image}
              alt={artist.name}
              style={{ width: '100px', height: '100px', cursor: 'pointer' }}
              onClick={() => handleArtistClick(artist)}
            />
          </div>
        ))}
              <Button variant="contained"  onClick={() => handlePieChart("Genre Distribution")}> See Pie Chart </Button>
      </div>
    </div>
  );
}

export default Results;
