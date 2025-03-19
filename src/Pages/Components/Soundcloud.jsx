import React, { useEffect, useState } from 'react';

export const Soundcloud = () => {
    const [volume, setVolume] = useState(100);
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [songName, setSongName] = useState('');
    const [totalSongs, setTotalSongs] = useState(0);
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

    return (
        <div className="fixed bottom-0 left-0 w-full h-15 bg-red-600 p-4 flex justify-between items-center" style={{ height: '15%' }}>
            {/* Soundcloud Widget */}
            <iframe
                width="0%"
                height="0"
                style={{ overflow: 'hidden', border: 'none' }}
                allow="autoplay"
                src={currentPlaylistUrl}
            ></iframe>

            {/* Previous Button */}
            <button 
                className={'btn btn-soft btn-primary'}
                onClick={() => handleTrackChange('prev')}
            >
                Previous
            </button>

            {/* Song Name */}
            <div className="text-white flex-grow text-center">{songName || 'Loading...'}</div>

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

            {/* Switch Playlist Button */}
            <button 
                className="btn btn-soft btn-warning"
                onClick={switchToMori}
            >
                Switch to Mori
            </button>

            {/* country button */}
            <button 
                className="btn btn-soft btn-warning"
                onClick={switchToCountry}
            >
                Switch to Country
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
    );
};

export default Soundcloud;