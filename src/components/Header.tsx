import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Scissors, Sun, Moon, User, Crown, LogOut, Shield } from "lucide-react";
import { useTheme } from "../theme/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full relative z-10"
      style={{ padding: "1.25rem 1.5rem" }}
    >
      <div className="mx-auto flex items-center justify-between w-full">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center cursor-pointer"
          style={{ gap: "0.75rem" }}
        >
          <div className="relative">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: "2.75rem",
                height: "2.75rem",
                background:
                  "linear-gradient(135deg, var(--accent-start), var(--accent-mid), var(--accent-end))",
                boxShadow: "0 4px 15px rgba(99, 102, 241, 0.25)",
              }}
            >
              <Scissors
                className="text-white"
                style={{ width: "1.25rem", height: "1.25rem" }}
                strokeWidth={2.5}
              />
            </div>
            <div
              className="absolute rounded-xl"
              style={{
                inset: "-4px",
                background:
                  "linear-gradient(135deg, var(--accent-start), var(--accent-end))",
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
        </Link>

        {/* Right side: Theme Toggle (Auth & Membership commented out) */}
        <div className="flex items-center gap-2">
          {/* 
          {isAuthenticated ? (
            <div className="flex items-center gap-2 mr-1 sm:mr-2">
              {user?.role !== "admin" && (
                <Link
                  to="/pricing"
                  className="flex items-center gap-2 font-medium text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Crown style={{ width: "1rem", height: "1rem" }} />
                  <span className="hidden sm:inline">Subscription</span>
                </Link>
              )}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="p-1.5 rounded-full cursor-pointer transition-colors"
                  style={{
                    background: "var(--badge-bg)",
                    border: "1px solid var(--badge-border)",
                    color: "var(--text-primary)",
                  }}
                >
                  <User style={{ width: "1.1rem", height: "1.1rem" }} />
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 z-50"
                    style={{ top: "100%" }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="w-full rounded-xl shadow-lg border overflow-hidden glass-card"
                    >
                      <div className="py-1 flex flex-col">
                        {user?.role === "admin" ? (
                          <Link
                            to="/admin"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-white/10 transition-colors border-b border-border/50"
                          >
                            <Shield className="w-4 h-4 text-primary" />
                            Admin Dashboard
                          </Link>
                        ) : (
                          <Link
                            to="/profile"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-white/10 transition-colors border-b border-border/50"
                          >
                            <User className="w-4 h-4" />
                            Profile Settings
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="block text-sm font-medium text-muted-foreground hover:text-primary transition-colors mr-1 sm:mr-2"
            >
              Sign in
            </Link>
          )} 
          */}

          {/* Theme Toggle */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            onClick={toggleTheme}
            className="p-1.5 rounded-full transition-all duration-300 relative group overflow-hidden"
            style={{
              background: "var(--badge-bg)",
              border: "1px solid var(--badge-border)",
              color: "var(--text-primary)",
            }}
            aria-label="Toggle theme"
          >
            <div className="relative z-10 flex items-center justify-center">
              {theme === "dark" ? (
                <Sun style={{ width: "1.1rem", height: "1.1rem" }} />
              ) : (
                <Moon style={{ width: "1.1rem", height: "1.1rem" }} />
              )}
            </div>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
