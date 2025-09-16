import React, { useRef, useEffect, useCallback } from 'react';

interface CameraCaptureProps {
    onCapture: (dataUrl: string) => void;
    onCancel: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let stream: MediaStream | null = null;
        
        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: 'environment' } 
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                alert("Could not access the camera. Please ensure you have granted permission.");
                onCancel();
            }
        };

        startCamera();

        return () => {
            stream?.getTracks().forEach(track => track.stop());
        };
    }, [onCancel]);

    const handleCapture = useCallback(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            const context = canvas.getContext('2d');
            if (context) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                const dataUrl = canvas.toDataURL('image/jpeg');
                onCapture(dataUrl);
            }
        }
    }, [onCapture]);
    
    return (
        <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-2xl bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
                <video ref={videoRef} autoPlay playsInline className="w-full h-auto"></video>
                <canvas ref={canvasRef} className="hidden"></canvas>

                 <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent flex justify-center items-center space-x-4">
                    <button 
                        onClick={onCancel} 
                        className="px-6 py-3 rounded-full text-white bg-gray-700/80 hover:bg-gray-600/80 font-semibold"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleCapture} 
                        className="w-20 h-20 rounded-full bg-white flex items-center justify-center border-4 border-gray-400/50 hover:border-gray-200/50 transition"
                        aria-label="Capture photo"
                    >
                       <div className="w-16 h-16 rounded-full bg-white active:bg-gray-300"></div>
                    </button>
                </div>
            </div>
             <p className="text-white/80 mt-4 text-sm">Position the medication clearly in the frame and capture.</p>
        </div>
    );
};

export default CameraCapture;
