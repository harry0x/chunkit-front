import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Scissors, Loader2 } from "lucide-react";
import { getJobStatus, type StatusResponse } from "../lib/api";

interface ProcessingViewProps {
  jobId: string;
  onDone: (chunkCount: number) => void;
  onError: (message: string) => void;
  percent: number;
  onPercentUpdate: (percent: number) => void;
}

export function ProcessingView({
  jobId,
  onDone,
  onError,
  percent,
  onPercentUpdate,
}: ProcessingViewProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const pollStatus = async () => {
      try {
        const data: StatusResponse = await getJobStatus(jobId);

        if (data.percent !== undefined) {
          onPercentUpdate(data.percent);
        }

        if (data.status === "done") {
          if (intervalRef.current) clearInterval(intervalRef.current);
          onDone(data.chunkCount ?? 0);
        } else if (data.status === "failed") {
          if (intervalRef.current) clearInterval(intervalRef.current);
          onError(data.error ?? "Processing failed");
        }
      } catch {
        // Silently retry
      }
    };

    intervalRef.current = setInterval(pollStatus, 2000);
    pollStatus();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [jobId, onDone, onError, onPercentUpdate]);

  const displayPercent = Math.min(percent, 99);

  const stages = [
    { label: "Upload", done: true, active: false },
    { label: "Splitting", done: false, active: true },
    { label: "Ready", done: false, active: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.97 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full"
      style={{ maxWidth: "40rem", margin: "0 auto", padding: "0 1.5rem" }}
    >
      <div
        className="glass-card"
        style={{
          padding: "2.5rem 2rem",
          animation: "pulse-glow 3s ease-in-out infinite",
        }}
      >
        <div className="text-center" style={{ marginBottom: "2rem" }}>
          {/* Animated Scissors Icon */}
          <div
            className="relative inline-block"
            style={{ marginBottom: "1.5rem" }}
          >
            <motion.div
              animate={{ rotate: [0, -12, 12, 0] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="icon-container" style={{ margin: "0 auto" }}>
                <Scissors
                  style={{
                    width: "1.75rem",
                    height: "1.75rem",
                    color: "var(--accent-mid)",
                  }}
                />
              </div>
            </motion.div>
            <motion.div
              className="absolute"
              style={{
                bottom: "-0.5rem",
                left: "50%",
                transform: "translateX(-50%)",
              }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {/* <Loader2
                className="animate-spin "
                style={{
                  width: "1rem",
                  height: "1rem",
                  color: "var(--accent-end)",
                }}
              /> */}
            </motion.div>
          </div>

          <h2
            className="font-bold tracking-tight"
            style={{
              fontSize: "1.5rem",
              marginBottom: "0.5rem",
              color: "var(--text-primary)",
            }}
          >
            Splitting your video into chunks...
          </h2>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--text-secondary)",
              opacity: 0.8,
            }}
          >
            Re-encoding for precise cuts...
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div
            className="flex justify-between items-center"
            style={{ marginBottom: "0.75rem" }}
          >
            <span
              className="font-medium"
              style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}
            >
              Processing video...
            </span>
          </div>
          <div className="progress-track" style={{ overflow: "hidden", position: "relative" }}>
            <motion.div
              className="progress-fill"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              style={{ width: "50%", position: "absolute", left: 0, top: 0, bottom: 0 }}
            />
          </div>
        </div>

        {/* Stage Dots */}
        <div
          className="flex items-center justify-center"
          style={{ gap: "2rem" }}
        >
          {stages.map((stage) => (
            <div
              key={stage.label}
              className="flex items-center"
              style={{ gap: "0.5rem" }}
            >
              <div
                className="rounded-full"
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  transition: "all 0.5s",
                  background: stage.done
                    ? "var(--success)"
                    : stage.active
                      ? "var(--accent-mid)"
                      : "var(--badge-bg)",
                  boxShadow: stage.done
                    ? "0 0 6px var(--success)"
                    : stage.active
                      ? "0 0 8px var(--accent-mid)"
                      : "none",
                }}
              />
              <span
                className="font-medium"
                style={{
                  fontSize: "0.75rem",
                  transition: "color 0.3s",
                  color: stage.done
                    ? "var(--success)"
                    : stage.active
                      ? "var(--text-primary)"
                      : "var(--text-secondary)",
                }}
              >
                {stage.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
