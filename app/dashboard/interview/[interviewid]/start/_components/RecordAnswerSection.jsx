'use client'
import { Button } from '@/components/ui/button'
import { Mic, WebcamIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text'
import { toast } from 'sonner'
import { chatSession } from '@/utils/GeminiAIModel'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { db } from '@/utils/db'  
import { UserAnswer } from '@/utils/schema'

function RecordAnswerSection({ mockInterviewQues = [], activeQuestionIndex, interviewData }) {
  const [userAnswer, setUserAnswer] = useState('');
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

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

  const questionsArray = Array.isArray(mockInterviewQues) && mockInterviewQues.length > 0 ? mockInterviewQues : [];
  const questionText = questionsArray[activeQuestionIndex]?.question || "No question found";

  useEffect(() => {
    if (results.length > 0) {
      setUserAnswer(prevAns => prevAns + results[results.length - 1]?.transcript);
    }
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      UpdateUserAnswer();
    }
  }, [userAnswer]);

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  };

  const UpdateUserAnswer = async () => {
    setLoading(true);

    const feedbackPrompt = `
      Question: ${questionText}, 
      User Answer: ${userAnswer}. 
      Based on the user's answer for the given interview question, 
      please provide a rating and feedback (in 3-5 lines) on areas of improvement in JSON format with "rating" and "feedback" fields.
    `;

    const result = await chatSession.sendMessage(feedbackPrompt);
    const mockJsonResp = (await result.response.text()).replace('```json', '').replace('```', '');
    const JsonFeedbackResp = JSON.parse(mockJsonResp);

    // Log the rating and feedback
    console.log('Rating:', JsonFeedbackResp?.rating);
    console.log('Feedback:', JsonFeedbackResp?.feedback);

    // Save to DB
    await db.insert(UserAnswer).values({
      mockIdRef: interviewData?.mockId,
      question: questionText,
      correctAns: questionsArray[activeQuestionIndex]?.answer || '',
      userAns: userAnswer,
      feedback: JsonFeedbackResp?.feedback || '',
      rating: JsonFeedbackResp?.rating || '',
      userEmail: user?.primaryEmailAddress?.emailAddress || '',
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
    });

    toast('User Answer Recorded successfully.');
    setUserAnswer('');
    setLoading(false);
  };

  console.log('mockId:', interviewData?.mockId);


  return (
    <div className='flex items-center justify-center flex-col'>
      <div className='flex flex-col my-20 items-center justify-center rounded-lg p-5'>
        <WebcamIcon width={200} height={200} className='absolute' />
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
        disabled={loading}
        variant="outline"
        className="my-10"
        onClick={StartStopRecording}
      >
        {isRecording ? (
          <h2 className='text-red-600 flex gap-2'>
            <Mic /> Stop Recording
          </h2>
        ) : 'Record Answer'}
      </Button>

      <Button onClick={() => console.log(userAnswer)}>Show Your Answer</Button>
    </div>
  );
}

export default RecordAnswerSection;

