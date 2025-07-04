"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text';

function RecordAnswerSection() {

    

    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
      } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
      });

      useEffect(()=>{

      },[results])



  return (
    <div className='flex items-center justify-center flex-col'>
<div className='flex flex-col my-20 justify-center items-center bg-black rounded-lg p-5'>
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
        height:300,
        width:'100%',
        zIndex:10,
      }}
      />
      
    </div>
    <Button variant="outline" className="my-10"
    onClick={isRecording?stopSpeechToText:startSpeechToText}
    >
        {isRecording?
        <h2>
            <Mic/>'Recording......'
        </h2>
        :
        
         'Record Answer'}</Button>
    
    </div>
  )
}

export default RecordAnswerSection


