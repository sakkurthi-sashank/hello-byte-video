"use client";

import { SocketContext } from "@/context/SocketProvider";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";

export default function page() {
  const router = useRouter();

  const { me, socket, setMe, setName } = useContext(SocketContext);

  useEffect(() => {
    socket.on("me", (id) => setMe(id));
  }, []);

  return (
    <div className="flex items-center font-inter justify-center min-h-screen flex-col gap-y-10 home_page_background">
      <h1 className="scroll-m-20 text-3xl font-bold tracking-tight lg:text-5xl text-center">
        Hello! Start Your Private Video Conferencing
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        Please Enter your name and click on "Create Conference" to start a
        conference.
      </p>
      <input
        className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 outline-none"
        type="text"
        placeholder="Enter your name here"
        onChange={(e) => setName(e.target.value)}
      />

      <button
        className="text-sm antialiased bg-gray-900 font-medium rounded-lg hover:bg-gray-700 text-white px-4 py-3 duration-300 transition-colors focus:outline-none"
        onClick={() => router.push(`/conference/${me}`)}
      >
        Create Conference
      </button>
    </div>
  );
}
