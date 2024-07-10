"use client";

import { useState } from "react";
import AudioDetector from "@/components/AudioDetector";

const Consultation: React.FC = () => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcription, setTranscription] =
    useState<string>(`Start Speaking...`);

  return (
    <div>
      <h1 className="text-center text-4xl mt-7 mb-14 font-bold">
        Consultation
      </h1>
      <div className="flex justify-center">
        <div>
          <AudioDetector
            isListening={isListening}
            onTranscription={setTranscription}
          />
          <button
            onClick={() => setIsListening(!isListening)}
            className="bg-neutral-900 text-white px-10 py-4 rounded-full mt-4"
          >
            {isListening ? "Stop Consultation" : "Start Consultation"}
          </button>
        </div>
        <div className="w-96 h-96 p-7 border overflow-y-scroll rounded-md">
          {transcription}
        </div>
      </div>
    </div>
  );
};

export default Consultation;
