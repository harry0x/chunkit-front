import { motion } from "framer-motion";
import { Scissors, Sparkles, Sun, Moon } from "lucide-react";
import { useTheme } from "../theme/ThemeContext";

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full relative z-10"
      style={{ padding: "1.25rem 1.5rem" }}
    >
      <div
        className="mx-auto flex items-center justify-between w-full"
      >
        {/* Logo */}
        <div className="flex items-center" style={{ gap: "0.75rem" }}>
          <div className="relative">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: "2.75rem",
                height: "2.75rem",
                background: "linear-gradient(135deg, var(--accent-start), var(--accent-mid), var(--accent-end))",
                boxShadow: "0 4px 15px rgba(99, 102, 241, 0.25)",
              }}
            >
              <Scissors className="text-white" style={{ width: "1.25rem", height: "1.25rem" }} strokeWidth={2.5} />
            </div>
            <div
              className="absolute rounded-xl"
              style={{
                inset: "-4px",
                background: "linear-gradient(135deg, var(--accent-start), var(--accent-end))",
                opacity: 0.15,
                filter: "blur(10px)",
                zIndex: -1,
              }}
            />
          </div>
          <div>
            <h1
              className="font-bold tracking-tight gradient-text"
              style={{ fontSize: "1.25rem", lineHeight: 1.2 }}
            >
              ChunkIt
            </h1>
            <p
              className="font-medium tracking-widest uppercase"
              style={{
                fontSize: "0.6rem",
                color: "var(--text-muted)",
                marginTop: "-1px",
              }}
            >
              Video Splitter
            </p>
          </div>
        </div>

        {/* Right side: Badge and Theme Toggle */}
        <div className="flex items-center gap-4">
          {/* Right badge */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="hidden sm:flex items-center rounded-full"
            style={{
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              background: "var(--badge-bg)",
              border: "1px solid var(--badge-border)",
            }}
          >
            <Sparkles style={{ width: "0.875rem", height: "0.875rem", color: "var(--accent-mid)" }} />
            <span
              className="font-medium"
              style={{ fontSize: "0.75rem", color: "var(--pill-text)" }}
            >
              Free • No sign-up • Instant
            </span>
          </motion.div>

          {/* Theme Toggle */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            onClick={toggleTheme}
            className="p-2 rounded-full cursor-pointer transition-colors"
            style={{
              background: "var(--badge-bg)",
              border: "1px solid var(--badge-border)",
              color: "var(--text-primary)",
            }}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun style={{ width: "1.25rem", height: "1.25rem" }} />
            ) : (
              <Moon style={{ width: "1.25rem", height: "1.25rem" }} />
            )}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
