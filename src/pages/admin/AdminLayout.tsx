import { Link, Outlet, useLocation } from "react-router-dom";
import { Users, Settings, LogOut, Home, Sun, Moon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../theme/ThemeContext";

export default function AdminLayout() {
  const location = useLocation();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Plans & Subscriptions", path: "/admin/plans", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="bg-scene">
          <div className="bg-orb bg-orb--1" />
          <div className="bg-orb bg-orb--2" />
        </div>
        <div className="bg-grid" />
      </div>

      {/* Sidebar */}
      <aside className="w-full md:w-64 glass-card rounded-none border-y-0 border-l-0 z-10 flex flex-col">
        <div className="p-6 border-b border-border/50">
          <Link
            to="/"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center border border-primary/50">
              <span className="font-bold text-primary">C</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">
              Admin Panel
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50 space-y-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-foreground/5 hover:text-foreground transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="font-medium">Toggle Theme</span>
          </button>
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-foreground/5 hover:text-foreground transition-colors"
          >
            <Home className="h-5 w-5" />
            <span className="font-medium">Back to App</span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto z-10 relative">
        <Outlet />
      </main>
    </div>
  );
}
