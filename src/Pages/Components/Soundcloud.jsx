import React, { useEffect, useState, useRef } from 'react';

export const Soundcloud = () => {
    const [volume, setVolume] = useState(100);
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [songName, setSongName] = useState('');
    const [totalSongs, setTotalSongs] = useState(0);

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
                widget.getCurrentSound((sound) => {
                    setSongName(sound.title);
                });
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
            });

            widget.bind(SC.Widget.Events.PLAY, function() {
                console.log('SoundCloud Widget has started playing');

                widget.getCurrentSound((sound) => {
                    setSongName(sound.title);
                });
                setIsPlaying(true);
            });

            widget.bind(SC.Widget.Events.FINISH, function() {
                console.log('SoundCloud Widget has finished playing');
            });
        };

        return () => {
            document.body.removeChild(script);
        };
    }, [isPlaying]);

    return (
        <div className="fixed bottom-0 left-0 w-full h-15 bg-red-600 p-4 flex justify-between" style={{ height: '15%' }}>
            {/* Soundcloud Widget */}
            <iframe
                width="0%"
                height="0"
                style={{ overflow: 'hidden', border: 'none' }}
                allow="autoplay"
                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1814722893&"
            ></iframe>

            {/* Song Name */}
            <div className="text-white">{songName}</div>

            {/* Progress bar */}
            <progress 
                className="progress progress-info w-56" 
                max="100" 
                value={progress}
                onClick={(e) => {
                    const rect = e.target.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const newProgress = (clickX / rect.width) * 100;
                    setProgress(newProgress);
                    const iframeElement = document.querySelector('iframe');
                    const widget = SC.Widget(iframeElement);
                    widget.getDuration((duration) => {
                        widget.seekTo((newProgress / 100) * duration);
                    });
                }}
            ></progress>
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
            {/* Play Button */}
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
                    }}}
                >
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
            
            {/* Next Button */}
            <button 
                className={'btn btn-soft btn-info'}
                onClick={() => {
                    const iframeElement = document.querySelector('iframe');
                    const widget = SC.Widget(iframeElement);
                    widget.next();
                    console.log('Next Song');
                }}
            > Next </button>
            {/* Previous Button */}
            <button 
                className={'btn btn-soft btn-primary'}
                onClick={() => {
                    const iframeElement = document.querySelector('iframe');
                    const widget = SC.Widget(iframeElement);
                    widget.prev();
                    console.log('Previous Song');
                }}
            > Previous </button>
        </div>
    );
};

export default Soundcloud;
