import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { Header } from "./components/Header";
import { DropZone } from "./components/DropZone";
import { UploadProgress } from "./components/UploadProgress";
import { ProcessingView } from "./components/ProcessingView";
import { DownloadReady } from "./components/DownloadReady";
import { ErrorView } from "./components/ErrorView";
import { Footer } from "./components/Footer";
import { uploadVideo } from "./lib/api";
import "./index.css";

type AppState = "idle" | "uploading" | "processing" | "done" | "error";

function App() {
  const [state, setState] = useState<AppState>("idle");
  const [uploadPercent, setUploadPercent] = useState(0);
  const [processPercent, setProcessPercent] = useState(0);
  const [jobId, setJobId] = useState<string | null>(null);
  const [chunkCount, setChunkCount] = useState(0);
  const [fileName, setFileName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileSelect = useCallback(async (file: File) => {
    setFileName(file.name);
    setState("uploading");
    setUploadPercent(0);

    try {
      const response = await uploadVideo(file, (percent) => {
        setUploadPercent(percent);
      });

      setJobId(response.jobId);
      setState("processing");
      setProcessPercent(0);
    } catch (err: unknown) {
      let message = "Upload failed. Please try again.";
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { error?: string } } };
        message = axiosErr.response?.data?.error || message;
      }
      setErrorMessage(message);
      setState("error");
    }
  }, []);

  const handleProcessingDone = useCallback((chunks: number) => {
    setChunkCount(chunks);
    setState("done");
  }, []);

  const handleProcessingError = useCallback((message: string) => {
    setErrorMessage(message);
    setState("error");
  }, []);

  const handleReset = useCallback(() => {
    setState("idle");
    setUploadPercent(0);
    setProcessPercent(0);
    setJobId(null);
    setChunkCount(0);
    setFileName("");
    setErrorMessage("");
  }, []);

  return (
    <>
      {/* Animated Background */}
      <div className="bg-scene">
        <div className="bg-orb bg-orb--1" />
        <div className="bg-orb bg-orb--2" />
        <div className="bg-orb bg-orb--3" />
        <div className="bg-orb bg-orb--4" />
      </div>
      <div className="bg-grid" />

      <Header />

      <main
        className="flex-1 flex items-center justify-center"
        style={{ padding: "1rem 0" }}
      >
        <AnimatePresence mode="wait">
          {state === "idle" && (
            <DropZone key="dropzone" onFileSelect={handleFileSelect} />
          )}

          {state === "uploading" && (
            <UploadProgress
              key="upload"
              percent={uploadPercent}
              fileName={fileName}
            />
          )}

          {state === "processing" && jobId && (
            <ProcessingView
              key="processing"
              jobId={jobId}
              onDone={handleProcessingDone}
              onError={handleProcessingError}
              percent={processPercent}
              onPercentUpdate={setProcessPercent}
            />
          )}

          {state === "done" && jobId && (
            <DownloadReady
              key="done"
              jobId={jobId}
              chunkCount={chunkCount}
              fileName={fileName}
              onReset={handleReset}
            />
          )}

          {state === "error" && (
            <ErrorView
              key="error"
              message={errorMessage}
              onRetry={handleReset}
            />
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </>
  );
}

export default App;
