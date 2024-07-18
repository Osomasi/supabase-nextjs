"use client";
import { createClient } from "@/utils/supabase/client";
import { ChangeEvent, useEffect, useState } from "react";
import { FaPlayCircle } from "react-icons/fa";

export default function Home() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>();
  const [transcription, setTranscription] = useState<string | null>(null);

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
    if (file) {
      setFileName(file.name);
      setFile(file)
      // send file to open ai
      try {
        const formData = new FormData();
        formData.append('file', file)

        const response = await fetch('./api/openai/transcribe', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        setTranscription(result.transcription)
      } catch (error) {
        alert(error);
      }
    } else {
      alert("Please upload a valid MP3 or MP4 file.");
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFile(file)
      console.log("filename: ", file);
      try {
        const formData = new FormData();
        formData.append('file', file)

        const response = await fetch('./api/openai/transcribe', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        setTranscription(result.transcription)
      } catch (error) {
        alert("Please upload a valid MP3 or MP4 file.");
      }
    } else {;
      alert("Please upload a valid MP3 or MP4 ;file.");
    }
  };
  
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }

  const handleUpload = async () => {
    if (fileName) {
      const formData = new FormData();
      formData.append("file", fileName);

      const file = formData.get("file")

      console.log(file)

      try {
        console.log(fileName);;
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full text-black space-y-10">
      <div className="absolute top-4 right-4">{userEmail}</div>
      <div
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}
        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-10 rounded-lg"
      >
        <FaPlayCircle color="gray" className="text-6xl cursor-pointer" />
        <p className="mt-4">Drag and drop an audio or video file</p>
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
      {transcription && <p className="mt-2 text-sm text-gray-500">{transcription}</p>}

    </div>
  );
}
// setting up open ai keys and folder
