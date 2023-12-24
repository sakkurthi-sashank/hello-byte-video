import React, { createContext, useState, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import Peer, { SignalData } from "simple-peer";

interface CallState {
  isReceivingCall: boolean;
  from: string;
  name: string;
  signal: SignalData | null;
}

interface SocketContextProps {
  call: CallState;
  callAccepted: boolean;
  myVideo: React.RefObject<HTMLVideoElement>;
  userVideo: React.RefObject<HTMLVideoElement>;
  stream: MediaStream | undefined;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  callEnded: boolean;
  setCallEnded: React.Dispatch<React.SetStateAction<boolean>>;
  setStream: React.Dispatch<React.SetStateAction<MediaStream | undefined>>;
  setCall: React.Dispatch<React.SetStateAction<CallState>>;
  setMe: React.Dispatch<React.SetStateAction<string>>;
  me: string;
  callUser: (id: string) => void;
  leaveCall: () => void;
  answerCall: () => void;
  socket: Socket;
}

const socket = io("http://localhost:8080");

const SocketContext = createContext<SocketContextProps>(
  {} as SocketContextProps
);

const ContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState<MediaStream | undefined>(undefined);
  const [name, setName] = useState("");
  const [call, setCall] = useState<CallState>({
    isReceivingCall: false,
    from: "",
    name: "",
    signal: null,
  });
  const [me, setMe] = useState("");

  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<Peer.Instance>();

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data: SignalData) => {
      socket.emit("answerCall", { signal: data, to: call.from });
    });

    peer.on("stream", (currentStream: MediaStream) => {
      if (userVideo.current) userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal!);

    connectionRef.current = peer;
  };

  const callUser = (id: string) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data: SignalData) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });

    peer.on("stream", (currentStream: MediaStream) => {
      if (userVideo.current) userVideo.current.srcObject = currentStream;
    });

    socket.on("callAccepted", (signal: SignalData) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    window.location.reload();
  };

  const contextValue: SocketContextProps = {
    call,
    callAccepted,
    myVideo,
    userVideo,
    stream,
    name,
    setName,
    callEnded,
    me,
    callUser,
    leaveCall,
    answerCall,
    setCallEnded,
    setStream,
    setCall,
    setMe,
    socket,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
