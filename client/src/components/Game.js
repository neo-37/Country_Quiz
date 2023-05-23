import React from "react";
import { useState, useRef, useEffect } from "react";
import "../styles.css";
import axios from "axios";
import Cookies from "js-cookie";

function Game({ showFinalStats, setCurUserFinalStats }) {
  const nameRef = useRef(["", "", "", "", "", "", "", "", "", "", "", ""]);
  const [attempts, setAttempts] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [currentInputIndex, setCurrentInputIndex] = useState(0);
  const inputRefs = useRef([]);
  const arr = [
    "Mongolia",
    "Germany",
    "New Zealand",
    "Somalia",
    "Australia",
    "South Korea",
    "Spain",
    "Japan",
    "Namibia",
    "Egypt",
    "China",
    "India",
  ];

  const timeRef = useRef(0);
  const totalTimeRef = useRef(0);
  //const intervalRef = useRef(null);
  const timePassedRef = useRef([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  //const startTimerRef=useRef(false);

  //correct way to run a timer as cleanup is imp
  useEffect(() => {
    // setinterval returns an id of the timer so that we can use the id to stop it after we are done
    const intervalId = setInterval(() => {
      //c hold he the value of totalTime,using totalTime in set state is not suggested
      totalTimeRef.current = totalTimeRef.current + 0.01;
    }, 10);
    return () => clearInterval(intervalId); //cleanup function provided by useEffect can be used to clear the timer with the help of clearInteval method
  }, []);

  //IMP:The setState function in React, including setAttempts in your case, does not work synchronously and
  //cannot be directly controlled using async/await syntax. This is because React batches state updates for performance reasons,
  //and therefore, the state updates may not be immediately reflected.
  useEffect(() => {
    if (currentInputIndex < 12) inputRefs.current[currentInputIndex].focus();

    console.log("attempts", attempts);
    //this is how we can make use of async await inside function which directly don't support them
    const send_and_show_stats = async () => {
      if (currentInputIndex === 12) {
        await send_user_stats(); //without await here rank 1 is shown as rank zero as finals stats need this data to match from database,then update and show
        showFinalStats();
      }
    };
    send_and_show_stats();
  }, [attempts, currentInputIndex]);
  //IMP:This way, the logic that relies on the updated state values will be executed after the state has been updated correctly,
  //addressing the issue you encountered.

  const send_user_stats = async () => {
    await axios
      .post(process.env.REACT_APP_BACKEND_URI + "/user_stats", {
        puzzle_cookie: Cookies.get("puzzle_cookie"),
        total_time: Number(totalTimeRef.current.toFixed(2)),
        attempts_ar: attempts,
      })
      .then((res) => {
        //processed user stats received from server
        console.log("sent_user_stats", res.data);
        setCurUserFinalStats(res.data);
      })
      .catch((err) => {
        console.log("send_user_stats fn in Game", err);
      });
  };

  const handleKeyDown = async (event, index) => {
    if (event.key === "Enter") {
      //trim to remove empty spaces from end of string
      if (
        event.target.value.trim().toLowerCase() ===
        arr[index].toLocaleLowerCase()
      ) {
        timePassedRef.current[index] = Number(
          (totalTimeRef.current - timeRef.current).toFixed(2)
        );

        setAttempts((prevAttempts) => {
          const newAttempts = [...prevAttempts];
          newAttempts[index] += 1;
          return newAttempts;
        });

        if (currentInputIndex < inputRefs.current.length) {
          setCurrentInputIndex(currentInputIndex + 1);
          timeRef.current = totalTimeRef.current;
        }
      } else if (event.target.value !== "") {
        nameRef.current[index].value = "";
        setAttempts((prevAttempts) => {
          const newAttempts = [...prevAttempts];
          newAttempts[index] += 1;
          return newAttempts;
        });
      }
    }
  };

  return (
    <div id="top">
      <div>
        <a
          className="btn btn-outline-primary"
          href="https://earth.google.com/web/data=MicKJQojCiExdWxYODNWVkxBVnVZWUpfMk1KcWtDNE5RN2VyOEJjaUU6AwoBMA?authuser=0"
          target="blank"
          id="googleearth"
          //onClick={()=>{setTimeout(()=>{startTimerRef.current=true},15*1000)}}
        >
          Start Exploring
        </a>
      </div>
      <div className="outerbox grid-container">
        {arr.map((country, index) => (
          <div key={index} className="grid-item">
            <h3>Level {index + 1}</h3>
            <input
              className="attemptbox"
              type="text"
              placeholder={`Enter name ${index + 1}`}
              //value={names[index]}
              onKeyDown={(event) => handleKeyDown(event, index)}
              //onClick={() => handleInputClick(index)}
              disabled={index !== currentInputIndex}
              //here el holds reference to current html element
              ref={(el) => {
                console.log(`html element ${index}`, el);
                nameRef.current[index] = el;
                inputRefs.current[index] = el;
              }}
            />
            <p>Attempts: {attempts[index]}</p>
            <p>Time: {timePassedRef.current[index]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Game;
