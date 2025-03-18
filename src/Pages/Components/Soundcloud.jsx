import React, { useEffect, useState } from 'react';

export const Soundcloud = () => {
    const [volume, setVolume] = useState(100);

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
            });

            widget.bind(SC.Widget.Events.PLAY, function() {
                console.log('SoundCloud Widget is playing');
            });
        };

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="fixed bottom-0 left-0 w-full bg-gray-800 p-4 flex items-center justify-between">
            <iframe
                width="80%"
                height="60"
                style={{ overflow: 'hidden', border: 'none' }}
                allow="autoplay"
                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1787245513"
            ></iframe>
            <button className="btn btn-primary ml-4" onClick={() => {
                const iframeElement = document.querySelector('iframe');
                const widget = SC.Widget(iframeElement);
                widget.toggle();
            }}>Play</button>
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
        </div>
    );
};

export default Soundcloud;