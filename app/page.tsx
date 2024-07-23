"use client";
import { createClient } from "@/utils/supabase/client";
import { ChangeEvent, useEffect, useState } from "react";
import { FaPlayCircle } from "react-icons/fa";

export default function Home() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [filex, setFile] = useState<File | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>();
  const [transcription, setTranscription] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserEmail(user?.email);
    };
    getUser();
  }, []);

  const handleFileDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files[0];

    // api call

    if ((file && file.type.includes("audio")) || file.type.includes("video")) {
      setFileName(file.name);
      setFile(file);
      const formData = new FormData();
      formData.append("file", file);
      console.log("FormData created: ", file);
    } else {
      console.log(file.type.includes("audio") || file.type.includes("video"));
      alert("Please upload a valid MP3 or MP4 file.");
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFile(file);
      console.log("filename: ", file);
    } else {
      console.log("Please upload a valid MP3 or MP4 file.");
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleUpload = async () => {
    if (filex) {
      const formData = new FormData();
      formData.append("file", filex);

      const file = formData.get("file");

      console.log("FILE: ", file);

      // send file to open ai
      try {
        const response = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        });
        console.log("sent file to server: ");

        if (!response.ok) {
          console.error(`Error: Something wrong`);
        } else {
          console.log("got file from server: ", response.text);
        }

        const result = await response.json();

        console.log("RESULT: ", result) 
        setTranscription(result.transcription.text);
        setSummary(result.summary.message.content)
        // as this works, we need to save this to a db in supabase per user
        // I think there was an issue with authentication because when I create an account it says an error, but still signs me in, share UI with me i ll try to make new acc
        // send access for terminal I cant give until you req for some reason -- sent the summary UI on discord with the transcrption yea i saw it. kill terminal done reopen now
        // its working without login :D
        // yeah it is supposed to work like that, users dont have to have an account. But it will save to DB if they do.
        // I want to add a button on the upper right to say login or record depending on sign in how can i signup
        // were you able to make an account? i dk how Sorry, something went wrong
        // it should be /login i tried signup but showing this ^^^
        // same here -- lemme check db okay i ll come after 15 min
        
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full text-black space-y-10">
      <div className="absolute top-4 right-4 text-white">{userEmail}</div>
      <div
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}
        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-10 rounded-lg"
      >
        <FaPlayCircle color="gray" className="text-6xl cursor-pointer" />
        <p className="mt-4 self-center text-white">Drag and drop an audio or video file</p>
        <input
          type="file"
          hidden
          accept="audio/*, video/*"
          placeholder="file"
          name="file"
          title="file"
          onChange={handleFileChange}
        />
        {fileName && <p className="mt-2 text-sm text-gray-500">{fileName}</p>}
      </div>
      <button
        disabled={!fileName}
        onClick={handleUpload}
        className="bg-blue-400 text-gray-100 p-2 rounded-lg w-full"
      >
        Upload
      </button>
        <p className="mt-2 text-sm text-gray-500">{transcription}</p>
        <p className="mt-2 text-sm text-gray-500">{summary}</p>

    </div>
  );
}
