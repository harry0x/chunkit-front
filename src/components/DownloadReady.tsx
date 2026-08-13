import { motion } from "framer-motion";
import { CheckCircle2, Download, Layers, RotateCcw } from "lucide-react";
import { getDownloadUrl } from "../lib/api";

interface DownloadReadyProps {
  jobId: string;
  chunkCount: number;
  fileName: string;
  onReset: () => void;
}

export function DownloadReady({
  jobId,
  chunkCount,
  fileName,
  onReset,
}: DownloadReadyProps) {
  const handleDownload = () => {
    window.open(getDownloadUrl(jobId), "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.97 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full"
      style={{ maxWidth: "40rem", margin: "0 auto", padding: "0 1.5rem" }}
    >
      <div className="glass-card" style={{ padding: "2.5rem 2rem" }}>
        {/* Success Animation */}
        <div className="text-center" style={{ marginBottom: "2rem" }}>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="inline-block"
            style={{ marginBottom: "1.5rem" }}
          >
            <div className="relative">
              <div
                className="flex items-center justify-center rounded-2xl"
                style={{
                  width: "5rem",
                  height: "5rem",
                  background: "var(--badge-bg)",
                  border: "1px solid var(--badge-border)",
                  margin: "0 auto",
                }}
              >
                <CheckCircle2 style={{ width: "2.5rem", height: "2.5rem", color: "var(--success)" }} />
              </div>
              {/* Confetti */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{
                    opacity: 0,
                    scale: 0,
                    x: Math.cos((i * Math.PI * 2) / 8) * 50,
                    y: Math.sin((i * Math.PI * 2) / 8) * 50,
                  }}
                  transition={{ duration: 0.8, delay: 0.4 + i * 0.05 }}
                  className="absolute rounded-full"
                  style={{
                    top: "50%",
                    left: "50%",
                    width: "0.5rem",
                    height: "0.5rem",
                    marginTop: "-0.25rem",
                    marginLeft: "-0.25rem",
                    background: i % 3 === 0 ? "var(--accent-start)" : i % 3 === 1 ? "var(--accent-end)" : "var(--success)",
                  }}
                />
              ))}
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-bold tracking-tight"
            style={{ fontSize: "clamp(1.25rem, 4vw, 1.75rem)", marginBottom: "0.5rem", color: "var(--text-primary)" }}
          >
            Your video is <span className="gradient-text">ready!</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}
          >
            {fileName}
          </motion.p>
        </div>

        {/* Chunk Count */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center"
          style={{ marginBottom: "2rem" }}
        >
          <div className="feature-pill" style={{ gap: "0.5rem" }}>
            <Layers style={{ width: "1rem", height: "1rem", color: "var(--accent-mid)" }} />
            <span style={{ fontSize: "0.875rem" }}>
              <span className="font-bold" style={{ color: "var(--text-primary)" }}>{chunkCount}</span>{" "}
              <span style={{ color: "var(--pill-text)" }}>
                {chunkCount === 1 ? "chunk" : "chunks"} created
              </span>
            </span>
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col items-center justify-center"
          style={{ gap: "0.75rem" }}
        >
          <button
            onClick={handleDownload}
            className="gradient-btn w-full"
            style={{ fontSize: "1.0625rem", padding: "1rem 2rem", maxWidth: "20rem" }}
            id="download-zip-btn"
          >
            <span>
              <Download style={{ width: "1.25rem", height: "1.25rem" }} />
              Download ZIP
            </span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center justify-center font-medium w-full"
            style={{
              gap: "0.5rem",
              padding: "0.875rem 1.5rem",
              borderRadius: "0.75rem",
              fontSize: "0.875rem",
              color: "var(--text-secondary)",
              border: "1px solid var(--border-subtle)",
              background: "transparent",
              cursor: "pointer",
              transition: "all 0.3s",
              maxWidth: "20rem",
            }}
            id="split-another-btn"
          >
            <RotateCcw style={{ width: "1rem", height: "1rem" }} />
            Split another video
          </button>
        </motion.div>

        {/* Stage Dots */}
        <div
          className="flex items-center justify-center"
          style={{ gap: "2rem", marginTop: "2rem" }}
        >
          {["Upload", "Split", "Ready"].map((stage) => (
            <div key={stage} className="flex items-center" style={{ gap: "0.5rem" }}>
              <div
                className="rounded-full"
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  background: "var(--success)",
                  boxShadow: "0 0 6px var(--success)",
                }}
              />
              <span className="font-medium" style={{ fontSize: "0.75rem", color: "var(--success)" }}>
                {stage}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
