import React from 'react';
import '../styles/LoadingIndicator.css';

interface LoadingIndicatorProps {
    size?: number;
    color?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ size = 50, color = '#3498db' }) => {
    return (
        <div className="loading-indicator">
            <div
                className="loading-spinner"
                style={{
                    width: size,
                    height: size,
                    borderWidth: size / 8,
                    borderColor: `${color} transparent transparent transparent`,
                }}
            ></div>
            <p>Loading...</p>
        </div>
    );
};

export default LoadingIndicator;