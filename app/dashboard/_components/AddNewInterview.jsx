'use client'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { chatSession } from '@/utils/GeminiAIModel';
import { LoaderCircle } from 'lucide-react';
import { MockInterview } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { db } from '@/utils/db';
import { useRouter } from 'next/navigation';
  

function AddNewInterview() {
    const [openDialog,setopenDialog] = useState(false);
    const [jobPosition,setJobPosition] = useState();
    const [jobDesc,setJobDesc] = useState();
    const [jobExperience,setJobExperience] = useState();
    const [loading,setLoading] = useState(false);
    const [jsonResponse, setJsonResponse] = useState();
    const router=useRouter();
    const {user}=useUser();


    const onSubmit=async(e)=>{
        setLoading(true)
        e.preventDefault();
        console.log(jobPosition,jobExperience,jobDesc);

        const InputPrompt="Job position: "+jobPosition+", Job Description: "+jobDesc+", Years of Experience: "+jobExperience+", Depending on these information give "+process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT+" interview questions along with answers in json format, give questiona and answered in JSON field";
        
        
        const result = await chatSession.sendMessage(InputPrompt);

        const MockJsonResp=(result.response.text()).replace('```json','').replace('```','')
        console.log(JSON.parse(MockJsonResp));
        setJsonResponse(MockJsonResp);

        if(MockJsonResp)
        {
        const resp=await db.insert(MockInterview)
        .values({
            mockId:uuidv4(),
            jsonMockResp:MockJsonResp,
            jobPosition:jobPosition,
            jobDesc:jobDesc,
            jobExperience:jobExperience,
            createdBy:user?.primaryEmailAddress?.emailAddress,
            createdAt:moment().format('DD-MM-yyyy')
        }).returning({mockId:MockInterview.mockId})

        console.log("Inserted ID",resp)
        if(resp){
            setopenDialog(false);
            router.push('/dashboard/interview/'+resp[0]?.mockId)
        }

    }
    else{
        console.log('error');
    }

        setLoading(false);

    }

  return (
    <div>
        <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
        onClick={()=>setopenDialog(true)}
        >
            <h2 className='text-lg text-center'>+ Add New</h2>
        </div>
        <Dialog open={openDialog}>
  
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle className="text-2xl">Give us details for your job interviewing</DialogTitle>
      <DialogDescription>
        <form onSubmit={onSubmit}>
        <div>
            
            <h2>Add about your job role, job description and years of experience</h2>
            <div className='mt-7 my-3'>
                <label>Job Role/Job Position</label>
                <Input placeholder="Ex. Full Stack Developer" required
                onChange={(event)=>setJobPosition(event.target.value)}
                />
            </div>
            <div className=' my-3'>
                <label>Job Description/ Tech Stack</label>
                <Textarea placeholder="Ex. React, Angular, Nodejs, MongoDB etc." required
                 onChange={(event)=>setJobDesc(event.target.value)}/>
            </div>
            <div className=' my-3'>
                <label>Years of experience</label>
                <Textarea placeholder="Ex. 2" type="number" max="50" required
                 onChange={(event)=>setJobExperience(event.target.value)}/>
            </div>
        </div>
        <div className='flex gap-5 justify-center'>
            <Button type="submit" disabled={loading} >
            {loading?
            <>
                <LoaderCircle className='animate-spin'/>Generating Questions
           </>:'Start Interview'
            }</Button>
            <Button type="button" variant="ghost" onClick={()=>setopenDialog(false)}>Cancel</Button>
        </div>
        </form>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

    </div>
  )
}

export default AddNewInterview