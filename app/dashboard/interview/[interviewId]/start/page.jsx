"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React,{ useEffect,useState } from 'react'
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function StartInterview({params}) {
  const { interviewId } = React.use(params);
    const [interviewData, setInterviewData] = useState();
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
    const [activeQuestionIndex,setactiveQuestionIndex]=useState(0);

  useEffect(() => {
    GetInterviewDetails(); 
    
  }, []);
   
  /**
   * used to get interview Details by MockId/Interview Id
   */
  const GetInterviewDetails = async () => {
    
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, interviewId))

    const jsonMockResp=JSON.parse(result[0].jsonMockResp)
    console.log(jsonMockResp)
    setMockInterviewQuestion(jsonMockResp);
    setInterviewData(result[0]);
  }

  return (
    <div>
    <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
     <QuestionsSection
      mockInterviewQuestion={mockInterviewQuestion}
      activeQuestionIndex={activeQuestionIndex}
      />

      <RecordAnswerSection
      mockInterviewQuestion={mockInterviewQuestion}
      activeQuestionIndex={activeQuestionIndex}
      interviewData={interviewData}
      />
    </div>
    <div className='flex justify-end gap-6'>
      {activeQuestionIndex>0&& 
      <Button onClick={()=>setactiveQuestionIndex(activeQuestionIndex-1)}>Previous Question</Button>}
      {activeQuestionIndex!=mockInterviewQuestion?.length-1&&
       <Button onClick={()=>setactiveQuestionIndex(activeQuestionIndex+1)}>Next Question</Button>}
      {activeQuestionIndex==mockInterviewQuestion?.length-1&& 
      <Link href={'/dashboard/interview/'+interviewData?.mockId+'/feedback'}>
      <Button>End Interview</Button>
      </Link>}
    </div>
    </div>
  )
} 

export default StartInterview