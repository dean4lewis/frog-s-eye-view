import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, AlertTriangle } from "lucide-react";

const VALID_CODENAMES = [
  "AN91840491831",
  "TOM918491568140",
  "PEMP4814813013",
  "ADMIN1337",
  "STAFFSUS020820",
  "SENOPATITANPALENC4N4",
];

interface LoginScreenProps {
  onLogin: (codename: string) => void;
}

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [codename, setCodename] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (VALID_CODENAMES.includes(codename.trim())) {
        onLogin(codename.trim());
      } else {
        setError("ACCESS DENIED — Invalid division codename");
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="h-screen w-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 intel-grid opacity-30" />
      <div className="absolute inset-0 scan-line pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded bg-secondary border border-border flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h1 className="text-lg font-bold text-foreground tracking-[0.25em]">INTL-SRVID</h1>
          <p className="text-[10px] font-mono text-muted-foreground tracking-[0.2em] mt-1">
            SURVEILLANCE INTELLIGENCE SYSTEM
          </p>
          <div className="w-16 h-px bg-border mx-auto mt-4" />
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-card border border-border rounded p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[9px] font-mono text-muted-foreground tracking-[0.15em]">
                SECURE AUTHENTICATION
              </span>
            </div>

            <label className="block text-[9px] font-mono text-muted-foreground mb-2 tracking-wider">
              DIVISION CODENAME
            </label>
            <input
              type="password"
              value={codename}
              onChange={(e) => {
                setCodename(e.target.value);
                setError("");
              }}
              placeholder="Enter codename..."
              className="w-full bg-muted border border-border rounded px-3 py-2.5 text-xs font-mono text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
              autoFocus
              autoComplete="off"
              spellCheck={false}
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 mt-3 text-[9px] font-mono status-critical"
              >
                <AlertTriangle className="w-3 h-3" />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading || !codename.trim()}
              className="w-full mt-4 bg-secondary border border-border rounded py-2 text-[10px] font-mono text-foreground tracking-wider hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />
                  AUTHENTICATING...
                </span>
              ) : (
                "AUTHENTICATE"
              )}
            </button>
          </div>

          <div className="text-center space-y-1">
            <p className="text-[8px] font-mono text-muted-foreground">
              AES-256 ENCRYPTED · CLASSIFIED ACCESS
            </p>
            <p className="text-[8px] font-mono text-muted-foreground">
              Unauthorized access will be logged and reported
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
