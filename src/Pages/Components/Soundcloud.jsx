import React, { useEffect } from 'react'

export const Soundcloud = () => {
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
        <div>
            <iframe
                width="100%"
                height="166"
                style={{ overflow: 'hidden', border: 'none' }}
                allow="autoplay"
                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1787245513"
            ></iframe>
        </div>
    );
};

export default Soundcloud