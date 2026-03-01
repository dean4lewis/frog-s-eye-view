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
import LoginScreen from "@/components/LoginScreen";
import SubmarineView from "@/components/SubmarineView";
import CommsView from "@/components/CommsView";
import MonitoringView from "@/components/MonitoringView";
import RadarView from "@/components/RadarView";
import DroneAircraftView from "@/components/DroneAircraftView";
import AgentView from "@/components/AgentView";
import AnalysisView from "@/components/AnalysisView";
import OperationsView from "@/components/OperationsView";
import DigitalMonitorView from "@/components/DigitalMonitorView";
import ReportsView from "@/components/ReportsView";
import DatabaseView from "@/components/DatabaseView";
import MapModesView from "@/components/MapModesView";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [booting, setBooting] = useState(true);
  const [terminalMessage, setTerminalMessage] = useState<string | undefined>();
  const [authenticated, setAuthenticated] = useState(false);
  const [userCodename, setUserCodename] = useState("");

  const openTerminal = (msg?: string) => {
    setTerminalMessage(msg);
    setTerminalOpen(true);
  };

  const handleLogin = (codename: string) => {
    setUserCodename(codename);
    setAuthenticated(true);
  };

  if (!authenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

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
      case "submarines":
        return <SubmarineView />;
      case "comms":
        return <CommsView />;
      case "monitoring":
        return <MonitoringView />;
      case "radar":
        return <RadarView />;
      case "drones":
        return <DroneAircraftView />;
      case "agents":
        return <AgentView />;
      case "analysis":
        return <AnalysisView />;
      case "operations":
        return <OperationsView />;
      case "digital":
        return <DigitalMonitorView />;
      case "reports":
        return <ReportsView />;
      case "database":
        return <DatabaseView />;
      case "mapmodes":
        return <MapModesView />;
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
