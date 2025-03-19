import React, { useEffect, useState } from 'react';

const LoadingPage = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    clearInterval(interval);
                    return 100;
                }
                return Math.min(oldProgress + 2, 100);
            });
        }, 100);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="w-1/2">
                <progress className="progress progress-primary w-full" value={progress} max="100"></progress>
            </div>
            <div className="text-center mt-2">{progress}%</div>
        </div>
    );
};

export default LoadingPage;