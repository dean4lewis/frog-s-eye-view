import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import DashboardView from "@/components/DashboardView";
import SatelliteView from "@/components/SatelliteView";
import CCTVView from "@/components/CCTVView";
import TargetView from "@/components/TargetView";
import TerminalOverlay from "@/components/TerminalOverlay";
import ScanEffect from "@/components/ScanEffect";
import GlobeScene from "@/components/GlobeScene";
import MilitaryMapView from "@/components/MilitaryMapView";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [booting, setBooting] = useState(true);
  const [terminalMessage, setTerminalMessage] = useState<string | undefined>();

  const openTerminal = (msg?: string) => {
    setTerminalMessage(msg);
    setTerminalOpen(true);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardView onOpenTerminal={() => openTerminal()} />;
      case "globe":
        return (
          <div className="h-full relative">
            <GlobeScene onSatelliteClick={() => openTerminal("Hello Frog Welcome back! how are u today 🐸")} />
          </div>
        );
      case "satellites":
        return <SatelliteView />;
      case "cctv":
        return <CCTVView />;
      case "mapping":
        return <MilitaryMapView />;
      case "targets":
        return <TargetView />;
      case "terminal":
        openTerminal();
        setActiveSection("dashboard");
        return <DashboardView onOpenTerminal={() => openTerminal()} />;
      default:
        return (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h2 className="text-sm font-bold text-foreground mb-1">
                {activeSection.toUpperCase()} MODULE
              </h2>
              <p className="text-[10px] font-mono text-muted-foreground">
                Module sedang dalam pengembangan
              </p>
              <p className="text-[9px] font-mono text-primary mt-2">CLEARANCE REQUIRED</p>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {booting && <ScanEffect onComplete={() => setBooting(false)} />}

      {!booting && (
        <div className="h-screen flex overflow-hidden hex-pattern">
          <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
          <div className="flex-1 flex flex-col min-w-0">
            <TopBar />
            <main className="flex-1 min-h-0 overflow-hidden">
              {renderContent()}
            </main>
          </div>

          <TerminalOverlay
            isOpen={terminalOpen}
            onClose={() => setTerminalOpen(false)}
            initialMessage={terminalMessage}
          />
        </div>
      )}
    </>
  );
};

export default Index;
