"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle } from 'lucide-react'

import { toast } from 'sonner'
import { chatSession } from '@/utils/GeminiAIModel'
 import { UserAnswer } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { db } from '@/utils/db'



function RecordAnswerSection({mockInterviewQuestion,activeQuestionIndex,interviewData}) {
  const [userAnswer,setUserAnswer]=useState('');
  const {user}=useUser();
  const [loading, setLoading] = useState(false);
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true, 
    useLegacyResults: false
  });


  useEffect(()=>{
   results.map((result)=>(
        setUserAnswer(prevAns=>prevAns+result?.transcript)
   ))
  },[results])

  useEffect(()=>{
    if(!isRecording&&userAnswer.length>10){
      UpdateUserAnswer();
    }

   },[userAnswer])




const StartStopRecording=async()=>{
  if(isRecording)
  {
    
    stopSpeechToText();

  }
  else{
    startSpeechToText();
    
  } 
}

const UpdateUserAnswer=async()=>{
  setLoading(true);
  const feedbackPrompt="Question:"+mockInterviewQuestion[activeQuestionIndex]?.Question+
    ", User Answer:"+userAnswer +",Depends on question and user answer for given interview question "+
    " Please give us rating for answer and feedback as area of improvment if any "+
    "in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";

    const result=await chatSession.sendMessage(feedbackPrompt);
     
    const mockJsonResp=(result.response.text()).replace('```json','').replace('```','');
    console.log(mockJsonResp); 
    const JsonFeedbackResp=JSON.parse(mockJsonResp); 


     const resp=await db.insert(UserAnswer)
     .values({
      mockIdRef:interviewData?.mockId,
      question:mockInterviewQuestion[activeQuestionIndex]?.Question,
      correctAns:mockInterviewQuestion[activeQuestionIndex]?.Answer,
      userAns:userAnswer,
      feedback:JsonFeedbackResp?.feedback,
      rating:JsonFeedbackResp?.rating,
      userEmail:user?.primaryEmailAddress?.emailAddress,
      createdAt:moment().format('DD-MM-YYYY')
     })

     if(resp){
       toast('User Answer recorded successfully')
       setUserAnswer('');
       setResults([]);
     }
     setResults([]);
     setLoading(false);

}

  return (
    <div className='flex flex-center justify-center flex-col'>
    <div className='flex flex-col my-20 justify-center items-center bg-black rounded-lg p-5'>
        <Image src={'/webcam.png'} 
        alt="A description of the image"
        width={200}
         height={200}
        className='absolute'/>
      <Webcam
      mirrored={true}
      style={{
        height:300,
        width:'100%',
        zIndex:10,
      }}
      />
    </div> 
    <Button
    disabled={loading}
    className="bg-transparent hover:bg-gray-100 text-black my-10 "
    onClick={StartStopRecording}
    >
    {isRecording ? 
  <h2 className='text-red-600 animate-pulse flex gap-2 item-center'>
    <StopCircle /> stop Recording
  </h2>
 : 
  <h2 className='text-blue flex gap-2 items-center'>
    <Mic /> Record Answer
  </h2> 
} 
      
      
      </Button>

     
    
    </div>
  )
}

export default RecordAnswerSection
 