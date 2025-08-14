'use client'
import React, { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

function StartInterview() {
    const { interviewid } = useParams(); 
    const [interviewData, setInterviewData] = useState(null);
    const [mockInterviewQues, setMockInterviewQues] = useState([]); // Ensure an array
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

    useEffect(() => {
        if (interviewid) {
            GetInterviewDetails();
        }
    }, [interviewid]);

    const GetInterviewDetails = async () => {
        try {
            const result = await db
                .select()
                .from(MockInterview)
                .where(eq(MockInterview.mockId, interviewid));
    
            if (result.length > 0) {
                const jsonMockResp = JSON.parse(result[0].jsonMockResp);
                console.log("Parsed mock interview questions:", jsonMockResp);
    
                // Convert object to array if necessary
                let questionsArray = [];
                if (Array.isArray(jsonMockResp)) {
                    questionsArray = jsonMockResp;
                } else if (typeof jsonMockResp === "object" && jsonMockResp !== null) {
                    questionsArray = Object.values(jsonMockResp);
                } else {
                    console.error("Invalid mock interview data:", jsonMockResp);
                }
    
                setMockInterviewQues(questionsArray);
                setInterviewData(result[0]);
            } else {
                console.error("No interview found with ID:", interviewid);
            }
        } catch (error) {
            console.error("Error fetching interview data:", error);
        }
    };
    
    console.log(mockInterviewQues.length, activeQuestionIndex);

    return (
        <div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
            <QuestionsSection 
                mockInterviewQues={mockInterviewQues} 
                activeQuestionIndex={activeQuestionIndex}
            />
            <RecordAnswerSection 
                mockInterviewQues={mockInterviewQues} 
                activeQuestionIndex={activeQuestionIndex}
                interviewData={interviewData}
            />
        </div>
    

        {mockInterviewQues.length > 0 && (
  <div className='flex justify-end gap-6 mt-6'>
    {activeQuestionIndex > 0 && (
      <Button onClick={() => setActiveQuestionIndex((prev) => prev - 1)}>
        Previous Question
      </Button>
    )}
    {activeQuestionIndex < mockInterviewQues.length - 1 && (
      <Button onClick={() => setActiveQuestionIndex((prev) => prev + 1)}>
        Next Question
      </Button>
    )}
    {activeQuestionIndex === mockInterviewQues.length - 1 && (
      <Button onClick={() => console.log('Interview Ended')}>
        End Interview
      </Button>
    )}
  </div>
)}
   
    </div>
    );
}

export default StartInterview;


