import { motion } from "framer-motion";
import { Upload, FileText } from "lucide-react";

interface UploadProgressProps {
  percent: number;
  fileName: string;
}

function truncateName(name: string): string {
  return name.length > 35 ? name.slice(0, 32) + "..." + name.slice(-6) : name;
}

export function UploadProgress({ percent, fileName }: UploadProgressProps) {
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
        <div className="text-center" style={{ marginBottom: "2rem" }}>
          {/* Bouncing Upload Icon */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ marginBottom: "1.5rem" }}
          >
            <div className="icon-container" style={{ margin: "0 auto" }}>
              <Upload style={{ width: "1.75rem", height: "1.75rem", color: "var(--accent-mid)" }} />
            </div>
          </motion.div>

          <h2
            className="font-bold tracking-tight"
            style={{ fontSize: "1.5rem", marginBottom: "0.75rem", color: "var(--text-primary)" }}
          >
            Uploading your video...
          </h2>

          {/* File info pill */}
          <div
            className="inline-flex items-center rounded-full"
            style={{
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              background: "var(--badge-bg)",
              border: "1px solid var(--badge-border)",
            }}
          >
            <FileText style={{ width: "0.875rem", height: "0.875rem", color: "var(--accent-mid)" }} />
            <span
              className="font-medium"
              style={{ fontSize: "0.8125rem", color: "var(--pill-text)" }}
            >
              {truncateName(fileName)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: "1rem" }}>
          <div
            className="flex justify-between items-center"
            style={{ marginBottom: "0.75rem" }}
          >
            <span
              className="font-medium"
              style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}
            >
              Uploading...
            </span>
            <span
              className="font-bold gradient-text"
              style={{ fontSize: "0.875rem" }}
            >
              {percent}%
            </span>
          </div>
          <div className="progress-track">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>

        <p
          className="text-center"
          style={{
            fontSize: "0.75rem",
            color: "var(--text-secondary)",
            opacity: 0.7,
            marginTop: "1rem",
          }}
        >
          Please don't close this tab while uploading
        </p>
      </div>
    </motion.div>
  );
}
