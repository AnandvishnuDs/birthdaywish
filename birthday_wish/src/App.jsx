import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const audioRef = useRef(null);
  const bgmRef = useRef(null);
  const isOpenRef = useRef(false);
  const [showerItems, setShowerItems] = useState([]);
  // available photos in public/img — used for shower pieces
  const photos = [
    "/img/SAVE_20250810_132759.jpg",
    "/img/Screenshot 2025-10-24 120429.png",
    "/img/Screenshot 2025-10-24 122049.png",
    "/img/Screenshot 2025-10-24 153759.png",
  ];

  // Play happy birthday song when component mounts
  useEffect(() => {
    const playInitialMusic = async () => {
      try {
        if (bgmRef.current) {
          bgmRef.current.volume = 0.5;
          await bgmRef.current.play();
        }
      } catch (error) {
        console.log("Initial audio playback failed:", error);
        // Don't create the play button if the gift box has already been opened
        if (isOpenRef.current) return;
        // If a music button already exists (race), don't create another
        if (document.querySelector('[data-music-button]')) return;
        // Create a button to start playing
        const button = document.createElement('button');
        button.textContent = "🎵 Play Birthday Song";
        button.setAttribute('data-music-button', ''); // Add data attribute for easy selection
        button.style.position = 'fixed';
        button.style.top = '20px';
        button.style.left = '50%';
        button.style.transform = 'translateX(-50%)';
        button.style.padding = '12px 24px';
        button.style.backgroundColor = '#ff69b4';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '25px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '1000';
        button.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        button.style.fontSize = '16px';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.transition = 'all 0.3s ease';
        
        // Hover effect
        button.onmouseover = () => {
          button.style.backgroundColor = '#ff1493';
          button.style.transform = 'translateX(-50%) scale(1.05)';
          button.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
        };
        
        button.onmouseout = () => {
          button.style.backgroundColor = '#ff69b4';
          button.style.transform = 'translateX(-50%) scale(1)';
          button.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        };
        
        button.onclick = async () => {
          try {
            await bgmRef.current.play();
            // Fade out and remove button
            button.style.opacity = '0';
            button.style.transform = 'translateX(-50%) scale(0.95)';
            setTimeout(() => button.remove(), 300);
          } catch (err) {
            console.log("Play failed:", err);
            button.textContent = "😔 Please try again";
            setTimeout(() => {
              button.textContent = "🎵 Play Birthday Song";
            }, 2000);
          }
        };
        
        document.body.appendChild(button);
      }
    };
    
    // Start playing when component mounts
    playInitialMusic();
    
    // Cleanup
    return () => {
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current.currentTime = 0;
      }
    };
  }, []);

  // Ensure the music button is removed if the gift is opened later
  useEffect(() => {
    if (!isOpen) return;
    // mark opened so we won't create the play button afterwards
    isOpenRef.current = true;

    const musicButton = document.querySelector('[data-music-button]');
    if (musicButton) {
      // animate fade then remove
      musicButton.style.opacity = '0';
      musicButton.style.transform = 'translateX(-50%) scale(0.95)';
      setTimeout(() => {
        if (musicButton && musicButton.parentNode) musicButton.remove();
      }, 300);
    }
  }, [isOpen]);

  // Generate photo-shower items when the celebration content is shown
  useEffect(() => {
    if (!showContent) return;
    const count = 24; // number of falling tiles
    const items = [];
    for (let i = 0; i < count; i++) {
      // cycle through the photos array so the shower shows all 4 images repeatedly
      const src = photos[i % photos.length];
      const left = Math.random() * 100; // percent
      const delay = Math.random() * 2; // seconds
      const duration = 3 + Math.random() * 3; // seconds
      const size = 36 + Math.random() * 72; // px
      const rotation = -30 + Math.random() * 60; // deg
      items.push({ src, left, delay, duration, size, rotation });
    }
    setShowerItems(items);
    // Clear after a while so subsequent openings regenerate cleanly
    const clearTimer = setTimeout(() => setShowerItems([]), 12000);
    return () => clearTimeout(clearTimer);
  }, [showContent]);

  const handleClick = async () => {
    setIsOpen(true);
    // mark opened so we won't create the play button afterwards
    isOpenRef.current = true;
    setTimeout(() => {
      setShowContent(true);
    }, 1000);

    try {
      // Remove the music button if it exists
      const musicButton = document.querySelector('[data-music-button]');
      if (musicButton) {
        musicButton.style.opacity = '0';
        musicButton.style.transform = 'translateX(-50%) scale(0.95)';
        setTimeout(() => musicButton.remove(), 300);
      }

      // First stop the happy birthday song
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current.currentTime = 0;
      }

      // Then play the reel audio
      if (audioRef.current) {
        audioRef.current.volume = 0.5;
        await audioRef.current.play();
      }
    } catch (error) {
      console.log("Audio switch failed:", error);
    }
  };

  return (
    <div className="birthday-container">
      <audio ref={bgmRef} src="/audio/happy-birthday-334876.mp3" preload="auto" loop autoPlay playsInline />
      <audio ref={audioRef} src="/audio/ReelAudio-40177.mp3" preload="auto" playsInline />
      {!isOpen && (
        <div className="gift-box-container" onClick={handleClick}>
          <div className="gift-box">
            <div>
              {/* Sparkles */}
              <div className="sparkle sparkle-1" />
              <div className="sparkle sparkle-2" />
              <div className="sparkle sparkle-3" />
              <div className="sparkle sparkle-4" />
              <div className="sparkle sparkle-5" />
              <div className="sparkle sparkle-6" />
              <div className="sparkle sparkle-7" />
              <div className="sparkle sparkle-8" />
              <div className="sparkle sparkle-9" />
              <div className="sparkle sparkle-10" />
              <div className="sparkle sparkle-11" />
              <div className="sparkle sparkle-12" />
              <div className="sparkle sparkle-13" />
              <div className="sparkle sparkle-14" />
              <div className="sparkle sparkle-15" />
              <div className="sparkle sparkle-16" />
              <div className="sparkle sparkle-17" />
              <div className="sparkle sparkle-18" />
              <div className="sparkle sparkle-19" />
              <div className="sparkle sparkle-20" />
              <div className="sparkle sparkle-21" />
              <div className="sparkle sparkle-22" />
              <div className="sparkle sparkle-23" />
              <div className="sparkle sparkle-24" />
              <div className="sparkle sparkle-25" />
              <div className="sparkle sparkle-26" />
              <div className="sparkle sparkle-27" />
              <div className="sparkle sparkle-28" />
              <div className="sparkle sparkle-29" />
              <div className="sparkle sparkle-30" />
              <div className="sparkle sparkle-31" />
              <div className="sparkle sparkle-32" />
              <div className="sparkle sparkle-33" />
              <div className="sparkle sparkle-34" />
              <div className="sparkle sparkle-35" />
              <div className="sparkle sparkle-36" />
              <div className="sparkle sparkle-37" />
              <div className="sparkle sparkle-38" />
              <div className="sparkle sparkle-39" />
              <div className="sparkle sparkle-40" />
              <div className="sparkle sparkle-41" />
              <div className="sparkle sparkle-42" />
              <div className="sparkle sparkle-43" />
              <div className="sparkle sparkle-44" />
              <div className="sparkle sparkle-45" />
              <div className="sparkle sparkle-46" />
              <div className="sparkle sparkle-47" />
              <div className="sparkle sparkle-48" />
              <div className="sparkle sparkle-49" />
              <div className="sparkle sparkle-50" />
              <div className="sparkle sparkle-51" />
              <div className="sparkle sparkle-52" />
              <div className="sparkle sparkle-53" />
              <div className="sparkle sparkle-54" />
              <div className="sparkle sparkle-55" />
              <div className="sparkle sparkle-56" />
              <div className="sparkle sparkle-57" />
              <div className="sparkle sparkle-58" />
              <div className="sparkle sparkle-59" />
              <div className="sparkle sparkle-60" />
              <div className="sparkle sparkle-61" />
              <div className="sparkle sparkle-62" />
              <div className="sparkle sparkle-63" />
              <div className="sparkle sparkle-64" />
              <div className="sparkle sparkle-65" />
              <div className="sparkle sparkle-66" />
              <div className="sparkle sparkle-67" />
              <div className="sparkle sparkle-68" />
              <div className="sparkle sparkle-69" />
              <div className="sparkle sparkle-70" />
              <div className="sparkle sparkle-71" />
              <div className="sparkle sparkle-72" />
              <div className="sparkle sparkle-73" />
              <div className="sparkle sparkle-74" />
              <div className="sparkle sparkle-75" />
              <div className="sparkle sparkle-76" />
              <div className="sparkle sparkle-77" />
              <div className="sparkle sparkle-78" />
              <div className="sparkle sparkle-79" />
              <div className="sparkle sparkle-80" />
              <div className="sparkle sparkle-81" />
              <div className="sparkle sparkle-82" />
              <div className="sparkle sparkle-83" />
              <div className="sparkle sparkle-84" />
              <div className="sparkle sparkle-85" />
              <div className="sparkle sparkle-86" />
              <div className="sparkle sparkle-87" />
              <div className="sparkle sparkle-88" />
              <div className="sparkle sparkle-89" />
              <div className="sparkle sparkle-90" />
              <div className="sparkle sparkle-91" />
              <div className="sparkle sparkle-92" />
              <div className="sparkle sparkle-93" />
              <div className="sparkle sparkle-94" />
              <div className="sparkle sparkle-95" />
              <div className="sparkle sparkle-96" />
              <div className="sparkle sparkle-97" />
              <div className="sparkle sparkle-98" />
              <div className="sparkle sparkle-99" />
              <div className="sparkle sparkle-100" />
            </div>
            <div className="gift-lid">
              <div className="lid-top"></div>
              <div className="lid-side lid-side-left"></div>
              <div className="lid-side lid-side-right"></div>
              <div className="lid-side lid-side-front"></div>
              <div className="lid-side lid-side-back"></div>
            </div>
            <div className="gift-base">
              <div className="base-side base-side-left"></div>
              <div className="base-side base-side-right"></div>
              <div className="base-side base-side-front"></div>
              <div className="base-side base-side-back"></div>
              <div className="base-bottom"></div>
            </div>
            <div className="gift-ribbon">
              <div className="ribbon-vertical"></div>
              <div className="ribbon-horizontal"></div>
              <div className="bow">
                <div className="bow-left"></div>
                <div className="bow-right"></div>
                <div className="bow-center"></div>
              </div>
            </div>
          </div>
          <div className="gift-shadow"></div>
          <p className="click-message">Click to open!</p>
        </div>
      )}
      {isOpen && (
        <div className={`celebration-container ${showContent ? "show" : ""}`}>
          <div className="ribbons">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="ribbon-burst"
                style={{
                  "--angle": `${i * 30}deg`,
                  "--delay": `${i * 0.1}s`,
                }}
              ></div>
            ))}
          </div>
          {/* Photo shower: decorative tiles that fall behind the message */}
          <div className="photo-shower" aria-hidden>
            {showerItems.map((it, idx) => (
              <div
                key={idx}
                className="photo-piece"
                style={{
                  ['--left']: `${it.left}%`,
                  ['--delay']: `${it.delay}s`,
                  ['--dur']: `${it.duration}s`,
                  ['--size']: `${it.size}px`,
                  ['--rot']: `${it.rotation}deg`,
                  backgroundImage: `url("${it.src}")`,
                }}
              />
            ))}
          </div>
          <div className="balloons">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`balloon balloon-${i + 1}`}
                style={{
                  "--delay": `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
          {/* Falling photos removed per request */}
          <div className="birth">
            <div className="birthday-message">
              <h1 className="birthday-title">Happy Birthday Gayathri!!!💫</h1>
              <div className="message">
                <p className="message-line">
                  Thanks for always being there for me,
                </p>
                <p className="message-line">
                  listening to all my nonsense,never judging.
                </p>
                <p className="message-line">
                  and for always giving me your precious time.
                </p>
                <p className="message-line">
                  I’m really lucky to have you as a friend in my life. 💖
                </p>
                <p className="message-line special-wish">
                  You’re seriously the best
                </p>
                <p className="message-line final-wish">
                  hope your day’s as awesome as you are! 🎉💛
                </p>
              </div>
            </div>
          </div>
          <div className="confetti">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="confetti-piece"
                style={{
                  "--delay": `${Math.random() * 5}s`,
                  "--rotation": `${Math.random() * 360}deg`,
                  "--position": `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
