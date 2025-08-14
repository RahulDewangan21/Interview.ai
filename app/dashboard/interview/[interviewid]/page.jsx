'use client'
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Webcam from 'react-webcam';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function Interview() {
    const { interviewid } = useParams();
    const [interviewData, setInterviewData] = useState(null);
    const [webcamEnabled, setWebcamEnabled] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (interviewid) {
            GetInterviewDetails();
        }
    }, [interviewid]);

    const GetInterviewDetails = async () => {
        try {
            const response = await fetch(`/api/interview/${interviewid}`);
            const data = await response.json();

            if (response.ok) {
                setInterviewData(data);
            } else {
                console.error("Error fetching interview:", data.error);
            }
        } catch (error) {
            console.error("Error fetching interview data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center">Loading...</div>;
    if (!interviewData) return <div className="text-center text-red-500">Interview not found.</div>;

    return (
        <div className='my-10 flex justify-center flex-col items-center gap-5'>
            <h2 className='font-bold text-2xl'>Let's Get Started...</h2>

            <div>
                {webcamEnabled ? (
                    <Webcam 
                        onUserMedia={() => setWebcamEnabled(true)}
                        onUserMediaError={() => setWebcamEnabled(false)}
                        mirrored={true}
                        style={{ height: 300, width: 300 }}
                    />
                ) : (
                    <>
                        <WebcamIcon className='h-25 w-full my-7 p-3 bg-secondary rounded-lg border' />
                        <Button className="w-full" onClick={() => setWebcamEnabled(true)}>
                            Enable Webcam and Microphone
                        </Button>
                    </>
                )}
            </div>

            <div>
                <Link href={`/dashboard/interview/${interviewid}/start`}>
                    <Button className="bg-blue-500">Start Interview</Button>
                </Link>
            </div>

            <div className='flex flex-col my-5 gap-5'>
                <h2 className='text-lg'><strong>Job Position:</strong> {interviewData.jobPosition}</h2>
                <h2 className='text-lg'><strong>Job Description/Tech Stack:</strong> {interviewData.jobDesc}</h2>
                <h2 className='text-lg'><strong>Years of Experience:</strong> {interviewData.jobExperience} years</h2>
            </div>

            <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
                <h2 className='flex gap-2 items-center text-yellow-800'>
                    <Lightbulb />
                    <strong>Information</strong>
                </h2>
                <h2 className='mt-3 text-yellow-800'>
                    Enable your Webcam to start your AI-generated Mock interview. It has 5 questions 
                    which you can answer, and after that, you will get a feedback report on your answers.
                    <br />
                    <strong>NOTE:</strong> We never record your video, and you can disable your webcam anytime.
                </h2>
            </div>
        </div>
    );
}

export default Interview;

