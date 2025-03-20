import React, { useEffect, useState, useRef } from 'react';

export const Soundcloud = () => {
    const [volume, setVolume] = useState(100);
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [songName, setSongName] = useState('');
    const [totalSongs, setTotalSongs] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPlaylistUrl, setCurrentPlaylistUrl] = useState(
        'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1814722893&'
    );
    const iframeRef = useRef(null);
    const widgetRef = useRef(null);
    const eventsRef = useRef(new Set());
    const isWidgetReady = useRef(false);

    useEffect(() => {
        const iframeElement = document.createElement('iframe');
        iframeElement.id = 'soundcloud-player';
        iframeElement.src = currentPlaylistUrl;
        iframeElement.width = '100%'; // Set to 0 to make it vanish
        iframeElement.height = '166'; // Set this to 0 too so it doesn't give an error when vanished
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
                
                const handleReady = () => {
                    console.log('SoundCloud Widget is ready');
                    isWidgetReady.current = true;
                    updateCurrentSong();
                    widgetRef.current.getSounds((sounds) => {
                        setTotalSongs(sounds.length);
                    });
                    
                    const progressInterval = setInterval(() => {
                        if (isWidgetReady.current) {
                            widgetRef.current.getPosition((position) => {
                                widgetRef.current.getDuration((duration) => {
                                    setProgress((position / duration) * 100);
                                });
                            });
                        }
                    }, 1000);

                    eventsRef.current.add(() => clearInterval(progressInterval));
                };

                const handlePlay = () => {
                    console.log('SoundCloud Widget has started playing');
                    updateCurrentSong();
                    setIsPlaying(true);
                };

                const handlePause = () => {
                    console.log('SoundCloud Widget has paused playing');
                    setIsPlaying(false);
                };

                eventsRef.current.add(
                    widgetRef.current.bind(SC.Widget.Events.READY, handleReady),
                    widgetRef.current.bind(SC.Widget.Events.PLAY, handlePlay),
                    widgetRef.current.bind(SC.Widget.Events.PAUSE, handlePause)
                );
            }
        };

        return () => {
            document.body.removeChild(script);
            document.body.removeChild(iframeElement);
            
            eventsRef.current.forEach(eventId => {
                if (widgetRef.current) {
                    widgetRef.current.unbind(eventId);
                }
            });
            eventsRef.current.clear();
            widgetRef.current = null;
            isWidgetReady.current = false;
        };
    }, [currentPlaylistUrl]);

    const updateCurrentSong = () => {
        if (widgetRef.current && isWidgetReady.current) {
            widgetRef.current.getCurrentSound((sound) => {
                if (sound) {
                    setSongName(sound.title);
                }
            });
        }
    };

    const switchToPlaylist = (playlistUrl) => {
        if (widgetRef.current) {
            widgetRef.current.pause();
            eventsRef.current.forEach(eventId => {
                widgetRef.current.unbind(eventId);
            });
            eventsRef.current.clear();
            widgetRef.current = null;
            isWidgetReady.current = false;
        }

        setCurrentPlaylistUrl(playlistUrl);
        setProgress(0);
        setSongName('');
        setIsPlaying(false);
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

    const handleTrackChange = (direction) => {
        if (widgetRef.current && isWidgetReady.current) {
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
    };

    const playlists = [
        {
            name: 'Mori',
            url: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1493436424&'
        },
        {
            name: 'Country',
            url: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1814722893&'
        }
    ];

    const filteredPlaylists = playlists.filter(playlist =>
        playlist.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            {/* Search Bar */}
            <div className="relative w-48 mb-2">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search playlists..."
                    className="w-full px-3 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
            </div>

            {/* Playlist Buttons */}
            <div className="flex gap-2 mb-2">
                {filteredPlaylists.map(playlist => (
                    <button 
                        key={playlist.name}
                        className="btn btn-soft btn-warning"
                        onClick={() => switchToPlaylist(playlist.url)}
                    >
                        {playlist.name}
                    </button>
                ))}
            </div>

            <div className="fixed bottom-0 left-0 w-full h-15 bg-red-600 p-4 flex flex-col items-center" style={{ height: '15%' }}>
                {/* Controls */}
                <div className="flex justify-between items-center w-full">
                    {/* Previous Button */}
                    <button 
                        className={'btn btn-soft btn-primary'}
                        onClick={() => handleTrackChange('prev')}
                    >
                        Previous
                    </button>

                    {/* Song Name */}
                    <div className="text-white flex-grow text-center">{songName}</div>

                    {/* Progress bar */}
                    <progress 
                        className="progress progress-info w-56 mx-4" 
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
                    ></progress>

                    {/* Play/Pause Button */}
                    <button 
                        className={'btn btn-soft btn-info'}
                        onClick={handlePlayPause}
                    >
                        {isPlaying ? 'Pause' : 'Play'}
                    </button>

                    {/* Next Button */}
                    <button 
                        className="btn btn-soft btn-info"
                        onClick={() => handleTrackChange('next')}
                    >
                        Next
                    </button>

                    {/* Volume Control */}
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        className="range text-blue-300 [--range-bg:orange] [--range-thumb:blue] [--range-fill:0]" 
                        value={volume} 
                        onChange={(e) => {
                            const newVolume = e.target.value;
                            setVolume(newVolume);
                            if (widgetRef.current && isWidgetReady.current) {
                                widgetRef.current.setVolume(newVolume);
                            }
                        }} 
                    />
                </div>
            </div>
        </>
    );
};

export default Soundcloud;