import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorViewProps {
  message: string;
  onRetry: () => void;
}

export function ErrorView({ message, onRetry }: ErrorViewProps) {
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
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            style={{ marginBottom: "1.5rem" }}
          >
            <div
              className="flex items-center justify-center rounded-2xl"
              style={{
                width: "5rem",
                height: "5rem",
                background: "rgba(248, 113, 113, 0.1)",
                border: "1px solid rgba(248, 113, 113, 0.2)",
                margin: "0 auto",
              }}
            >
              <AlertTriangle style={{ width: "2.5rem", height: "2.5rem", color: "var(--error)" }} />
            </div>
          </motion.div>

          <h2
            className="font-bold tracking-tight"
            style={{ fontSize: "1.5rem", marginBottom: "0.75rem", color: "var(--text-primary)" }}
          >
            Something went wrong
          </h2>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--text-secondary)",
              maxWidth: "24rem",
              margin: "0 auto 2rem",
              lineHeight: 1.6,
            }}
          >
            {message}
          </p>

          <button
            onClick={onRetry}
            className="gradient-btn"
            style={{ padding: "1rem 2.5rem" }}
            id="try-again-btn"
          >
            <span>
              <RotateCcw style={{ width: "1.25rem", height: "1.25rem" }} />
              Try Again
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
