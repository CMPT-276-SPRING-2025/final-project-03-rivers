import React, { useEffect, useState, useRef } from 'react';

export const Soundcloud = () => {
    const [volume, setVolume] = useState(100);
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRepeated, setIsRepeated] = useState(false);
    const isRepeatedRef = useRef(isRepeated);

    useEffect(() => {
        isRepeatedRef.current = isRepeated;
    }, [isRepeated]);

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
                setInterval(() => {
                    widget.getPosition((position) => {
                        widget.getDuration((duration) => {
                            setProgress((position / duration) * 100);
                        });
                    });
                }, 1000);
            });

            widget.bind(SC.Widget.Events.FINISH, function() {
                console.log('SoundCloud Widget has finished playing');
                console.log('Repeat is', isRepeatedRef.current);
                if (isRepeatedRef.current) {
                    if (!isPlaying) {
                        widget.play();
                        console.log('SoundCloud Widget is now playing');
                    }
                }
            });
        };

        return () => {
            document.body.removeChild(script);
        };
    }, [isPlaying]);

    return (
        <div className="fixed bottom-0 left-0 w-full bg-gray-800 p-4 flex items-center justify-between">
            {/* Soundcloud Widget */}
            <iframe
                width="80%"
                height="60"
                style={{ overflow: 'hidden', border: 'none' }}
                allow="autoplay"
                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1787245513"
            ></iframe>

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
                className="range" 
                value={volume} 
                onChange={(e) => {
                    const newVolume = e.target.value;
                    setVolume(newVolume);
                    const iframeElement = document.querySelector('iframe');
                    const widget = SC.Widget(iframeElement);
                    widget.setVolume(newVolume);
                }} 
            />

            {/* Repeat Button */}
            <button 
                className={'btn btn-soft btn-info'}
                onClick={() => {
                    setIsRepeated(!isRepeated);
                    console.log(`Repeat is now ${!isRepeated ? 'enabled' : 'disabled'}`);
                }}
            >
                Repeat
            </button>

            <button className="btn btn-soft btn-primary">Primary</button>

        </div>
    );
};

export default Soundcloud;
