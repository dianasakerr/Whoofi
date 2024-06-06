import React, { useState, useEffect, useRef } from 'react';

const BarkingDetector: React.FC = () => {
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const yamnetModelRef = useRef<tf.GraphModel | null>(null);
  const classMapRef = useRef<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    loadModel();
    return cleanup;
  }, []);

  const loadModel = async () => {
    try {
      const yamnetModel = await tf.loadGraphModel('path/to/yamnet/model.json');
      const classMap = await fetch('path/to/yamnet/class_map.csv').then(response => response.text());
      yamnetModelRef.current = yamnetModel;
      classMapRef.current = classMap;
    } catch (error) {
      console.error('Error loading model:', error);
    }
  };

  const startDetection = async () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const microphoneSource = audioContext.createMediaStreamSource(microphoneStream);
      const analyserNode = audioContext.createAnalyser();
      analyserNode.fftSize = 2048;

      audioContextRef.current = audioContext;
      microphoneStreamRef.current = microphoneStream;
      analyserNodeRef.current = analyserNode;

      microphoneSource.connect(analyserNode);
      detectBarking();
      setIsDetecting(true);
    } catch (error) {
      console.error('Error starting detection:', error);
    }
  };

  const detectBarking = () => {
    const frameData = new Uint8Array(analyserNodeRef.current!.frequencyBinCount);
    const scores: number[][] = [];

    const processFrame = () => {
      analyserNodeRef.current!.getByteTimeDomainData(frameData);
      const frameTensor = tf.tensor(frameData);
      const normalizedFrameTensor = frameTensor.sub(128).div(128);

      const scoreTensor = yamnetModelRef.current!.predict(normalizedFrameTensor.reshape([1, -1])) as tf.Tensor;
      scores.push(Array.from(scoreTensor.dataSync()));

      visualizeSpectrogram(frameData);

      if (isBarking(scoreTensor)) {
        console.log('Barking detected!');
        // Add your logic here for further actions if barking is detected
      }

      frameTensor.dispose();
      normalizedFrameTensor.dispose();

      if (isDetecting) {
        requestAnimationFrame(processFrame);
      }
    };

    processFrame();
  };

  const stopDetection = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsDetecting(false);
  };

  const visualizeSpectrogram = (frameData: Uint8Array) => {
    if (!canvasRef.current || !ctxRef.current) return;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(0, (frameData[0] / 128) * (canvas.height / 2));

    for (let i = 1; i < frameData.length; i++) {
      const x = (i / frameData.length) * canvas.width;
      const y = (frameData[i] / 128) * (canvas.height / 2);
      ctx.lineTo(x, y);
    }

    ctx.stroke();
  };

  const isBarking = (scoreTensor: tf.Tensor): boolean => {
    const scores = Array.from(scoreTensor.dataSync());
    // Logic to determine if barking based on YAMNet scores
    // Example: Check if 'Barking' class score is above a threshold
    const classMap = classMapRef.current!;
    return scores[classMap.indexOf('Barking')] > 0.5;
  };

  const cleanup = () => {
    if (isDetecting) {
      stopDetection();
    }
  };

  return (
    <div>
      <button onClick={startDetection} disabled={isDetecting}>
        Start Detection
      </button>
      <button onClick={stopDetection} disabled={!isDetecting}>
        Stop Detection
      </button>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default BarkingDetector;
