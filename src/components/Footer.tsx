import { motion } from "framer-motion";
import { Shield, Trash2, Lock } from "lucide-react";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      className="w-full relative z-10"
      style={{ padding: "1.5rem 1.5rem 1.25rem" }}
    >
      <div style={{ margin: "0 auto", width: "100%" }}>
        {/* Trust Badges */}
        <div
          className="flex flex-wrap items-center justify-center"
          style={{ gap: "1.5rem", marginBottom: "1rem" }}
        >
          <div className="flex items-center" style={{ gap: "0.5rem" }}>
            <Trash2
              style={{
                width: "0.875rem",
                height: "0.875rem",
                color: "var(--footer-text)",
              }}
            />
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--footer-text)",
                fontWeight: 500,
              }}
            >
              Auto-deleted after download
            </span>
          </div>
          <div
            className="hidden sm:block rounded-full"
            style={{
              width: "3px",
              height: "3px",
              background: "var(--border-glow)",
            }}
          />
          <div className="flex items-center" style={{ gap: "0.5rem" }}>
            <Shield
              style={{
                width: "0.875rem",
                height: "0.875rem",
                color: "var(--footer-text)",
              }}
            />
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--footer-text)",
                fontWeight: 500,
              }}
            >
              Secure & Private
            </span>
          </div>
          <div
            className="hidden sm:block rounded-full"
            style={{
              width: "3px",
              height: "3px",
              background: "var(--border-glow)",
            }}
          />
          <div className="flex items-center" style={{ gap: "0.5rem" }}>
            <Lock
              style={{
                width: "0.875rem",
                height: "0.875rem",
                color: "var(--footer-text)",
              }}
            />
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--footer-text)",
                fontWeight: 500,
              }}
            >
              Safe Encrypted Access
            </span>
          </div>
        </div>

        {/* Divider + Terms */}
        <div
          className="text-center"
          style={{
            borderTop: "1px solid var(--border-subtle)",
            paddingTop: "0.875rem",
          }}
        >
          <p
            style={{
              fontSize: "0.6875rem",
              color: "var(--footer-text)",
              lineHeight: 1.6,
              opacity: 0.8,
            }}
          >
            By using ChunkIt, you confirm you have the right to process the
            uploaded content. No illegal/copyrighted content.
          </p>
          {/* <p
            style={{
              fontSize: "0.6875rem",
              color: "var(--footer-text)",
              marginTop: "0.5rem",
            }}
          >
            Built with ❤️ by{" "}
            <span
              onClick={() =>
                window.open("https://github.com/harry0x", "_blank")
              }
              className="gradient-text cursor-pointer hover:opacity-80 transition-opacity font-bold underline"
            >
              harry0x
            </span>
          </p> */}
        </div>
      </div>
    </motion.footer>
  );
}
