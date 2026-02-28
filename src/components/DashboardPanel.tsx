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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-card border border-border rounded overflow-hidden ${className}`}
    >
      <div className="px-2.5 py-1.5 border-b border-border flex items-center gap-1.5">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <h3 className="text-[9px] font-mono tracking-wider text-muted-foreground uppercase">{title}</h3>
      </div>
      <div className="p-2.5">{children}</div>
    </motion.div>
  );
};

export default DashboardPanel;
