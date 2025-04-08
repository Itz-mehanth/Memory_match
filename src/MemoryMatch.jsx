import React, { useState, useEffect } from "react";
import "./MemoryMatch.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const images = [
  "🍎", "🍌", "🍒", "🍇", "🍉", "🥭", "🍍", "🍑",
  "🍎", "🍌", "🍒", "🍇", "🍉", "🥭", "🍍", "🍑"
];

// const images = [
//     "🍎", "🍌", "🍒", "🍇", "🍉", "🥭", "🍍", "🍑", "🍏", "🍐",
//     "🍎", "🍌", "🍒", "🍇", "🍉", "🥭", "🍍", "🍑","🍏", "🍐",];

// const images = [
//   "🍎", "🍌", "🍒", "🍇", "🍉",
//   "🍎", "🍌", "🍒", "🍇", "🍉"
// ];

// const images = [
//   "🍎",
//   "🍎",
// ];

const shuffleImages = () => {
  return [...images].sort(() => Math.random() - 0.5);
};

const playSound = (soundFile) => {
  const audio = new Audio(soundFile);
  audio.play();
};

export default function MemoryMatch() {
  const [shuffledImages, setShuffledImages] = useState(shuffleImages());
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);
  const [turns, setTurns] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [musicOn, setMusicOn] = useState(false);
  const [backgroundMusic, setBackgroundMusic] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showWinPopup, setShowWinPopup] = useState(false);

  function createPartyPapers() {
        const confettiContainer = document.createElement('div');
        confettiContainer.classList.add('confetti-container');
        document.body.appendChild(confettiContainer);

        for (let i = 0; i < 250; i++) {  // Adjust number of confetti
            let confetti = document.createElement('div');
            confetti.classList.add('party-paper');

            // Random start position (near center)
            let startX = window.innerWidth / 2;
            let startY = window.innerHeight / 2;
            confetti.style.left = `${startX}px`;
            confetti.style.top = `${startY}px`;

            // Random size
            let size = Math.random() * 8 + 10;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;

            // Random color
            let colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#FFA500', '#8A2BE2'];
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            // Random velocity (forceful explosion)
            let angle = Math.random() * 360; // Random direction
            let speed = Math.random() * 10 + 20; // Random speed
            let velocityX = Math.cos(angle) * speed;
            let velocityY = Math.sin(angle) * speed;

            confettiContainer.appendChild(confetti);

            // Animate with JavaScript (forceful movement)
            let duration = 1.5 + Math.random(); // Random duration
            let gravity = 1; // Fall down effect
            let opacity = 1;
            
            function animate() {
                if (duration <= 0) {
                    confetti.remove();
                    return;
                }

                startX += velocityX;
                startY += velocityY;
                velocityY += gravity; // Apply gravity

                confetti.style.left = `${startX}px`;
                confetti.style.top = `${startY}px`;
                confetti.style.opacity = opacity;

                opacity -= 0.02; // Gradual fade-out
                duration -= 0.02; // Reduce animation time
                
                requestAnimationFrame(animate);
            }

            animate();
        }
    }

  useEffect(() => {
    if (timeLeft > 0 && !showSplash) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
      playSound("/assets/lose.mp3");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [timeLeft, showSplash]);

  useEffect(() => {
    if (matched.length === images.length) {
      setShowWinPopup(true);
      playSound("/assets/win.wav");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [matched]);

  const copyCouponCode = () => {
    navigator.clipboard.writeText("WINNER2025");
    alert("Coupon Code Copied!");
  };

  useEffect(() => {
    if (musicOn) {
      const audio = new Audio("/assets/background.mp3");
      audio.loop = true;
      audio.play();
      setBackgroundMusic(audio);
    } else if (backgroundMusic) {
      backgroundMusic.pause();
    }
  }, [musicOn]);

  const handleClick = (index) => {
    if (gameOver || showWinPopup || selected.includes(index) || matched.includes(index)) return;
    playSound("/assets/select.wav");
    if (selected.length < 2 && !selected.includes(index) && !matched.includes(index)) {
      const newSelected = [...selected, index];
      setSelected(newSelected);
      if (newSelected.length === 2) {
        setTurns(turns + 1);
        const [first, second] = newSelected;
        if (shuffledImages[first] === shuffledImages[second]) {
          setMatched([...matched, first, second]);
          createPartyPapers();
          playSound("/assets/success.wav");
        }
        setTimeout(() => {
          setSelected([]);
        }, 500);
      }
    }
  };

  if (showSplash) {
    return (
      <div className="splash-screen">
        {/* <img src="/assets/logo.png" alt="Game Logo" className="game-logo" /> */}
        <h1 className="game-title">Memory Match</h1>
        <button className="start-button" onClick={() => setShowSplash(false)}>Start Game</button>
        <button className="music-button" onClick={() => setMusicOn(!musicOn)}>
          {musicOn ? "Music Off" : "Music On"}
        </button>
      </div>
    );
  }

  return (
    <div className="game-container">
      <h1 className="title">Memory Match Game</h1>
      {/* <div className="stats-container">
        <div className="stats-box">
          <p>Pairs Matched</p>
          <h2 style={{ color: "#00ff00" }}>{matched.length / 2}</h2>
        </div>
        <div className="stats-box">
          <p>Total Turns</p>
          <h2 style={{ color: "#ffcc00" }}>{turns}</h2>
        </div>
      </div> */}
      <div className="timer-container">
        <CircularProgressbar 
          value={(timeLeft / 60) * 100} 
          text={`${timeLeft}s`} 
          styles={buildStyles({
            textColor: "#fff",
            pathColor: timeLeft > 10 ? "#00ff00" : "#ff0000",
            trailColor: "#333"
          })}
        />
      </div>
      <div className="grid-container">
        {shuffledImages.map((image, index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className={`card ${selected.includes(index) || matched.includes(index) ? 'flip' : ''} ${matched.includes(index) ? 'matched' : ''}`}
          >
            <div className="card-inner">
              <div className="card-front">{image}</div>
              <div className="card-back">❓</div>
            </div>
          </div>
        ))}
      </div>
      {gameOver && (
        <div className="popup">
          <h2>Game Over!</h2>
          <p>You matched {matched.length / 2} pairs in {turns} turns.</p>
          <button onClick={() => window.location.reload()}>Restart</button>
        </div>
      )}
      {showWinPopup && (
        <div className="win-popup special-win-popup">
            <h2>🎉 Congratulations! 🎉</h2>
            <p>You matched all pairs in {turns} turns!</p>
            <p className="coupon-highlight">🎟️ Your Coupon Code: <span onClick={copyCouponCode} style={{cursor: 'pointer', textDecoration: 'underline'}}>WINNER2025</span> 🎟️</p>
            <button onClick={() => window.location.reload()}>Play Again</button>
            <button className="redeem-button" onClick={() => copyCouponCode()}>Redeem Now</button>
        </div>
      )}
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="party-paper" style={{
              left: `${Math.random() * 100}vw`,
              top: `${Math.random() * 100}vh`,
              backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`
            }}></div>
          ))}
        </div>
      )}
    </div>
  );
}