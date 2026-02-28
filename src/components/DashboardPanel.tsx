import { motion } from "framer-motion";
import { ReactNode } from "react";

interface DashboardPanelProps {
  title: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

const DashboardPanel = ({ title, children, className = "", icon }: DashboardPanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-card border border-border rounded-lg overflow-hidden ${className}`}
    >
      <div className="px-3 py-2 border-b border-border flex items-center gap-2">
        {icon && <span className="text-primary">{icon}</span>}
        <h3 className="text-[10px] font-mono tracking-wider text-muted-foreground uppercase">{title}</h3>
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary pulse-dot" />
      </div>
      <div className="p-3">{children}</div>
    </motion.div>
  );
};

export default DashboardPanel;
