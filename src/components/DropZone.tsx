import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileVideo, Film, Zap, ShieldCheck, Clock } from "lucide-react";

const ALLOWED_EXTENSIONS = [".mp4", ".mov", ".mkv", ".avi", ".webm"];
const MAX_UPLOAD_SIZE_MB = 1024;

interface DropZoneProps {
  onFileSelect: (file: File) => void;
}

export function DropZone({ onFileSelect }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragOver(true);
    } else if (e.type === "dragleave") {
      setIsDragOver(false);
    }
  }, []);

  const validateAndProcess = useCallback(
    (file: File) => {
      setError(null);
      const ext = "." + file.name.split(".").pop()?.toLowerCase();

      // Skip mimetype check because OS drag-and-drop sometimes provides empty mimetypes
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        setError(`Unsupported format. Please use ${ALLOWED_EXTENSIONS.join(", ")}`);
        return;
      }

      const sizeInMB = file.size / (1024 * 1024);
      if (sizeInMB > MAX_UPLOAD_SIZE_MB) {
        setError(`File is too large. Maximum size is ${MAX_UPLOAD_SIZE_MB}MB.`);
        return;
      }

      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        validateAndProcess(e.dataTransfer.files[0]);
      }
    },
    [validateAndProcess]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files.length > 0) {
        validateAndProcess(e.target.files[0]);
      }
    },
    [validateAndProcess]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.97 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full flex flex-col items-center"
      style={{ maxWidth: "56rem", margin: "0 auto", padding: "0 1.5rem" }}
    >
      <div className="text-center" style={{ marginBottom: "3rem" }}>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-bold tracking-tight"
          style={{
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            lineHeight: 1.1,
            marginBottom: "1rem",
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
          }}
        >
          Split your videos into
          <br />
          <span className="gradient-text">1-minute chunks</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mx-auto"
          style={{
            fontSize: "clamp(1.125rem, 2vw, 1.25rem)",
            color: "var(--text-secondary)",
            maxWidth: "32rem",
            lineHeight: 1.5,
          }}
        >
          Upload any video and get perfectly split chunks in a ZIP.{" "}
          <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>High quality. No sign-up.</span>
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="glass-card w-full"
        style={{ padding: "2.5rem 2rem", maxWidth: "48rem", marginBottom: "3rem" }}
      >
        <div
          className={`dropzone ${isDragOver ? "drag-over" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-upload")?.click()}
          style={{
            padding: "3.5rem 2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            flexWrap: "wrap",
          }}
        >
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept="video/*"
            onChange={handleChange}
          />

          {/* Upload Icon */}
          <motion.div
            animate={isDragOver ? { scale: 1.15, y: -5 } : { scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{ marginBottom: "1.25rem" }}
          >
            <div className="icon-container" style={{ margin: "0 auto", background: "var(--badge-bg)" }}>
              {isDragOver ? (
                <FileVideo style={{ width: "1.75rem", height: "1.75rem", color: "var(--accent-end)" }} />
              ) : (
                <Upload style={{ width: "1.75rem", height: "1.75rem", color: "var(--accent-mid)" }} />
              )}
            </div>
          </motion.div>

          <p
            className="font-semibold"
            style={{ fontSize: "1.0625rem", color: "var(--text-primary)", marginBottom: "0.375rem" }}
          >
            {isDragOver ? "Drop it right here!" : "Drag & drop your video here"}
          </p>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginBottom: "1.25rem", opacity: 0.9 }}>
            or click anywhere to browse files
          </p>

          {/* Format & Size Pills */}
          <div
            className="flex flex-wrap items-center justify-center"
            style={{ gap: "0.625rem" }}
          >
            <span className="feature-pill badge-glow">
              <Film style={{ width: "0.875rem", height: "0.875rem", color: "var(--accent-mid)" }} />
              MP4, MOV, MKV, AVI, WebM
            </span>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: "1rem" }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="text-center overflow-hidden"
            >
              <p style={{ color: "var(--error)", fontSize: "0.875rem", fontWeight: 500 }}>
                {error}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Feature Cards Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="w-full flex flex-col sm:flex-row flex-wrap justify-center"
        style={{ gap: "1.5rem", maxWidth: "48rem", width: "100%" }}
      >
        {/* Card 1 */}
        <div className="feature-card flex-1 min-w-[200px]">
          <div className="mb-3 flex justify-center">
            <Zap style={{ width: "1.5rem", height: "1.5rem", color: "var(--accent-start)" }} />
          </div>
          <h3 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Precise Cuts</h3>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
            Exactly 1-minute segments
          </p>
        </div>
        
        {/* Card 2 */}
        <div className="feature-card flex-1 min-w-[200px]">
          <div className="mb-3 flex justify-center">
            <ShieldCheck style={{ width: "1.5rem", height: "1.5rem", color: "var(--accent-mid)" }} />
          </div>
          <h3 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>High Quality</h3>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
            Fast H.264 re-encoding
          </p>
        </div>
        
        {/* Card 3 */}
        <div className="feature-card flex-1 min-w-[200px]">
          <div className="mb-3 flex justify-center">
            <Clock style={{ width: "1.5rem", height: "1.5rem", color: "var(--accent-end)" }} />
          </div>
          <h3 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>Auto Cleanup</h3>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
            Files deleted after download
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
