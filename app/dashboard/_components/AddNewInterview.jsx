"use client"
import React, { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"


function AddNewInterview() {
    const [openDialog, setOpenDialog]=useState(false)
    const [jobPosition,setJobPosition]=useState(" ");
  const [jobDesc,setJobDesc]=useState(" ");
  const [jobExperience,setJobExperience]=useState(" ");

  const onSubmit=()=>{
        console.log(jobPosition,jobDesc,jobExperience)
  }
  return (
    <div>
     <div className='p-10 border rounded-lg bg-secondary 
     hover:scale-105 hover:shadow-md cursor-pointer 
     transition-all'
     onClick={()=>setOpenDialog(true)}
     >
     <h2 className="text-lg text-center">+ Add New</h2>
     </div>
     <Dialog open={openDialog} onOpenChange={setOpenDialog}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
    <DialogTitle className="text-2xl">Tell us more about your job interviewing</DialogTitle>
      
      <DialogDescription>
        <form onSubmit={onSubmit}>
        <div>
            <h2 className="font-bold text-2xl"></h2>
            <h2>Add Details about your job position/role, Job decription and years of experience</h2>
            <div className="mt-7 my-3">
            <label>Job Role/Job Position</label>
            <Input placeholder="Ex. Full Stack Developer" required
                  onChange={(event)=>setJobPosition(event.target.value)}/>

            </div>
            <div className="my-3">
            <label>Job Description/ Tech Stack (In Short)</label>
            <Textarea placeholder="Ex. React, Angular, NodeJs, MySql etc" required 
                  onChange={(event)=>setJobDesc(event.target.value)}/>

            </div>
            <div className="my-3">
            <label>Years of experience</label>
            <Input placeholder="Ex. 5" type="number" max="100" required
                  onChange={(event)=>setJobExperience(event.target.value)}/>

            </div>
            </div>
            <div className='flex gap-5 justify-end'>
            <Button type="button" variant="ghost" onClick={()=>setOpenDialog(false)}>Cancel</Button>
            <Button type="submit">Start Interview</Button>
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
