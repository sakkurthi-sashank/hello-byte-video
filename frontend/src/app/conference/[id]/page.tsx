"use client";

import React, { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SocketContext } from "@/context/SocketProvider";

export default function Page() {
  const {
    socket,
    setStream,
    myVideo,
    setMe,
    setCall,
    userVideo,
    callAccepted,
    callEnded,
    name,
    stream,
    setName,
    callUser,
    leaveCall,
    answerCall,
    call,
    me,
  } = useContext(SocketContext);

  const { id } = useParams();
  const [idToCall, setIdToCall] = useState("");

  useEffect(() => {
    if (!id) return;
    setIdToCall(id as string);

    if (!me) {
      socket.on("me", (id) => setMe(id));
    }

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) myVideo.current.srcObject = currentStream;
      });

    socket.on("callUser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
  }, [id, me]);

  useEffect(() => {
    if (!name) {
      setName(`User ${me}`);
    }
  }, []);

  const showMyVideo = stream && (
    <div className="h-96">
      <video
        playsInline
        muted
        ref={myVideo}
        autoPlay
        className="w-full h-full"
      />
    </div>
  );

  const showUserVideo = (
    <div className="rounded-md bg-black/80 overflow-hidden">
      <video
        playsInline
        muted={callAccepted && !callEnded}
        ref={userVideo}
        autoPlay
        className="w-full h-full"
      />
    </div>
  );

  const handleCallAction =
    callAccepted && !callEnded ? leaveCall : () => callUser(idToCall);
  const callButtonLabel = callAccepted && !callEnded ? "Hang Up" : "Call";

  const incomingCallSection = call.isReceivingCall && !callAccepted && (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-white text-2xl font-medium font-inter antialiased">
        {call.name} is calling...
      </h1>
      <button
        onClick={answerCall}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md font-medium font-inter text-base antialiased"
      >
        Answer
      </button>
    </div>
  );

  const shareLinkActivate = me === id;

  return (
    <div className="bg-black h-screen flex flex-col">
      <div className="flex flex-grow">
        <div className="w-2/6 p-4">
          <div className="rounded-md overflow-hidden">{showMyVideo}</div>
          {shareLinkActivate && (
            <h4 className="pt-4 text-base font-medium font-inter text-gray-300 antialiased">
              Share your ID with your friend:{" "}
              <span className="bg-blue-500 text-white px-2 py-1 font-normal antialiased rounded-md">
                {`${window.location.origin}/conference/${me}`}
              </span>
            </h4>
          )}
          <div className="p-4">
            <button
              onClick={handleCallAction}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-xl font-medium font-inter text-base antialiased"
            >
              {callButtonLabel}
            </button>
          </div>
        </div>
        <div className="w-4/6 p-4">{showUserVideo}</div>
      </div>

      {incomingCallSection}
    </div>
  );
}
