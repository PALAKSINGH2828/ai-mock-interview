"use client";

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import useSpeechToText from 'react-hook-speech-to-text';
import { toast } from 'sonner';
import { GoogleGenerativeAI } from '@google/generative-ai';

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex }) {
  const [userAnswer, setUserAnswer] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    const combinedTranscript = results.map((result) => result.transcript).join(' ');
    setUserAnswer(combinedTranscript);
  }, [results]);

  const SaveUserAnswer = async () => {
    if (isRecording) {
      stopSpeechToText();
      if (userAnswer?.length < 10) {
        toast('Error: Your answer is too short. Please record again.');
        return;
      }

      const feedbackPrompt =
        "Question: " + mockInterviewQuestion[activeQuestionIndex]?.Question +
        ", User Answer: " + userAnswer +
        ". Depending on the question and user answer, please give a rating for this answer (1 to 5) and feedback (areas of improvement if any) in JSON format with fields: rating and feedback. Respond ONLY with JSON.";

      try {
        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const chat = model.startChat({
          history: [],
        });

        const result = await chat.sendMessageStream(feedbackPrompt);
        const text = await result.response.text();

        const cleaned = text
          .replace("```json", "")
          .replace("```", "")
          .trim();

        try {
          const parsed = JSON.parse(cleaned);
          console.log("✅ Parsed feedback:", parsed);
          console.log("⭐ Rating:", parsed.rating);
          console.log("💬 Feedback:", parsed.feedback);
          toast("✅ Feedback received! Check console for details.");
        } catch (error) {
          console.error("❌ Failed to parse feedback JSON:", error);
          console.log("Raw text:", cleaned);
          toast("⚠️ Gemini did not return valid JSON. Please try again.");
        }
      } catch (error) {
        console.error("Error getting feedback:", error);

        if (error.message.includes("quota")) {
          toast("🚫 You hit your Gemini API quota. Please wait and try again.");
          setButtonDisabled(true);

          // Re-enable button after 30 seconds
          setTimeout(() => {
            setButtonDisabled(false);
          }, 30000);
        } else {
          toast("❌ Failed to get feedback from Gemini");
        }
      }
    } else {
      startSpeechToText();
    }
  };

  return (
    <div className='flex items-center justify-center flex-col'>
      <div className='flex flex-col my-20 justify-center items-center bg-black rounded-lg p-5 relative'>
        <Image 
          src={'/webcam.png'} 
          width={200} 
          height={200} 
          alt="Webcam icon" 
          className='absolute' 
        />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: '100%',
            zIndex: 10,
          }}
        />
      </div>
      <Button 
        variant="outline" 
        className="my-10"
        onClick={SaveUserAnswer}
        disabled={buttonDisabled}
      >
        {isRecording ? (
          <h2 className='text-red-600 flex gap-2'>Stop Recording......</h2>
        ) : (
          buttonDisabled ? "Please wait..." : "Record Answer"
        )}
      </Button>
      <Button onClick={() => console.log(userAnswer)}>Show User Answer</Button>
    </div>
  );
}

export default RecordAnswerSection;
