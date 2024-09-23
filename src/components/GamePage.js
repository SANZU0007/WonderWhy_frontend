import React, { useState, useEffect } from 'react';
import { FaHandRock, FaHandPaper, FaHandScissors, FaHistory } from 'react-icons/fa';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ResultsTable from './ResultTable';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const options = [
  { name: 'Stone', icon: <FaHandRock />, beats: 'Scissors' },
  { name: 'Paper', icon: <FaHandPaper />, beats: 'Stone' },
  { name: 'Scissors', icon: <FaHandScissors />, beats: 'Paper' },
];

function getRandomChoice() {
  return options[Math.floor(Math.random() * options.length)];
}

function determineWinner(choice1, choice2) {
  if (choice1.name === choice2.name) return 'Tie';
  if (choice1.beats === choice2.name) return 'Player 1';
  return 'Player 2';
}

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function GamePage() {
  const [rounds, setRounds] = useState([]);
  const [playerNames, setPlayerNames] = useState({ player1: '', player2: '' });
  const [currentRound, setCurrentRound] = useState(1);
  const [player1Choice, setPlayer1Choice] = useState(null);
  const [player2Choice, setPlayer2Choice] = useState(null);
  const [winner, setWinner] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openNameDialog, setOpenNameDialog] = useState(false); // Initialize as false

  // UseEffect to show the name dialog only once when the component mounts
  useEffect(() => {
    setOpenNameDialog(true);
  }, []);

  const handlePlayerClick = () => {
    const choice1 = getRandomChoice();
    const choice2 = getRandomChoice();
    setPlayer1Choice(choice1);
    setPlayer2Choice(choice2);
    const roundWinner = determineWinner(choice1, choice2);
    setWinner(roundWinner);
    
    setRounds(prevRounds => [
      ...prevRounds,
      {
        round: currentRound,
        player1: { name: playerNames.player1, choice: choice1 },
        player2: { name: playerNames.player2, choice: choice2 },
        winner: roundWinner === 'Player 1' ? playerNames.player1 : roundWinner === 'Player 2' ? playerNames.player2 : "No one"
      },
    ]);

    setAlertMessage(roundWinner === 'Tie' 
      ? "It's a Tie!" 
      : `${roundWinner === 'Player 1' ? playerNames.player1 : playerNames.player2} wins this round!`
    );
    setOpenSnackbar(true);

    if (currentRound >= 6) {
      handlePostRounds(); // Make API call when game is over
      setOpenDialog(true); // Open dialog when game is over
    } else {
      setCurrentRound(prevRound => prevRound + 1);
    }
  };

  const handlePostRounds = async () => {
    try {
      await axios.post('https://wonderwhy-backend.onrender.com/api/rounds', rounds);
      console.log('Rounds saved successfully!');
    } catch (error) {
      console.error('Error saving rounds:', error);
    }
  };

  const resetGame = () => {
    setRounds([]);
    setCurrentRound(1);
    setPlayer1Choice(null);
    setPlayer2Choice(null);
    setWinner(null);
    setOpenDialog(false);
    setOpenSnackbar(false);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    resetGame(); // Reset game when dialog closes
  };

  const handleNameSubmit = () => {
    if (playerNames.player1 && playerNames.player2) {
      setOpenNameDialog(false); // Close name input dialog when names are entered
    }
  };

  const player1Wins = rounds.filter(r => r.winner === playerNames.player1).length;
  const player2Wins = rounds.filter(r => r.winner === playerNames.player2).length;

  let finalWinnerName;
  if (player1Wins > player2Wins) {
    finalWinnerName = playerNames.player1;
  } else if (player2Wins > player1Wins) {
    finalWinnerName = playerNames.player2;
  } else {
    finalWinnerName = "No one"; // In case of a tie
  }


const navigate = useNavigate()

  return (
    <div className="App" style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Stone Paper Scissors</h1>
      <FaHistory className='add-website-btn' onClick={()=>navigate('/game-history')}/>
      <h2>Round {currentRound}</h2>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <div style={{ marginRight: '50px' }}>
          <h3>{playerNames.player1}</h3>
          {player1Choice && (
            <div style={{ fontSize: '50px' }}>
              {player1Choice.icon}
              <div>{player1Choice.name}</div>
            </div>
          )}
        </div>
        <div>
          <h3>{playerNames.player2}</h3>
          {player2Choice && (
            <div style={{ fontSize: '50px' }}>
              {player2Choice.icon}
              <div>{player2Choice.name}</div>
            </div>
          )}
        </div>
      </div>
      {currentRound <= 6 && (
        <button onClick={handlePlayerClick} style={{ padding: '10px 20px', fontSize: '16px' }}>
          Play Round
        </button>
      )}
      
      {/* <ResultsTable rounds={rounds} /> */}

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={winner === 'Tie' ? 'info' : 'success'}>
          {alertMessage}
        </Alert>
      </Snackbar>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Game Over</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Final Winner: {finalWinnerName}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Restart Game
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openNameDialog}>
        <DialogTitle>Enter Player Names</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Player 1 Name"
            fullWidth
            value={playerNames.player1}
            onChange={(e) => setPlayerNames({ ...playerNames, player1: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Player 2 Name"
            fullWidth
            value={playerNames.player2}
            onChange={(e) => setPlayerNames({ ...playerNames, player2: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNameSubmit} color="primary">
            Start Game
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default GamePage;
