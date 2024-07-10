import { useState, useEffect, useRef } from "react";
import Image from "next/image";

import { API_URL } from "@/utils/constants";
import microphone from "@/assets/icons/microphone.png";

interface AudioDetectorProps {
  isListening: boolean;
  onTranscription: (transcription: string) => void;
}

const AudioDetector: React.FC<AudioDetectorProps> = ({
  isListening,
  onTranscription,
}) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (isListening) {
      startListening();
    } else {
      stopListening();
    }

    return () => stopListening();
  }, [isListening]);

  const startListening = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new window.AudioContext();
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = audioContextRef.current.createMediaStreamSource(stream);
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 2048;
    dataArrayRef.current = new Uint8Array(
      analyserRef.current.frequencyBinCount
    );
    source.connect(analyserRef.current);

    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };
    mediaRecorderRef.current.start(100); // Send audio data every 100ms
    drawWaveform();
  };

  const stopListening = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/wav" });
        const formData = new FormData();
        formData.append("file", blob, "audio.wav");
        chunksRef.current = [];
        console.log(chunksRef.current);
        const token = localStorage.getItem("token");
        const data = await fetch(`${API_URL}/transcribe`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        const result = await data.json();
        onTranscription(result.transcription);
      };
    }
  };

  const drawWaveform = () => {
    if (analyserRef.current && dataArrayRef.current && canvasRef.current) {
      const canvasCtx = canvasRef.current.getContext("2d");
      if (!canvasCtx) return;

      const draw = () => {
        analyserRef.current!.getByteTimeDomainData(dataArrayRef.current!);

        canvasCtx.fillStyle = "rgb(243, 244, 246)";
        canvasCtx.fillRect(
          0,
          0,
          canvasRef.current!.width,
          canvasRef.current!.height
        );

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "rgb(0, 0, 0)";

        canvasCtx.beginPath();
        const sliceWidth =
          canvasRef.current!.width / dataArrayRef.current!.length;
        let x = 0;

        for (let i = 0; i < dataArrayRef.current!.length; i++) {
          const v = dataArrayRef.current![i] / 128.0;
          const y = (v * canvasRef.current!.height) / 2;

          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        canvasCtx.lineTo(
          canvasRef.current!.width,
          canvasRef.current!.height / 2
        );
        canvasCtx.stroke();

        animationIdRef.current = requestAnimationFrame(draw);
      };

      draw();
    }
  };

  return (
    <div>
      <div className="mr-40">
        <div className="bg-gray-100 border rounded-md w-fit">
          <Image
            alt="microphone"
            src={microphone}
            height={150}
            width={150}
            className="mx-52 mt-52 mb-32"
          />
          <canvas ref={canvasRef} width="150" height="100" className="ml-3" />
        </div>
      </div>
    </div>
  );
};

export default AudioDetector;
