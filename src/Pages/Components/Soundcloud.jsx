import React, { useEffect, useState, useRef } from 'react';

const togglePanel = (isOpen, setIsOpen) => {
    setIsOpen(!isOpen)
  }
export const Soundcloud = ({ isOpen, setIsOpen}) => {
  const [volume, setVolume] = useState(100);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [songName, setSongName] = useState('');
  const [totalSongs, setTotalSongs] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPlaylistUrl, setCurrentPlaylistUrl] = useState(
    'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1814722893&'
  );
  const [currentPlaylistName, setCurrentPlaylistName] = useState('Country');
  const [currentTime, setCurrentTime] = useState(0);
  const [curduration, setDuration] = useState(0);
  const iframeRef = useRef(null);
  const widgetRef = useRef(null);
  const eventsRef = useRef(new Set());
  const isWidgetReady = useRef(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState('');
  const [newName, setNewName] = useState('');

  function formatTime(seconds) {
    if (seconds === null || isNaN(seconds)) return '--:--';
    const minutes = Math.floor(seconds / 60 / 1000);
    const remainingSeconds = Math.floor((seconds / 1000) % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  useEffect(() => {
    const setupPlayer = async () => {
      const iframeElement = document.createElement('iframe');
      iframeElement.id = 'soundcloud-player';
      iframeElement.src = currentPlaylistUrl;
      iframeElement.width = '0';
      iframeElement.height = '0';
      iframeElement.allow = 'autoplay';
      document.body.appendChild(iframeElement);
      iframeRef.current = iframeElement;

      const script = document.createElement('script');
      script.src = "https://w.soundcloud.com/player/api.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (iframeRef.current) {
          widgetRef.current = SC.Widget(iframeRef.current);
          setupEventListeners();
        }
      };
    };

    setupPlayer();

    return () => {
      cleanupPlayer();
    };
  }, [currentPlaylistUrl]);

  const setupEventListeners = () => {
    const handleReady = () => {
      isWidgetReady.current = true;
      updateCurrentSong();
      widgetRef.current.getSounds((sounds) => {
        setTotalSongs(sounds.length);
      });
    };

    const handlePlayProgress = () => {
      if (widgetRef.current && isWidgetReady.current) {
        widgetRef.current.getDuration((duration) => {
          widgetRef.current.getPosition((position) => {
            if (position !== null && duration !== null) {
              setDuration(duration);
              setCurrentTime(position);
              setProgress(position / duration * 100)
            }
          });
        })

      }
    }

    const handlePlay = () => {
      setIsPlaying(true);
      updateCurrentSong();
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleFinish = () => {
      if (widgetRef.current && isWidgetReady.current) {
        if (isShuffled) {
          // When shuffled, jump to a random track
          const randomIndex = Math.floor(Math.random() * totalSongs);
          widgetRef.current.skip(randomIndex);
        } else {
          // When not shuffled, continue to next track
          widgetRef.current.next();
        }
        setTimeout(updateCurrentSong, 500);
      }
    };

    eventsRef.current.add(
      widgetRef.current.bind(SC.Widget.Events.READY, handleReady),
      widgetRef.current.bind(SC.Widget.Events.PLAY, handlePlay),
      widgetRef.current.bind(SC.Widget.Events.PAUSE, handlePause),
      widgetRef.current.bind(SC.Widget.Events.PLAY_PROGRESS, handlePlayProgress),
      widgetRef.current.bind(SC.Widget.Events.FINISH, handleFinish)
    );
  };

  const cleanupPlayer = () => {
    if (widgetRef.current) {
      eventsRef.current.forEach(eventId => {
        widgetRef.current.unbind(eventId);
      });
      eventsRef.current.clear();
      widgetRef.current = null;
    }
  
    // Safely remove the iframe only if it exists
    if (iframeRef.current && iframeRef.current.parentNode) {
      iframeRef.current.parentNode.removeChild(iframeRef.current);
    }
    
    isWidgetReady.current = false;
  };

  const updateCurrentSong = () => {
    if (widgetRef.current && isWidgetReady.current) {
      widgetRef.current.getCurrentSound((sound) => {
        if (sound) {
          setSongName(sound.title);
        }
      });
    }
  };

  const switchToPlaylist = (playlistUrl, playlistName) => {
    if(playlistUrl !== currentPlaylistUrl){
      console.log("Changing playlists");
      if (widgetRef.current) {
        widgetRef.current.pause();
        cleanupPlayer();
      }
      setCurrentPlaylistUrl(playlistUrl);
      setProgress(0);
      setSongName('');
      setIsPlaying(false);
      setCurrentPlaylistName(playlistName);
    }
    else{
      console.log("Same Playlist, do nothing");
    }
  };

  const handlePlayPause = () => {
    if (widgetRef.current && isWidgetReady.current) {
      if (isPlaying) {
        widgetRef.current.pause();
      } else {
        widgetRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleToggleShuffle = () => {
    setIsShuffled(!isShuffled);
    
    if (!widgetRef.current || !isWidgetReady.current) return;
    
    const currentIndex = widgetRef.current.getCurrentSoundIndex();
    const totalTracks = totalSongs;
    
    if (!isShuffled && currentIndex === totalTracks - 1) {
      // Skip shuffle when reaching end of playlist
      return;
    }
    
    if (!isShuffled) {
      // Start shuffled playback
      widgetRef.current.next();
    } else {
      // Return to normal playback
      widgetRef.current.play(currentIndex);
    }
  };

  const handleTrackChange = (direction) => {
    if (widgetRef.current && isWidgetReady.current) {
      if (isShuffled) {
        // When shuffled, jump to a random track
        const randomIndex = Math.floor(Math.random() * totalSongs);
        widgetRef.current.skip(randomIndex);
        setTimeout(updateCurrentSong, 500);
      } else {
        // When not shuffled, use the original sequential behavior
        if (direction === 'next') {
          widgetRef.current.getCurrentSoundIndex((currentIndex) => {
            if (currentIndex < totalSongs - 1) {
              widgetRef.current.next();
            }
          });
        } else if (direction === 'prev') {
          widgetRef.current.getCurrentSoundIndex((currentIndex) => {
            if (currentIndex > 0) {
              widgetRef.current.prev();
            }
          });
        }
        setTimeout(updateCurrentSong, 500);
      }
    }
  };
  const [playlists,setPlaylists] = useState([
    {
      name: 'Mori',
      url: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1493436424&'
    },
    {
      name: 'Country',
      url: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1814722893&'
    },
    {
      name: 'TikTok',
      url: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/333345223&'
    },
    {
      name: "Assorted Weeb",
      url: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1993691044&'
    },
    {
      name: "Kpop",
      url: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/283568798&'
    }
  ]);

  function extractSoundCloudUrl(iframeString) {
    // Use regex to find the src attribute value
    const srcMatch = iframeString.match(/src="([^"]+)"/);
    
    if (!srcMatch) {
      return null;
    }
    
    // Extract the URL from the src attribute
    const fullUrl = srcMatch[1];
    
    // Find the base URL (everything before the first &)
    const baseUrl = fullUrl.split('&')[0];
    
    return baseUrl;
  }

  const filteredPlaylists = playlists.filter(playlist =>
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlaylistAdd = (newPlaylist, newName) => {
    if (!newPlaylist || !newName) {
      return false;
    }
    const newPlaylistLink = extractSoundCloudUrl(newPlaylist);
    setPlaylists(prevPlaylists => [
      ...prevPlaylists,
      {
        name: newName,
        url: newPlaylistLink
      }
    ]);
  
    return true;
  };

  return (
    <>
      <div>
        {/* Playlist Box */}
        <div className={`fixed left-[35vw] top-1/3 -translate-x-1/2 -translate-y-1/2 h-5/12 w-1/4 rounded-lg transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="absolute top-4 right-4 bg-transparent text-red-700 text-3xl font-bold"
            aria-label="Close panel"
          >
            &times;
          </button>
          <div className="rounded-lg h-full bg-gradient-to-b from-sky-200 to-slate-200 p-6">
            <div className="text-center overflow-y-auto max-h-[60%]">
              <h1 className='text-center bg-gradient-to-r from-slate-700 to-indigo-400 !bg-clip-text !text-transparent'>Playlists</h1>
              <button
                className = 'btn btn-soft text-center bg-gradient-to-r from-slate-700 to-indigo-400 !bg-clip-text !text-transparent'
                onClick={() => setIsModalOpen(true)}
              >
                Add Playlist
              </button>
            </div>
            
            <div className="relative w-full mb-2 top-[2.5vh] flex justify-center">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search playlists..."
                className="w-full px-[2.5vw] py-[1vh] rounded-md bg-white text-zinc-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2 mt-10 overflow-y-auto max-h-[35%]">
              {filteredPlaylists.map(playlist => (
                <button
                  key={playlist.name}
                  className="btn btn-soft text-center bg-gradient-to-r from-slate-700 to-indigo-400 !bg-clip-text !text-transparent !py-[1%] !text-[70%] overflow-x-auto overflow-y-auto"
                  onClick={() => switchToPlaylist(playlist.url, playlist.name)}
                >
                  {playlist.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/*
        {!isOpen && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="fixed top-1/2 left-[50vw] -translate-x-1/2 -translate-y-1/2 bg-black/80 hover:bg-black/90 text-white px-3 py-1 rounded-l-lg"
            aria-label="Open panel"
          >
            ▶️
          </button>
        )}
        */}
      </div>

      {/* This is the Control Bar */}
      <div className="fixed bottom-0 w-full h-[70vh] bg-gradient-to-b from-sky-200 to-slate-200 p-4 flex items-center" style={{ height: '150px' }}>
        <div className="flex items-center w-full">
        <span className="text-2xl">🔊</span>
        <input
            type="range"
            min="0"
            max="100"
            className="range range-xs text-black [--range-bg:white]"
            value={volume}
            data-testid = "volumeControl"
            onChange={(e) => {
              const newVolume = e.target.value;
              setVolume(newVolume);
              if (widgetRef.current && isWidgetReady.current) {
                widgetRef.current.setVolume(newVolume);
              }
            }}
          />
          <div className='justify-center flex gap-2 m-auto'>
            <button
              className="btn btn-soft btn-primary"
              data-testid="previous"
              onClick={() => handleTrackChange('prev')}
            >
              ⏮️
            </button>
            
            <button
              className="btn btn-soft btn-info"
              data-testid="pausePlay"
              onClick={handlePlayPause}
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            <button
              className="btn btn-soft btn-info"
              data-testid="next"
              onClick={() => handleTrackChange('next')}
            >
              ⏭️
            </button>

            <button
              className={`btn px-[5%] py-[10%] ${isShuffled ? 'btn-warning' : 'btn-soft btn-info'}`}
              onClick={handleToggleShuffle}
              aria-label="Toggle shuffle"
            >
              🎲
            </button>
          </div>
          

          <div data-testid = 'song'><h2 className="w-[100%] h-[7.5%] bg-gradient-to-r from-slate-700 to-indigo-400 !bg-clip-text !text-transparent text-center overflow-clip">{songName}</h2></div>
        </div>
        <div className="fixed bottom-0 left-0 w-full p-4 flex">
        <h2 className="w-[13%] bg-gradient-to-r from-slate-700 to-indigo-400 !bg-clip-text !text-transparent text-center overflow-clip">{currentPlaylistName}</h2>
          <progress
              className="progress progress-info w-1/2 ml-[12%]"
              data-testid="progress"
              max="100"
              value={progress}
              onClick={(e) => {
                const rect = e.target.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newProgress = (clickX / rect.width) * 100;
                setProgress(newProgress);
                if (widgetRef.current && isWidgetReady.current) {
                  widgetRef.current.getCurrentSound((sound) => {
                    widgetRef.current.seekTo((newProgress / 100) * sound.duration);
                  });
                }
              }}
            />
            <p className="!text-left text-black ml-4">{formatTime(currentTime)} / {formatTime(curduration)}</p>
        </div>

      </div>

      {/* Song Add Modal */}
      <dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="modal">
        <div className="modal-content bg-gradient-to-b from-sky-200 to-slate-200 rounded">
          <div className="modal-header">
            <h1 className="text-center bg-gradient-to-r from-slate-700 to-indigo-400 !bg-clip-text !text-transparent">
              Add a song
            </h1>
          </div>
          <div className="modal-body">
            
            <textarea
              placeholder="Enter Playlist embed link (Go onto Soundcloud -> Embed -> copy the whole link)"
              className="w-full p-2 border rounded text-black bg-blue-50 resize-vertical"
              style={{
                minHeight: "40px",
                maxHeight: "80vh",
                width: "30vw",
                boxSizing: "border-box",
              }}
              value = {newPlaylist}
              onChange={(e) => setNewPlaylist(e.target.value)}
              >
              </textarea>
              <textarea
              placeholder="Enter Playlist Name"
              className="w-full p-2 border rounded text-black bg-blue-50 resize-vertical"
              style={{
                minHeight: "40px",
                maxHeight: "80vh",
                width: "30vw",
                boxSizing: "border-box",
              }}
              value = {newName}
              onChange={(e) => setNewName(e.target.value)}
              >
              </textarea>
          </div>
          <div className="modal-footer">
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setIsModalOpen(false);
                handlePlaylistAdd(newPlaylist, newName);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export { togglePanel }

export default Soundcloud;