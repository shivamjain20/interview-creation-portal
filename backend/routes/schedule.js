require('dotenv').config()
const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const Meeting=mongoose.model("Meeting");
const User=mongoose.model("User");

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

router.post("/createMeeting",(req,res)=>{
    schedule(req.body,null,res);
})

router.post("/edit/:meetingId",(req,res)=>{
    schedule(req.body,req.params.meetingId,res);
})

function schedule(body,meetingId,res){
    let {title,date,startTime,endTime,email1,email2}=body;
    if(!title || !date || !startTime || !endTime || !email1 || !email2){
        return res.status(422).json({error:"Please add all the fields"});
    }
    if(email1==email2){
        return res.status(422).json({error:"emails cannot be same"});
    }
    let startString=startTime;
    let endString=endTime;
    startTime=timeToNumber(startString);
    endTime=timeToNumber(endString);

    if(endTime<startTime){
        return res.status(422).json({error:"Invalid Time Inputs, Please Retry"});
    }

    // User.findOne({email:email2}).then((data) => {
    //     Meeting.findOne({ user2:data._id}).then((data)=> {
    //         if(data.startTime<=startTime && data.endTime>=startTime && data.date === date) {
    //             return res.status(442).json({error:'Meeting already scheduled'})
    //         }
    //     })
    //     .catch((err)=>console.log(err))
    // }).catch((err)=>console.log(err))
   

    // check if emails are valid
    User.findOne({email:email1})
    .then(savedUser1=>{
        if(!savedUser1){
            return res.status(422).json({error:"Invalid email1"});
        }
        User.findOne({email:email2})
        .then(savedUser2=>{
            if(!savedUser2){
                return res.status(422).
                json({error:"Invalid email2"});
            }

            // check if users are available
            let user1Available=true;
            Meeting.find({ $or: [ {date:date,user1:savedUser1._id}, {date:date,user2:savedUser1._id} ] })
            .then(meetings=>{
                // console.log(meetings);
                for(meeting of meetings){
                    if(meetingId!=null && meetingId==meeting._id){
                        continue;
                    }
                }

                let user2Available=true;
                Meeting.find({ $or: [ {date:date,user1:savedUser2._id}, {date:date,user2:savedUser2._id} ] })
                .then(meetings=>{
                    
                    for(meeting of meetings){
                        if(meetingId!=null && meetingId==meeting._id){
                            continue;
                        }
                        if(startTime < meeting.endTime && meeting.startTime < startTime){
                            user2Available=false;
                            break;
                        }
                    }

                    if(user1Available && user2Available){
                        const meeting=new Meeting({
                            title,
                            date,
                            startTime,
                            endTime,
                            user1:savedUser1,
                            user2:savedUser2
                        })

                        // if meetingId!=null then updateDb else create meeting
                        if(meetingId!=null){
                            Meeting.updateOne({_id:meetingId},{$set:{title,date,startTime,endTime,user1:savedUser1,user2:savedUser2}})
                            .then(result=>{
                                res.json({meeting:result});
                            })
                            .catch(err=>{
                                console.log(err);
                            })
                        }
                        else{
                            meeting.save()
                            .then(result=>{
                                res.json({meeting:result});
                            })
                            .catch(err=>{
                                console.log(err);
                            })
                        }

                        sendMail(title,date,startString,endString,email1,email2,meetingId)

                        
                    }
                    else{
                        return res.status(422).json({"error":"Student is already engaged"});
                    }

                })

            })

        })
        .catch(err=>{
            console.log(err);
        })

    })
    .catch(err=>{
        console.log(err);
    })
}


function sendMail(title,date,startString,endString,email1,email2,meetingId){
    let html=`<div style={{"padding":"10px","display":"flex","justifyContent":"space-evenly","margin":"5px"}}>
                <div className="s4">title</div>
                <div className="s4">email1</div>
                <div className="s4">email2</div>
                <div className="s4">date</div>
                <div className="s4">startTime</div>
                <div className="s4">endTime</div>
            </div>
            <div style={{"padding":"10px","display":"flex","justifyContent":"space-evenly","margin":"5px","backgroundColor":"lightgray"}}>
                <div className="s4">${title}</div>
                <div className="s4">${email1}</div>
                <div className="s4">${email2}</div>
                <div className="s4">${date}</div>
                <div className="s4">${startString}</div>
                <div className="s4">${endString}</div>
            </div>`

    let msg={
        from: '12arpitgoel@gmail.com',
        html
    }
    if(meetingId!=null){
        msg.subject="Meeting Updated"
    }
    else{
        msg.subject="Meeting Created"
    }

    msg.to=email1;
    sgMail
    .send(msg)
    .then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error(error)
    })

    msg.to=email2;
    sgMail
    .send(msg)
    .then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error(error)
    })
}

function timeToNumber(sTime){
    let time=sTime.replace(":","");
    return Number(time);
}

module.exports=router;
