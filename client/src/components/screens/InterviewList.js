import React, { useEffect, useState } from "react";
import "./InterviewList.css";
import { useHistory } from "react-router-dom";

const InterviewList = () => {
  let [data, setData] = useState([]);
  useEffect(() => {
    fetch("https://interview-creation-portal.onrender.com/allMeetings")
      .then((res) => res.json())
      .then((data) => {
        setData(data.meetings);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const history = useHistory();
  function calTime(stime) {
    let hr = parseInt(stime / 100);
    let min = (stime % 100) + "";
    let time = hr + ":" + (min.length == 1 ? "0" : "") + min;
    return time;
  }

  return (
    <div className="main">
      <div style={{ textAlign: "center" }}>
        <b>Note: </b>Click on the meetings to edit
      </div>
      <div className="table-header">
        <div className="s4 heading">S. No.</div>
        <div className="s4 heading">Title</div>
        <div className="s4 heading">Interviewer Email</div>
        <div className="s4 heading">Student Email</div>
        <div className="s4 heading">Date</div>
        <div className="s4 heading">Starting Time</div>
        <div className="s4 heading">End Time</div>
      </div>
      {data.map((item, index) => {
        return (
          <div
            onClick={() => {
              history.push("/edit/" + item._id);
            }}
            key={item._id}
            className="table-rows"
          >
            <div className="s4">{index + 1}</div>
            <div className="s4">{item.title}</div>
            <div className="s4">{item.user1.email}</div>
            <div className="s4">{item.user2.email}</div>
            <div className="s4">{item.date}</div>
            <div className="s4">{calTime(item.startTime)}</div>
            <div className="s4">{calTime(item.endTime)}</div>
          </div>
        );
      })}
    </div>
  );
};

export default InterviewList;
