import React, { useEffect, useState } from 'react';

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

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://w.soundcloud.com/player/api.js";
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            const iframeElement = document.querySelector('iframe');
            const widget = SC.Widget(iframeElement);

            widget.bind(SC.Widget.Events.READY, function() {
                console.log('SoundCloud Widget is ready');
                updateCurrentSong(widget);
                widget.getSounds((sounds) => {
                    setTotalSongs(sounds.length);
                });
                
                setInterval(() => {
                    widget.getPosition((position) => {
                        widget.getDuration((duration) => {
                            setProgress((position / duration) * 100);
                        });
                    });
                }, 1000);

                widget.bind(SC.Widget.Events.FINISH, function() {
                    console.log('Track finished playing');
                    widget.next();
                });
            });

            widget.bind(SC.Widget.Events.PLAY, function() {
                console.log('SoundCloud Widget has started playing');
                updateCurrentSong(widget);
                setIsPlaying(true);
            });

            widget.bind(SC.Widget.Events.PAUSE, function() {
                console.log('SoundCloud Widget has paused playing');
                setIsPlaying(false);
            });

            return () => {
                widget.unbind(SC.Widget.Events.READY);
                widget.unbind(SC.Widget.Events.PLAY);
                widget.unbind(SC.Widget.Events.PAUSE);
                widget.unbind(SC.Widget.Events.FINISH);
            };
        };

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const updateCurrentSong = (widget) => {
        widget.getCurrentSound((sound) => {
            if (sound) {
                setSongName(sound.title);
            }
        });
    };

    const handleTrackChange = (direction) => {
        const iframeElement = document.querySelector('iframe');
        const widget = SC.Widget(iframeElement);

        if (direction === 'next') {
            widget.getCurrentSoundIndex((currentIndex) => {
                if (currentIndex < totalSongs - 1) {
                    widget.next();
                }
            });
        } else if (direction === 'prev') {
            widget.getCurrentSoundIndex((currentIndex) => {
                if (currentIndex > 0) {
                    widget.prev();
                }
            });
        }

        // Update song name after a delay to ensure track change is complete
        setTimeout(() => {
            updateCurrentSong(widget);
        }, 500);
    };

    const switchToMoriHelp = () => {
        const newPlaylistUrl = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1493436424&';

        setCurrentPlaylistUrl(newPlaylistUrl);
        setProgress(0);
        setSongName('MERA MERA');
        setTotalSongs(46);
        setIsPlaying(false);
        const iframeElement = document.querySelector('iframe');
        const widget = SC.Widget(iframeElement);
        widget.pause();
        widget.seek(1);
    };

    const switchToMori = () => {
        switchToMoriHelp();
        setTimeout(() => {
            switchToMoriHelp();
        }, 500);
    };

    const switchToCountryHelp = () => {
        const newPlaylistUrl = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1814722893&';

        setCurrentPlaylistUrl(newPlaylistUrl);
        setProgress(0);
        setSongName("I'm The Problem");
        setTotalSongs(50);
        setIsPlaying(true);
    }

    const switchToCountry = () => {
        switchToCountryHelp();
        setTimeout(() => {
            switchToCountryHelp();
        }, 500);
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
                            
                            const iframeElement = document.querySelector('iframe');
                            const widget = SC.Widget(iframeElement);
                            widget.getCurrentSound((sound) => {
                                widget.seekTo((newProgress / 100) * sound.duration);
                            });
                        }}
                    ></progress>

                    {/* Play/Pause Button */}
                    <button 
                        className={'btn btn-soft btn-info'}
                        onClick={() => {
                            const iframeElement = document.querySelector('iframe');
                            const widget = SC.Widget(iframeElement);
                            
                            if (isPlaying) {
                                widget.pause();
                                setIsPlaying(false);
                                console.log('SoundCloud Widget is now paused');
                            } else {
                                widget.play();
                                setIsPlaying(true);
                                console.log('SoundCloud Widget is now playing');
                            }
                        }}
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
                            
                            const iframeElement = document.querySelector('iframe');
                            const widget = SC.Widget(iframeElement);
                            widget.setVolume(newVolume);
                        }} 
                    />
                </div>
            </div>

        </>
    );
};

export default Soundcloud;