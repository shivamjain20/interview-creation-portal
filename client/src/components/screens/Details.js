import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import styles from "./Details.module.css";

const Details = (props) => {
  var today = new Date().toISOString().split("T")[0];

  const [title, setTitle] = useState("");
  const [email1, setEmail1] = useState("");
  const [email2, setEmail2] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  function calTime(stime) {
    let hr = parseInt(stime / 100) + "";
    let min = (stime % 100) + "";
    let time =
      (hr.length == 1 ? "0" : "") +
      hr +
      ":" +
      (min.length == 1 ? "0" : "") +
      min;
    return time;
  }

  useEffect(() => {
    if (props.function == "edit") {
      fetch("https://interview-creation-portal.onrender.com/meetingDetail/" + props.meetingId)
        .then((res) => res.json())
        .then((data) => {
          data = data.meeting;
          let start = calTime(data.startTime);
          let end = calTime(data.endTime);
          setTitle(data.title);
          setEmail1(data.user1.email);
          setEmail2(data.user2.email);
          setDate(data.date);
          setStartTime(start);
          setEndTime(end);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const onCreateMeetingClickHandler = (e) => {

    e.preventDefault();
    let path = "https://interview-creation-portal.onrender.com/" + props.function;
    if (props.meetingId !== undefined) {
      path += "https://interview-creation-portal.onrender.com/" + props.meetingId;
    }

    fetch(path, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        date,
        startTime,
        endTime,
        email1,
        email2,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success("Saved Successfully");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className={styles.main}>
        <form
          onSubmit={(e) => {
            onCreateMeetingClickHandler(e);
          }}
          className={styles.form}
        >
          <div>
            <div>
              <input
                placeholder="Meeting Title"
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <input
              id="email1"
              type="email"
              placeholder="Enter Interviewer Email"
              value={email1}
              onChange={(e) => setEmail1(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              id="email2"
              type="email"
              placeholder="Enter student email"
              value={email2}
              onChange={(e) => setEmail2(e.target.value)}
              required
            />
          </div>
          <div style={{ marginTop: "20px" }}>
            <label for="date">Meeting Date</label>
            <input
              id="date"
              name="date"
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div style={{ marginTop: "20px" }}>
            <label>Start Time</label>
            <input
              type="time"
              name="start-time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div style={{ marginTop: "20px" }}>
            <label>End Time</label>
            <input
              type="time"
              name="end-time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {props.function === "createMeeting" && (
              <button className={styles["create-meeting"]}>
                Create Meeting
              </button>
            )}
            {props.function === "edit" && (
              <button className={styles["create-meeting"]}>
                Save Edited Data
              </button>
            )}
          </div>
        </form>
      </div>

      <Toaster />
    </>
  );
};

export default Details;
