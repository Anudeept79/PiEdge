import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis
} from 'recharts';
import {
  LayoutDashboard,
  Building2,
  Router,
  Activity,
  Cloud,
  Cpu,
  Bell,
  Search,
  ChevronRight,
  Menu,
  RefreshCw,
  Plus,
  Trash2,
  UploadCloud,
  X,
  AlertTriangle,
  Sliders,
  CheckCircle,
  SlidersHorizontal,
  MapPin,
  Eye,
  History,
  CloudDownload,
  Smartphone,
  Command,
  Network,
  Settings,
  Zap,
  ArrowRight,
  Upload,
  Circle,
  Monitor
} from 'lucide-react';

// ==========================================
// 1. MOCK DATA INITIAL STRUCTURE
// ==========================================

const INITIAL_ORGS = [
  { id: "org_1", name: "Pipra Solutions", agent: "Satyendra Singh", locCount: 2,
    address: "4th floor, Ruby Block, Fairmount Square, 413 & 414, Brundavan Colony, Kompally, Hyderabad, Telangana 500100",
    lat: 17.4399, lng: 78.4983, email: "admin@pipra.io" },
  { id: "org_2", name: "Acme Corporation", agent: "John", locCount: 1,
    address: "Acme Corporation, Industrial Park, Chennai",
    lat: 13.0827, lng: 80.2707, email: "john@acme.com" },
];

const INITIAL_LOCATIONS = [
  { id: "loc_1", orgId: "org_1", name: "Hyderabad HQ", address: "Kompally, Hyderabad", lat: 17.4399, lng: 78.4983, poc: "Satyendra Singh" },
  { id: "loc_2", orgId: "org_1", name: "Hitech Office", address: "Hitech City, Hyderabad", lat: 17.4504, lng: 78.3808, poc: "Rupesh" },
  { id: "loc_3", orgId: "org_2", name: "Acme Plant", address: "Industrial Park, Chennai", lat: 13.0827, lng: 80.2707, poc: "John" },
];

const INITIAL_GROUPS = [
  { id: "grp_1", locId: "loc_1", name: "HQ Floor 4 Data Loggers", desc: "Data Logger gateways on Floor 4", type: "DATA LOGGERS", status: "ACTIVE", fw: "v3.0", cap: 50, awsPolicy: "PiEdgeSensorPolicy", awsThingGroup: "PLEDGE_Group_1_HQ_FLOOR_4_DATA LOGGERS", awsArn: "arn:aws:iot:ap-south-1:123456:thinggroup/PLEDGE_Group_1", awsStatus: "INTEGRATED" },
  { id: "grp_2", locId: "loc_1", name: "Server Room Sensors", desc: "Temp & humidity in server room", type: "SENSORS", status: "ACTIVE", fw: "v3.0", cap: 30, awsPolicy: "PiEdgeSensorPolicy", awsThingGroup: "PLEDGE_Group_3_Server_Room_Sensors", awsArn: "arn:aws:iot:ap-south-1:123456:thinggroup/PLEDGE_Group_3", awsStatus: "INTEGRATED" },
  { id: "grp_3", locId: "loc_2", name: "Hitech Data Loggers", desc: "Data Logger cluster at Hitech campus", type: "DATA LOGGERS", status: "ACTIVE", fw: "v2.1", cap: 50, awsStatus: "PENDING", awsPolicy: "", awsThingGroup: "", awsArn: "" },
  { id: "grp_4", locId: "loc_2", name: "Hitech Env Sensors", desc: "Environment monitoring at Hitech", type: "SENSORS", status: "ACTIVE", fw: "v3.0", cap: 30, awsStatus: "PENDING", awsPolicy: "", awsThingGroup: "", awsArn: "" },
  { id: "grp_5", locId: "loc_3", name: "Acme Line A Sensors", desc: "Conveyor line A sensor cluster", type: "SENSORS", status: "ACTIVE", fw: "v3.0", cap: 20, awsStatus: "PENDING", awsPolicy: "", awsThingGroup: "", awsArn: "" },
  { id: "grp_6", locId: "loc_3", name: "Acme Plant Data Loggers", desc: "Acme plant Data Logger gateway cluster", type: "DATA LOGGERS", status: "ACTIVE", fw: "v3.0", cap: 40, awsStatus: "PENDING", awsPolicy: "", awsThingGroup: "", awsArn: "" },
];

const INITIAL_RPIS = [
  { mac: "CC:DD:EE:FF:00:01", thingName: null, grpId: "grp_1", status: "ONLINE", cpu: 42, ram: 58, fw: "v3.0", lastSeen: "2026-05-25T04:40:27" },
  { mac: "AA:BB:CC:DD:EE:01", thingName: null, grpId: "grp_2", status: "OFFLINE",     cpu: 0, ram: 0, fw: "v3.0", lastSeen: "2026-05-25T05:40:27" },
  { mac: "AA:BB:CC:DD:EE:02", thingName: null, grpId: "grp_3", status: "OFFLINE",     cpu: 0, ram: 0, fw: "v2.1", lastSeen: "2026-05-25T05:38:27" },
  { mac: "AA:BB:CC:DD:EE:03", thingName: null, grpId: "grp_5", status: "OFFLINE",     cpu: 0, ram: 0, fw: "v3.0", lastSeen: "2026-05-25T05:35:27" },
  { mac: "88:A2:9E:1B:34:58", thingName: "88:A2:9E:1B:34:58", grpId: "grp_1", status: "OFFLINE", cpu: 0, ram: 0, fw: "v3.0", lastSeen: "2026-05-25T16:58:00", firstSeen: "2026-05-25T15:34:29" },
];

const INITIAL_SENSORS = [
  { id: "s1", uid: "11:22:33:44:55:01", name: "Server Room Temp 1", cat: "Temperature", type: "Sensor", rpi: "AA:BB:CC:DD:EE:01", grpId: "grp_2", status: "OFFLINE", slot: "12:00–12:15", fw: "v3.0", lastSeen: "2026-05-25T05:39:27" },
  { id: "s2", uid: "11:22:33:44:55:02", name: "Server Room Humidity", cat: "Humidity", type: "Sensor", rpi: "AA:BB:CC:DD:EE:01", grpId: "grp_2", status: "OFFLINE", slot: "12:00–12:15", fw: "v3.0", lastSeen: "2026-05-25T05:38:27" },
  { id: "s3", uid: "11:22:33:44:55:03", name: "Corridor Motion 1", cat: "Motion", type: "NRF52", rpi: "AA:BB:CC:DD:EE:01", grpId: "grp_2", status: "OFFLINE", slot: "12:15–12:30", fw: "v3.0", lastSeen: "2026-05-25T05:32:27" },
  { id: "s4", uid: "11:22:33:44:55:04", name: "Hitech Env Node 1", cat: "Multi", type: "Sensor", rpi: "AA:BB:CC:DD:EE:02", grpId: "grp_4", status: "OFFLINE", slot: "12:30–12:45", fw: "v3.0", lastSeen: "2026-05-25T05:37:27" },
  { id: "s5", uid: "11:22:33:44:55:05", name: "Hitech Env Node 2", cat: "Temperature", type: "Sensor", rpi: "AA:BB:CC:DD:EE:02", grpId: "grp_4", status: "OFFLINE", slot: "12:45–13:00", fw: "v3.0", lastSeen: "2026-05-25T05:25:27" },
  { id: "s6", uid: "11:22:33:44:55:06", name: "Acme Line A Vibration 1", cat: "Multi", type: "NRF52", rpi: "AA:BB:CC:DD:EE:03", grpId: "grp_5", status: "OFFLINE", slot: "13:00–13:15", fw: "v3.0", lastSeen: "2026-05-25T05:39:57" },
  { id: "s7", uid: "11:22:33:44:55:07", name: "Acme Line A Vibration 2", cat: "Multi", type: "NRF52", rpi: "AA:BB:CC:DD:EE:03", grpId: "grp_5", status: "OFFLINE", slot: "13:15–13:30", fw: "v3.0", lastSeen: "2026-05-25T05:39:42" },
  { id: "s8", uid: "PIPRA_NODE_C3", name: "PIPRA_NODE_C3", cat: "Unknown", type: "Unknown", rpi: "Unknown", grpId: null, status: "OFFLINE", slot: null, fw: "—", lastSeen: "2026-05-25T14:57:50" },
];

const INITIAL_NOTIFICATIONS = [
  { id: "n1", type: "error", msg: "8 sensors offline > 6 hours", time: "2m ago" },
  { id: "n2", type: "disc", msg: "New device: 88:A2:9E:1B:34:58 discovered", time: "1h ago" },
  { id: "n3", type: "warning", msg: "OTA update available for 3 devices", time: "3h ago" },
];

// Telemetry mock chart data
const TELEMETRY_MOCK = [
  { time: '00:00', temp: 22.1, hum: 45, throughput: 1.2 },
  { time: '03:00', temp: 21.8, hum: 44, throughput: 1.1 },
  { time: '06:00', temp: 21.5, hum: 47, throughput: 1.4 },
  { time: '09:00', temp: 23.2, hum: 42, throughput: 2.1 },
  { time: '12:00', temp: 24.8, hum: 39, throughput: 2.9 },
  { time: '15:00', temp: 25.1, hum: 41, throughput: 2.5 },
  { time: '18:00', temp: 23.9, hum: 43, throughput: 1.8 },
  { time: '21:00', temp: 22.7, hum: 46, throughput: 1.3 },
];

// Custom Leaflet Icons using SVGs (divIcon)
const getCustomMarkerIcon = (color: string, isPulsing: boolean = false) => {
  return L.divIcon({
    html: `
      <div class="relative flex items-center justify-center w-6 h-6">
        <div class="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.8)]" style="border: 2px solid ${color}">
          <div class="w-1.5 h-1.5 rounded-full" style="background-color: ${color}"></div>
        </div>
        ${isPulsing ? `
          <div class="absolute inset-0 rounded-full animate-ping opacity-60 pointer-events-none" style="border: 2px solid ${color}"></div>
        ` : ''}
      </div>
    `,
    className: 'custom-leaflet-div-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

// ==========================================
// 2. MAIN APPLICATION COMPONENT
// ==========================================

export default function App() {
  return (
    <HashRouter>
      <MainApp />
    </HashRouter>
  );
}

function MainApp() {
  const location = useLocation();
  const navigate = useNavigate();

  // --- Real-time React State ---
  const [orgs, setOrgs] = useState(INITIAL_ORGS);
  const [locations, setLocations] = useState(INITIAL_LOCATIONS);
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [rpis, setRpis] = useState(INITIAL_RPIS);
  const [sensors, setSensors] = useState(INITIAL_SENSORS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const [activeOrgId, setActiveOrgId] = useState("org_1");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toasts, setToasts] = useState<{ id: string; type: 'success' | 'error' | 'info' | 'warning'; msg: string }[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString());
  const [globalRefreshing, setGlobalRefreshing] = useState(false);
  
  // Modals & Panels UI States
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [bellDropdownOpen, setBellDropdownOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'organisation' | 'location' | 'group' | 'sensor' | 'rpi'; id: string; name: string } | null>(null);
  
  // Page 2 (Tree View) States
  const [expandedOrgs, setExpandedOrgs] = useState<string[]>(["org_1"]);
  const [expandedLocs, setExpandedLocs] = useState<string[]>(["loc_1"]);
  const [activeNode, setActiveNode] = useState<{ type: 'org' | 'loc' | 'grp', id: string } | null>({ type: 'org', id: 'org_1' });
  const [showOrgForm, setShowOrgForm] = useState(false);
  const [showLocFormForOrg, setShowLocFormForOrg] = useState<string | null>(null);
  const [showGrpFormForLoc, setShowGrpFormForLoc] = useState<string | null>(null);

  // Page 3 (Data Logger Groups Drawer)
  const [viewGroupDevices, setViewGroupDevices] = useState<typeof INITIAL_GROUPS[0] | null>(null);

  // Page 4 (Fleet) States
  const [fleetTab, setFleetTab] = useState<'rpi' | 'iot'>('rpi');
  const [globalMetricsOpen, setGlobalMetricsOpen] = useState(false);
  const [showOtaModal, setShowOtaModal] = useState<typeof INITIAL_RPIS[0] | null>(null);
  const [showPushScriptModal, setShowPushScriptModal] = useState<typeof INITIAL_RPIS[0] | null>(null);

  // Page 5 (Sensors) States
  const [sensorSearchQuery, setSensorSearchQuery] = useState('');
  const [sensorTypeFilter, setSensorTypeFilter] = useState('');
  const [sensorRpiFilter, setSensorRpiFilter] = useState('');
  const [sensorStatusFilter, setSensorStatusFilter] = useState('');
  const [expandedSensorId, setExpandedSensorId] = useState<string | null>(null);
  const [showSensorDrawer, setShowSensorDrawer] = useState(false);

  // Keyboard shortcut for Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync simulated router paths
  const currentPath = location.pathname === '/' ? '/overview' : location.pathname;

  // Add notification toast
  const addToast = (type: 'success' | 'error' | 'info' | 'warning', msg: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, msg }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Simulated Global Data Refresh
  const handleGlobalRefresh = () => {
    setGlobalRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date().toLocaleTimeString());
      setGlobalRefreshing(false);
      addToast('success', 'Fleet telemetry successfully synchronized');
    }, 1000);
  };

  // --- Dynamic Math Computations (Count-ups) ---
  const kpis = useMemo(() => {
    const streamingRpis = rpis.filter(r => r.status === 'ONLINE').length;
    const idleRpis = rpis.filter(r => r.status === 'OFFLINE' || r.status === 'OFFLINE').length;
    const streamingSensors = sensors.filter(s => s.status === 'ONLINE').length;
    const silentSensors = sensors.filter(s => s.status === 'OFFLINE').length;
    const alerts = notifications.length;

    return {
      locations: locations.filter(l => l.orgId === activeOrgId).length,
      gateways: rpis.length,
      sensors: sensors.length,
      alerts,
      streamingRpis,
      idleRpis,
      streamingSensors,
      silentSensors
    };
  }, [rpis, sensors, locations, notifications, activeOrgId]);

  // AWS Provision Simulation
  const handlePushGroupToAws = (groupId: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          awsStatus: 'INTEGRATING'
        };
      }
      return g;
    }));

    setTimeout(() => {
      setGroups(prev => prev.map(g => {
        if (g.id === groupId) {
          addToast('success', `AWS IoT Core provisioning successful for: ${g.name}`);
          return {
            ...g,
            awsStatus: 'INTEGRATED',
            awsPolicy: "PiEdgeSensorPolicy",
            awsThingGroup: `PLEDGE_${g.name.toUpperCase().replace(/\s+/g, '_')}`,
            awsArn: `arn:aws:iot:ap-south-1:123456789012:thinggroup/PLEDGE_${g.id}`
          };
        }
        return g;
      }));
    }, 1500);
  };

  // Delete Entity Handler
  const handleDeleteConfirm = () => {
    if (!deleteConfirm) return;
    const { type, id } = deleteConfirm;
    
    if (type === 'sensor') {
      setSensors(prev => prev.filter(s => s.id !== id));
      addToast('success', 'BLE sensor removed from deployment successfully.');
    } else if (type === 'group') {
      setGroups(prev => prev.filter(g => g.id !== id));
      addToast('success', 'Location group deleted successfully.');
      if (activeNode?.type === 'grp' && activeNode.id === id) setActiveNode(null);
    } else if (type === 'location') {
      setLocations(prev => prev.filter(l => l.id !== id));
      addToast('success', 'Location removed successfully.');
      if (activeNode?.type === 'loc' && activeNode.id === id) setActiveNode(null);
    } else if (type === 'organisation') {
      setOrgs(prev => prev.filter(o => o.id !== id));
      addToast('success', 'Organisation and all descendants detached.');
      if (activeNode?.type === 'org' && activeNode.id === id) setActiveNode(null);
    }

    setDeleteConfirm(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased">
      
      {/* ==========================================
          GLOBAL TOAST CONTAINER
          ========================================== */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => {
          const accentColor = 
            toast.type === 'success' ? '#10B981' :
            toast.type === 'error' ? '#EF4444' :
            toast.type === 'warning' ? '#F59E0B' : '#2563EB';
          return (
            <div 
              key={toast.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-md pointer-events-auto min-w-[320px] max-w-sm drawer-enter relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-full" style={{ backgroundColor: accentColor }}></div>
              <div className="flex-1 pl-1.5">
                <p className="text-xs font-medium text-slate-500">SYSTEM MESSAGE</p>
                <p className="text-sm font-medium text-slate-900 mt-0.5">{toast.msg}</p>
              </div>
              <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="text-slate-400 hover:text-slate-900 transition-base">
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* ==========================================
          TOP BAR BRAND SHELL
          ========================================== */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-slate-50/80 border-b border-slate-100 backdrop-blur-md z-40 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-base"
          >
            <Menu className="w-4 h-4 text-slate-500" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#2563EB] rounded flex items-center justify-center font-bold tracking-tight text-white text-sm font-semibold shadow-[0_0_12px_rgba(37,99,235,0.4)]">
              W
            </div>
            <span className="font-bold tracking-tight text-base tracking-tight select-none">
              WAREPRO <span className="text-[#2563EB] font-medium text-sm ml-1 font-medium">WMS</span>
            </span>
          </div>
        </div>

        {/* Global Search Pill (Cmd+K) */}
        <button 
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 w-96 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-slate-400 hover:text-slate-500 text-xs font-medium transition-base text-left"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="flex-1">Search fleet...</span>
          <span className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 text-xs flex items-center gap-1"><Command className="w-3 h-3" />K</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <div className="relative">
            <button 
              onClick={() => setBellDropdownOpen(!bellDropdownOpen)}
              className="p-2 rounded-full border border-slate-200 hover:bg-slate-100 transition-base relative"
            >
              <Bell className="w-4 h-4 text-slate-500" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#EF4444] animate-pulse"></span>
              )}
            </button>

            {bellDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setBellDropdownOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-80 glass-panel rounded-xl z-50 p-4 animate-[fadeIn_150ms_ease]">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                    <span className="section-header">Notifications</span>
                    <button 
                      onClick={() => {
                        setNotifications([]);
                        addToast('info', 'All notifications cleared');
                        setBellDropdownOpen(false);
                      }} 
                      className="text-xs text-[#2563EB] hover:text-[#1D4ED8] font-medium"
                    >
                      <CheckCircle className="w-3.5 h-3.5 inline mr-1" /> ALL CLEAR
                    </button>
                  </div>
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 font-medium text-center py-6">No new warnings</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {notifications.map(n => (
                        <div key={n.id} className="p-2.5 rounded-lg bg-white border border-slate-100 flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-medium uppercase font-medium px-1.5 py-0.2 rounded border ${
                              n.type === 'error' ? 'badge badge-offline' :
                              n.type === 'disc' ? 'badge badge-discovered' :
                              'badge badge-pending'
                            }`}>
                              {n.type}
                            </span>
                            <span className="text-xs font-medium text-slate-400">{n.time}</span>
                          </div>
                          <p className="text-xs font-sans text-slate-800">{n.msg}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-100">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-medium text-xs text-emerald-600 font-semibold">
              OP
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-medium text-slate-900">Ops Admin</span>
              <span className="text-xs font-medium text-emerald-600 flex items-center gap-1.5"><Circle className="w-2.5 h-2.5 fill-current" /> HYD_HQ_WMS</span>
            </div>
          </div>
        </div>
      </header>

      {/* ==========================================
          SIDEBAR NAVIGATION SHELL
          ========================================== */}
      <aside 
        className={`fixed top-14 left-0 bottom-0 bg-white border-r border-slate-200 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 flex flex-col justify-between ${
          sidebarCollapsed ? 'w-16' : 'w-[220px]'
        }`}
      >
        <div className="py-6 flex flex-col gap-6 overflow-y-auto">
          {/* Main overview */}
          <div className="px-3">
            <Link 
              to="/overview" 
              className={`flex items-center ${sidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'} rounded-lg text-xs font-medium transition-base ${
                currentPath === '/overview' 
                  ? `bg-blue-50 text-blue-700 font-semibold` 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className={`w-5 h-5 shrink-0 transition-colors ${currentPath === '/overview' ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-900'}`} />
              {!sidebarCollapsed && <span className="uppercase tracking-wider font-bold text-xs">Overview</span>}
            </Link>
          </div>

          {/* Section: Infrastructure */}
          <div className="flex flex-col gap-1 px-3">
            {!sidebarCollapsed && (
              <span className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                Infrastructure
              </span>
            )}
            <Link 
              to="/organisation" 
              className={`flex items-center ${sidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'} rounded-lg text-xs font-medium transition-base ${
                currentPath === '/organisation' 
                  ? `bg-blue-50 text-blue-700 font-semibold` 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Building2 className={`w-5 h-5 shrink-0 transition-colors ${currentPath === '/organisation' ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-900'}`} />
              {!sidebarCollapsed && <span className="font-medium">Organisation</span>}
            </Link>
            
            <Link 
              to="/rpi" 
              className={`flex items-center ${sidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'} rounded-lg text-xs font-medium transition-base ${
                currentPath === '/rpi' 
                  ? `bg-blue-50 text-blue-700 font-semibold` 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Router className={`w-5 h-5 shrink-0 transition-colors ${currentPath === '/rpi' ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-900'}`} />
              {!sidebarCollapsed && <span className="font-medium">Data Logger Nodes</span>}
            </Link>
          </div>

          {/* Section: Fleet */}
          <div className="flex flex-col gap-1 px-3">
            {!sidebarCollapsed && (
              <span className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                Fleet
              </span>
            )}
            <Link 
              to="/fleet" 
              className={`flex items-center ${sidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'} rounded-lg text-xs font-medium transition-base ${
                currentPath === '/fleet' 
                  ? `bg-blue-50 text-blue-700 font-semibold` 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Activity className={`w-5 h-5 shrink-0 transition-colors ${currentPath === '/fleet' ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-900'}`} />
              {!sidebarCollapsed && <span className="font-medium">Fleet OTA</span>}
            </Link>
          </div>

          {/* Section: Sensors */}
          <div className="flex flex-col gap-1 px-3">
            {!sidebarCollapsed && (
              <span className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                IoT Config
              </span>
            )}
            <Link 
              to="/iot" 
              className={`flex items-center ${sidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'} rounded-lg text-xs font-medium transition-base ${
                currentPath === '/iot' 
                  ? `bg-blue-50 text-blue-700 font-semibold` 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Cpu className={`w-5 h-5 shrink-0 transition-colors ${currentPath === '/iot' ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-900'}`} />
              {!sidebarCollapsed && <span className="font-medium">Sensors</span>}
            </Link>
          </div>
        </div>

        {/* Sidebar Footer info */}
        <div className="p-4 border-t border-slate-100 flex flex-col gap-1 text-slate-400">
          {!sidebarCollapsed ? (
            <>
              <span className="text-xs font-bold text-slate-500">v2.0 PRODUCTION</span>
              <span className="text-xs font-medium tracking-tight">Pipra Solutions</span>
            </>
          ) : (
            <span className="text-xs font-bold text-center">P2</span>
          )}
        </div>
      </aside>

      {/* ==========================================
          MAIN CONTENT PORTAL SKELETON
          ========================================== */}
      <main 
        className={`flex-1 transition-all duration-300 pt-14 ${
          sidebarCollapsed ? 'pl-16' : 'pl-[220px]'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-8 flex flex-col gap-6">
          
          <Routes>
            <Route path="/" element={<Navigate to="/overview" replace />} />
            
            {/* ==========================================
                PAGE 1: /overview — LIVE COMMAND OVERVIEW
                ========================================== */}
            <Route path="/overview" element={
              <div className="flex flex-col gap-6">
                
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="section-header">Organisation:</span>
                    <select 
                      value={activeOrgId} 
                      onChange={(e) => {
                        setActiveOrgId(e.target.value);
                        addToast('info', `Active scope shifted: ${orgs.find(o => o.id === e.target.value)?.name}`);
                      }}
                      className="bg-white border border-slate-200 rounded-lg text-slate-900 font-sans text-sm px-2.5 py-1.5 focus:border-[#3B82F6] outline-none transition-base cursor-pointer"
                    >
                      {orgs.map(org => (
                        <option key={org.id} value={org.id}>{org.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-slate-400 font-medium">Last Synchronized: <span className="text-slate-900">{lastUpdated}</span></span>
                    <button 
                      onClick={handleGlobalRefresh}
                      disabled={globalRefreshing}
                      className="p-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-base flex items-center justify-center disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${globalRefreshing ? 'animate-spin text-[#2563EB]' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* KPI STRIP (4 cards, count-ups) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="card-surface flex flex-col gap-2  card-1">
                    <p className="section-header">LOCATIONS</p>
                    <p className="text-4xl font-bold tracking-tight text-slate-900">{kpis.locations}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500 mt-1 font-medium">
                      <span>+0 Streaming</span>
                      <span>{kpis.locations} Idle</span>
                    </div>
                  </div>

                  <div className="card-surface flex flex-col gap-2  card-2">
                    <p className="section-header">DATA LOGGERS (Data Logger)</p>
                    <p className="text-4xl font-bold tracking-tight text-slate-900">{kpis.gateways}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500 mt-1 font-medium">
                      <span className="text-emerald-600">+1 Provisioned</span>
                      <span className="text-red-600 font-semibold flex items-center gap-1">{rpis.filter(r => r.status === 'OFFLINE').length} Offline <Circle className="w-2.5 h-2.5 fill-current" /></span>
                    </div>
                  </div>

                  <div className="card-surface flex flex-col gap-2  card-3">
                    <p className="section-header">SENSORS (IoT)</p>
                    <p className="text-4xl font-bold tracking-tight text-slate-900">{kpis.sensors}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500 mt-1 font-medium">
                      <span>+0 Streaming</span>
                      <span className="text-red-600 flex items-center gap-1">{kpis.sensors} Silent <Circle className="w-2.5 h-2.5 fill-current" /></span>
                    </div>
                  </div>

                  <div className="card-surface flex flex-col gap-2 border-l-[3px] border-l-red-500 card-4">
                    <p className="section-header">SYSTEM ALERTS</p>
                    <p className="text-4xl font-bold tracking-tight text-red-600">{kpis.alerts}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500 mt-1 font-medium">
                      <span>3 Warning</span>
                      <span className="text-red-600 font-semibold flex items-center gap-1">6 Offline <Circle className="w-2.5 h-2.5 fill-current" /></span>
                    </div>
                  </div>
                </div>

                {/* Leaflet Live Location Map */}
                <div className="panel-surface overflow-hidden">
                  <div className="px-5 py-4 bg-white border-b border-slate-200 flex items-center justify-between">
                    <span className="section-header">Live Geographic Deployment Map</span>
                    <div className="flex items-center gap-4 text-xs font-medium">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse"></span> Active HQ</span>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#EF4444]"></span> Critical Nodes</span>
                    </div>
                  </div>
                  
                  <div className="h-[340px] w-full relative z-10">
                    <MapContainer 
                      center={[17.4399, 78.4983]} 
                      zoom={8} 
                      scrollWheelZoom={false}
                      className="h-full w-full"
                    >
                      {/* CartoDB Dark Matter Base */}
                      <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                      />
                      
                      {/* Active Markers based on scoped active Organisation */}
                      {locations.filter(l => l.orgId === activeOrgId).map(loc => {
                        // Hyderabad HQ is 17.4399, 78.4983. It has offline devices, so highlight in amber/red status
                        const isHQ = loc.name.includes("HQ");
                        const markerColor = isHQ ? '#EF4444' : '#2563EB';

                        const locGroups = groups.filter(g => g.locId === loc.id);
                        const locSensors = sensors.filter(s => locGroups.some(g => g.id === s.grpId));
                        const onlineCount = locSensors.filter(s => s.status === 'ONLINE').length;
                        const offlineCount = locSensors.filter(s => s.status === 'OFFLINE').length;
                        
                        return (
                          <Marker 
                            key={loc.id} 
                            position={[loc.lat, loc.lng]}
                            icon={getCustomMarkerIcon(markerColor, isHQ)}
                          >
                            <Popup>
                              <div className="p-2 font-sans text-xs min-w-[140px]">
                                <p className="font-bold text-slate-900 text-sm mb-2">{loc.name}</p>
                                <div className="flex flex-col gap-1.5">
                                  <div className="flex items-center justify-between gap-4">
                                    <span className="text-slate-500 font-medium">Online Sensors</span>
                                    <span className="text-emerald-600 font-bold flex items-center gap-1.5"><Circle className="w-2.5 h-2.5 fill-current" /> {onlineCount}</span>
                                  </div>
                                  <div className="flex items-center justify-between gap-4">
                                    <span className="text-slate-500 font-medium">Offline Sensors</span>
                                    <span className="text-red-600 font-bold flex items-center gap-1.5"><Circle className="w-2.5 h-2.5 fill-current" /> {offlineCount}</span>
                                  </div>
                                </div>
                              </div>
                            </Popup>
                          </Marker>
                        );
                      })}
                    </MapContainer>
                  </div>
                </div>

                {/* Data Logger Status Grid */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="section-header">Data Logger Status Grid (Data Logger Fleet)</span>
                    <span className="text-xs text-slate-400 font-medium">Scoped in: All Locations</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                    {rpis.map((rpi) => {
                      const matchedLoc = locations.find(l => {
                        const grp = groups.find(g => g.id === rpi.grpId);
                        return grp ? grp.locId === l.id : false;
                      });

                      const matchedGrp = groups.find(g => g.id === rpi.grpId);

                      let badgeClass = '';
                      if (rpi.status === 'ONLINE') {
                        badgeClass = 'badge-online';
                      } else if (rpi.status === 'OFFLINE') {
                        badgeClass = 'badge-discovered pulse-discovered';
                      } else {
                        badgeClass = 'badge-offline';
                      }

                      return (
                        <div 
                          key={rpi.mac}
                          className={`card-surface flex flex-col justify-between min-h-[160px] relative ${
                            rpi.status === 'OFFLINE' ? 'border-[#F59E0B]/30' : ''
                          }`}
                        >
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-slate-900">{rpi.mac}</span>
                              <span className={`badge ${badgeClass}`}>
                                {rpi.status === 'OFFLINE' ? (
                                  <span className="w-1.5 h-1.5 rounded-full bg-current pulse-discovered"></span>
                                ) : (
                                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                )}
                                {rpi.status}
                              </span>
                            </div>

                            <p className="text-sm font-sans text-slate-900 font-bold mt-2">{matchedLoc ? matchedLoc.name : "Unassigned"}</p>
                            <p className="text-xs font-medium text-slate-500">{matchedGrp ? matchedGrp.name : "Waiting Room"} · fw {rpi.fw}</p>
                          </div>

                          <div className="border-t border-slate-100/60 pt-2.5 mt-4 flex items-center justify-between text-xs font-medium text-slate-400">
                            <span>{sensors.filter(s => s.rpi === rpi.mac).length} BLE nodes</span>
                            <span>Last check-in: 5/25 5:39 AM</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Accordion List for Sensors */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="section-header text-slate-800">Asset Topology Explorer</span>
                    <span className="text-xs font-medium text-slate-400">Facility &gt; Data Logger Zone &gt; Edge Node</span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {locations.filter(l => l.orgId === activeOrgId).map((loc) => {
                      const locGroups = groups.filter(g => g.locId === loc.id);
                      return (
                        <div key={loc.id} className="panel-surface overflow-hidden">
                          <div className="px-5 py-4 bg-slate-50/50 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-[#2563EB]" />
                              <span className="font-bold text-base text-slate-900">{loc.name}</span>
                            </div>
                            <span className="text-xs font-medium text-slate-500">{locGroups.length} Active Groups</span>
                          </div>

                          <div className="p-4 flex flex-col gap-3.5">
                            {locGroups.map(grp => {
                              const groupRpis = rpis.filter(r => r.grpId === grp.id);
                              return (
                                <div key={grp.id} className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 border-l-4 border-l-indigo-400/40">
                                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                                    <div className="flex items-center gap-2">
                                      <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                                      <span className="text-sm font-sans text-slate-900 font-bold">{grp.name}</span>
                                    </div>
                                    <span className={grp.awsStatus === 'INTEGRATED' ? 'badge badge-online' : 'badge badge-pending'}>
                                      {grp.awsStatus}
                                    </span>
                                  </div>

                                  <div className="flex flex-col gap-2">
                                    {groupRpis.length === 0 ? (
                                      <p className="text-xs text-slate-400 font-medium italic">No gateways provisioned to this group</p>
                                    ) : (
                                      groupRpis.map(rpi => {
                                        const rpiSensors = sensors.filter(s => s.rpi === rpi.mac);
                                        return (
                                          <div key={rpi.mac} className="flex flex-col gap-3 pl-4 border-l-2 border-slate-200 py-2">
                                            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                                              <button 
                                                onClick={() => navigate('/rpi')} 
                                                className="text-sm font-bold text-slate-900 hover:text-[#2563EB] hover:underline transition-base cursor-pointer flex items-center gap-1.5"
                                                title="View in Data Logger Nodes"
                                              >
                                                {rpi.mac}
                                              </button>
                                              <span className="flex items-center gap-2">
                                                <span className={`badge ${rpi.status === 'ONLINE' ? 'badge-online' : rpi.status === 'OFFLINE' ? 'badge-discovered' : 'badge-offline'}`}>
                                                  {rpi.status}
                                                </span>
                                                <span className="text-slate-300">|</span>
                                                <span className="text-xs text-slate-500">fw {rpi.fw}</span>
                                              </span>
                                            </div>
                                            
                                            {rpiSensors.length === 0 ? (
                                              <div className="pl-1"><p className="text-xs text-slate-400 font-medium italic">No end nodes discovered yet</p></div>
                                            ) : (
                                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pl-3">
                                                {rpiSensors.map(sensor => (
                                                  <div 
                                                    key={sensor.id} 
                                                    onClick={() => {
                                                      setExpandedSensorId(sensor.id);
                                                      setShowSensorDrawer(true);
                                                      navigate('/iot');
                                                      addToast('info', `Viewing telemetry for ${sensor.name}`);
                                                    }}
                                                    title="View Sensor Telemetry"
                                                    className="p-3 rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-pointer flex flex-col gap-1 relative overflow-hidden group"
                                                  >
                                                    <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:animate-pulse"></div><p className="text-sm font-semibold text-slate-800">{sensor.name}</p></div>
                                                    <p className="text-xs font-medium text-slate-500">{sensor.uid}</p>
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            } />

            {/* ==========================================
                PAGE 2: /organisation — TREE VIEW
                ========================================== */}
            <Route path="/organisation" element={
              <div className="flex flex-col gap-4">
                <div>
                  <h1 className="title-primary flex items-center gap-2"><Building2 className="w-6 h-6 text-[#2563EB]" /> Organisation Setup</h1>
                  <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1">Map your physical asset topology: Enterprise <ArrowRight className="w-3 h-3" /> Facility <ArrowRight className="w-3 h-3" /> Edge Data Logger Group</p>
                </div>

                <div className="flex h-[calc(100vh-220px)] panel-surface overflow-hidden">
                  
                  {/* Left Sidebar: Tree View */}
                  <div className="w-80 border-r border-slate-100 bg-slate-50/50 flex flex-col h-full overflow-y-auto">
                    <div className="px-4 py-3 bg-white/60 border-b border-slate-100 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
                      <span className="section-header">Asset Topology</span>
                      <button 
                        onClick={() => { setShowOrgForm(true); setShowLocFormForOrg(null); setShowGrpFormForLoc(null); setActiveNode(null); }}
                        className="flex items-center gap-1 text-xs font-medium bg-white border border-slate-200 hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] px-2 py-1 rounded transition-base shadow-sm"
                      >
                        <Plus className="w-3 h-3" /> ADD ORG
                      </button>
                    </div>

                    <div className="p-2 flex flex-col gap-1">
                      {orgs.map(org => {
                        const isOrgExpanded = expandedOrgs.includes(org.id);
                        const isOrgActive = activeNode?.type === 'org' && activeNode.id === org.id;
                        return (
                          <div key={org.id} className="flex flex-col gap-0.5">
                            <div 
                              className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-base ${
                                isOrgActive ? 'bg-blue-50 border border-blue-200/60 shadow-sm' : 'hover:bg-slate-100 border border-transparent'
                              }`}
                              onClick={() => {
                                setActiveNode({ type: 'org', id: org.id });
                                setShowOrgForm(false); setShowLocFormForOrg(null); setShowGrpFormForLoc(null);
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedOrgs(prev => prev.includes(org.id) ? prev.filter(id => id !== org.id) : [...prev, org.id]);
                                  }}
                                  className={`p-0.5 rounded hover:bg-slate-200 transition-base ${isOrgExpanded ? 'rotate-90' : ''}`}
                                >
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                </button>
                                <Building2 className={`w-4 h-4 ${isOrgActive ? 'text-[#2563EB]' : 'text-slate-500'}`} />
                                <span className={`text-sm font-semibold ${isOrgActive ? 'text-blue-900' : 'text-slate-700'}`}>{org.name}</span>
                              </div>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if(!expandedOrgs.includes(org.id)) setExpandedOrgs([...expandedOrgs, org.id]);
                                  setShowLocFormForOrg(org.id);
                                  setShowOrgForm(false); setShowGrpFormForLoc(null); setActiveNode(null);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 bg-white hover:bg-[#2563EB] hover:text-white rounded border border-slate-200 transition-base text-slate-500"
                                title="Add Location"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {isOrgExpanded && (
                              <div className="flex flex-col gap-0.5 ml-[22px] border-l border-slate-200 pl-2 mt-0.5">
                                {locations.filter(l => l.orgId === org.id).map(loc => {
                                  const isLocExpanded = expandedLocs.includes(loc.id);
                                  const isLocActive = activeNode?.type === 'loc' && activeNode.id === loc.id;
                                  return (
                                    <div key={loc.id} className="flex flex-col gap-0.5">
                                      <div 
                                        className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-base ${
                                          isLocActive ? 'bg-blue-50 border border-blue-200/60 shadow-sm' : 'hover:bg-slate-100 border border-transparent'
                                        }`}
                                        onClick={() => {
                                          setActiveNode({ type: 'loc', id: loc.id });
                                          setShowOrgForm(false); setShowLocFormForOrg(null); setShowGrpFormForLoc(null);
                                        }}
                                      >
                                        <div className="flex items-center gap-2">
                                          <button 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setExpandedLocs(prev => prev.includes(loc.id) ? prev.filter(id => id !== loc.id) : [...prev, loc.id]);
                                            }}
                                            className={`p-0.5 rounded hover:bg-slate-200 transition-base ${isLocExpanded ? 'rotate-90' : ''}`}
                                          >
                                            <ChevronRight className="w-3 h-3 text-slate-400" />
                                          </button>
                                          <div className={`w-3 h-3 rounded-full border-2 ${isLocActive ? 'border-[#2563EB] bg-blue-100' : 'border-slate-300'}`}></div>
                                          <span className={`text-sm font-medium ${isLocActive ? 'text-blue-800' : 'text-slate-600'}`}>{loc.name}</span>
                                        </div>
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if(!expandedLocs.includes(loc.id)) setExpandedLocs([...expandedLocs, loc.id]);
                                            setShowGrpFormForLoc(loc.id);
                                            setShowOrgForm(false); setShowLocFormForOrg(null); setActiveNode(null);
                                          }}
                                          className="opacity-0 group-hover:opacity-100 p-1 bg-white hover:bg-[#2563EB] hover:text-white rounded border border-slate-200 transition-base text-slate-500"
                                          title="Add Zone"
                                        >
                                          <Plus className="w-3 h-3" />
                                        </button>
                                      </div>

                                      {isLocExpanded && (
                                        <div className="flex flex-col gap-0.5 ml-4 border-l border-slate-200 pl-2 mt-0.5">
                                          {groups.filter(g => g.locId === loc.id).map(grp => {
                                            const isGrpActive = activeNode?.type === 'grp' && activeNode.id === grp.id;
                                            return (
                                              <div 
                                                key={grp.id}
                                                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-base ${
                                                  isGrpActive ? 'bg-blue-50 border border-blue-200/60 shadow-sm' : 'hover:bg-slate-100 border border-transparent'
                                                }`}
                                                onClick={() => {
                                                  setActiveNode({ type: 'grp', id: grp.id });
                                                  setShowOrgForm(false); setShowLocFormForOrg(null); setShowGrpFormForLoc(null);
                                                }}
                                              >
                                                <SlidersHorizontal className={`w-3 h-3 ml-1 ${isGrpActive ? 'text-[#2563EB]' : 'text-slate-400'}`} />
                                                <span className={`text-xs font-medium ${isGrpActive ? 'text-blue-800 font-bold' : 'text-slate-500'}`}>{grp.name}</span>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Pane: Details & Forms */}
                  <div className="flex-1 bg-white overflow-y-auto flex flex-col relative z-10">
                    
                    {/* Forms rendered inside right pane instead of tree */}
                    {showOrgForm && (
                      <div className="p-6 md:p-8 flex flex-col gap-6 max-w-2xl mx-auto w-full animate-[fadeIn_200ms_ease]">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div>
                            <h2 className="text-lg font-bold text-slate-900">Create New Organisation</h2>
                            <p className="text-xs font-medium text-slate-500">Add a new top-level tenant</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-4">
                          <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Organisation Name <span className="text-red-500">*</span></span>
                            <input type="text" id="new_org_name" className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-medium text-slate-900 focus:border-[#3B82F6] outline-none transition-base" placeholder="Forge Enterprise" />
                          </label>
                          <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Address <span className="text-red-500">*</span></span>
                            <input type="text" id="new_org_address" className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-medium text-slate-900 focus:border-[#3B82F6] outline-none transition-base" placeholder="Industrial Area, Sector 5" />
                          </label>
                        </div>
                        
                        <div className="flex gap-3 pt-4">
                          <button onClick={() => setShowOrgForm(false)} className="px-6 py-2 bg-white border border-slate-200 text-sm font-medium text-slate-600 rounded-lg transition-base hover:bg-slate-50">Cancel</button>
                          <button 
                            onClick={() => {
                              const nameEl = document.getElementById("new_org_name") as HTMLInputElement;
                              const addressEl = document.getElementById("new_org_address") as HTMLInputElement;
                              if (!nameEl?.value || !addressEl?.value) {
                                addToast('error', 'Name and Address are required.');
                                return;
                              }
                              const newOrg = { id: `org_${orgs.length + 1}`, name: nameEl.value, agent: "Ops Admin Agent", locCount: 0, address: addressEl.value, lat: 17.4, lng: 78.4, email: "ops@company.com" };
                              setOrgs([...orgs, newOrg]);
                              addToast('success', `Organisation "${newOrg.name}" configured.`);
                              setShowOrgForm(false);
                              setActiveNode({ type: 'org', id: newOrg.id });
                              setExpandedOrgs(prev => [...prev, newOrg.id]);
                            }}
                            className="px-6 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold rounded-lg transition-base shadow-sm"
                          >
                            Create Organisation
                          </button>
                        </div>
                      </div>
                    )}

                    {showLocFormForOrg && (
                      <div className="p-6 md:p-8 flex flex-col gap-6 max-w-2xl mx-auto w-full animate-[fadeIn_200ms_ease]">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <h2 className="text-lg font-bold text-slate-900">Create New Location</h2>
                            <p className="text-xs font-medium text-slate-500">Under: {orgs.find(o => o.id === showLocFormForOrg)?.name}</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-4">
                          <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Location Name <span className="text-red-500">*</span></span>
                            <input type="text" id="new_loc_name" className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-medium text-slate-900 focus:border-[#3B82F6] outline-none transition-base" placeholder="Bangalore Warehouse" />
                          </label>
                          <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Contact POC</span>
                            <input type="text" id="new_loc_poc" className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-medium text-slate-900 focus:border-[#3B82F6] outline-none transition-base" placeholder="John Doe" />
                          </label>
                        </div>
                        
                        <div className="flex gap-3 pt-4">
                          <button onClick={() => setShowLocFormForOrg(null)} className="px-6 py-2 bg-white border border-slate-200 text-sm font-medium text-slate-600 rounded-lg transition-base hover:bg-slate-50">Cancel</button>
                          <button 
                            onClick={() => {
                              const nameEl = document.getElementById("new_loc_name") as HTMLInputElement;
                              const pocEl = document.getElementById("new_loc_poc") as HTMLInputElement;
                              if (!nameEl?.value) {
                                addToast('error', 'Location Name is required.');
                                return;
                              }
                              const newLoc = { id: `loc_${locations.length + 1}`, orgId: showLocFormForOrg, name: nameEl.value, address: "Silicon Valley Tech Park", lat: 12.9716, lng: 77.5946, poc: pocEl.value || "Ops Controller" };
                              setLocations([...locations, newLoc]);
                              addToast('success', `Location "${newLoc.name}" configured.`);
                              setShowLocFormForOrg(null);
                              setActiveNode({ type: 'loc', id: newLoc.id });
                              setExpandedLocs(prev => [...prev, newLoc.id]);
                            }}
                            className="px-6 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold rounded-lg transition-base shadow-sm"
                          >
                            Create Location
                          </button>
                        </div>
                      </div>
                    )}

                    {showGrpFormForLoc && (
                      <div className="p-6 md:p-8 flex flex-col gap-6 max-w-2xl mx-auto w-full animate-[fadeIn_200ms_ease]">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <SlidersHorizontal className="w-5 h-5" />
                          </div>
                          <div>
                            <h2 className="text-lg font-bold text-slate-900">Create New Zone / Group</h2>
                            <p className="text-xs font-medium text-slate-500">Under: {locations.find(l => l.id === showGrpFormForLoc)?.name}</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-4">
                          <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Zone Name <span className="text-red-500">*</span></span>
                            <input type="text" id="new_grp_name" className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-medium text-slate-900 focus:border-[#3B82F6] outline-none transition-base" placeholder="Packaging Data Loggers" />
                          </label>
                          <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Type</span>
                            <select id="new_grp_type" className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-medium text-slate-900 focus:border-[#3B82F6] outline-none transition-base cursor-pointer">
                              <option value="DATA LOGGERS">DATA LOGGERS</option>
                              <option value="SENSORS">SENSORS</option>
                            </select>
                          </label>
                        </div>
                        
                        <div className="flex gap-3 pt-4">
                          <button onClick={() => setShowGrpFormForLoc(null)} className="px-6 py-2 bg-white border border-slate-200 text-sm font-medium text-slate-600 rounded-lg transition-base hover:bg-slate-50">Cancel</button>
                          <button 
                            onClick={() => {
                              const nameEl = document.getElementById("new_grp_name") as HTMLInputElement;
                              const typeEl = document.getElementById("new_grp_type") as HTMLSelectElement;
                              if (!nameEl?.value) {
                                addToast('error', 'Group Name is required.');
                                return;
                              }
                              const newGrp = { id: `grp_${groups.length + 1}`, locId: showGrpFormForLoc, name: nameEl.value, desc: "Dynamic deployment zone", type: typeEl.value, status: "ACTIVE", fw: "v3.0", cap: 50, awsStatus: "PENDING", awsPolicy: "", awsThingGroup: "", awsArn: "" };
                              setGroups([...groups, newGrp]);
                              addToast('success', `Zone "${newGrp.name}" configured.`);
                              setShowGrpFormForLoc(null);
                              setActiveNode({ type: 'grp', id: newGrp.id });
                            }}
                            className="px-6 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold rounded-lg transition-base shadow-sm"
                          >
                            Create Zone
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Node Details view */}
                    {!showOrgForm && !showLocFormForOrg && !showGrpFormForLoc && (
                      <div className="p-6 md:p-8 animate-[fadeIn_200ms_ease] h-full flex flex-col">
                        {!activeNode ? (
                          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
                            <Building2 className="w-12 h-12 text-slate-200" />
                            <p className="text-sm font-medium">Select a node from the hierarchy to view details</p>
                          </div>
                        ) : (
                          <>
                            {activeNode.type === 'org' && (() => {
                              const activeOrg = orgs.find(o => o.id === activeNode.id);
                              if(!activeOrg) return null;
                              return (
                                <div className="flex flex-col gap-6 w-full max-w-3xl">
                                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                    <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm border border-blue-100">
                                        <Building2 className="w-6 h-6" />
                                      </div>
                                      <div className="flex flex-col gap-0.5">
                                        <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">Organisation</span>
                                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">{activeOrg.name}</h2>
                                      </div>
                                    </div>
                                    <button 
                                      onClick={() => setDeleteConfirm({ type: 'organisation', id: activeOrg.id, name: activeOrg.name })}
                                      className="p-2 border border-[#EF4444]/20 hover:bg-[#EF4444]/10 rounded-lg text-red-600 transition-base"
                                      title="Delete Organisation"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-1">
                                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Administrator Email</span>
                                      <span className="text-sm font-semibold text-slate-900">{activeOrg.email}</span>
                                    </div>
                                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-1">
                                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Locations</span>
                                      <span className="text-sm font-semibold text-slate-900">{locations.filter(l => l.orgId === activeOrg.id).length} Active Sites</span>
                                    </div>
                                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-1 sm:col-span-2">
                                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Registered Address</span>
                                      <span className="text-sm font-medium text-slate-700">{activeOrg.address}</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}

                            {activeNode.type === 'loc' && (() => {
                              const activeLoc = locations.find(l => l.id === activeNode.id);
                              if(!activeLoc) return null;
                              return (
                                <div className="flex flex-col gap-6 w-full max-w-3xl">
                                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                    <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shadow-sm border border-slate-200">
                                        <MapPin className="w-6 h-6" />
                                      </div>
                                      <div className="flex flex-col gap-0.5">
                                        <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">Location</span>
                                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">{activeLoc.name}</h2>
                                      </div>
                                    </div>
                                    <button 
                                      onClick={() => setDeleteConfirm({ type: 'location', id: activeLoc.id, name: activeLoc.name })}
                                      className="p-2 border border-[#EF4444]/20 hover:bg-[#EF4444]/10 rounded-lg text-red-600 transition-base"
                                      title="Delete Location"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-1">
                                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Primary Contact (POC)</span>
                                      <span className="text-sm font-semibold text-slate-900">{activeLoc.poc}</span>
                                    </div>
                                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-1">
                                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Zones</span>
                                      <span className="text-sm font-semibold text-slate-900">{groups.filter(g => g.locId === activeLoc.id).length} Active Zones</span>
                                    </div>
                                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-1 sm:col-span-2">
                                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Geographic Address</span>
                                      <span className="text-sm font-medium text-slate-700">{activeLoc.address}</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}

                            {activeNode.type === 'grp' && (() => {
                              const activeGrp = groups.find(g => g.id === activeNode.id);
                              if (!activeGrp) return null;
                              return (
                                <div className="flex flex-col gap-6 w-full max-w-4xl">
                                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                    <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm border border-blue-100">
                                        <SlidersHorizontal className="w-6 h-6" />
                                      </div>
                                      <div className="flex flex-col gap-1">
                                        <span className="badge bg-blue-50 text-blue-700 border-blue-200 self-start">
                                          {activeGrp.type} ZONE
                                        </span>
                                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">{activeGrp.name}</h2>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <button 
                                        onClick={() => setDeleteConfirm({ type: 'group', id: activeGrp.id, name: activeGrp.name })}
                                        className="p-2 border border-[#EF4444]/20 hover:bg-[#EF4444]/10 rounded-lg text-red-600 transition-base"
                                        title="Delete Zone"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                    <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col gap-1">
                                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Zone Type</span>
                                      <span className="font-bold text-slate-900">{activeGrp.type}</span>
                                    </div>
                                    <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col gap-1">
                                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Status</span>
                                      <span className="font-bold text-emerald-600">{activeGrp.status}</span>
                                    </div>
                                    <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col gap-1">
                                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Mesh Firmware</span>
                                      <span className="font-semibold text-slate-900">{activeGrp.fw}</span>
                                    </div>
                                    <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col gap-1">
                                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Max Capacity</span>
                                      <span className="font-semibold text-slate-900">{activeGrp.cap || 50} nodes</span>
                                    </div>
                                  </div>

                                  <div className="border-t border-slate-100 pt-6 flex flex-col gap-4">
                                    <div className="flex items-center gap-2">
                                      <Cloud className="w-5 h-5 text-slate-500" />
                                      <span className="text-base font-bold text-slate-900">AWS IoT Core Provisions</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                      <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                          <span>INTEGRATION STATUS:</span>
                                          <span className={`px-2.5 py-0.5 rounded-full border text-xs ${
                                            activeGrp.awsStatus === 'INTEGRATED' 
                                              ? 'badge badge-online bg-emerald-50'
                                              : activeGrp.awsStatus === 'INTEGRATING'
                                              ? 'badge badge-pending animate-pulse bg-amber-50'
                                              : 'badge badge-offline bg-slate-100'
                                          }`}>
                                            {activeGrp.awsStatus}
                                          </span>
                                        </div>
                                        <div className="text-sm flex flex-col gap-2 text-slate-500 bg-white p-3 rounded-lg border border-slate-100">
                                          <div className="flex flex-col gap-0.5">
                                            <span className="text-xs font-bold text-slate-400">AWS Policy</span>
                                            <span className="font-medium text-slate-900 font-sans text-xs">{activeGrp.awsPolicy || '—'}</span>
                                          </div>
                                          <div className="flex flex-col gap-0.5 mt-2">
                                            <span className="text-xs font-bold text-slate-400">Thing Group Name</span>
                                            <span className="font-medium text-slate-900 font-sans text-xs">{activeGrp.awsThingGroup || '—'}</span>
                                          </div>
                                          <div className="flex flex-col gap-0.5 mt-2">
                                            <span className="text-xs font-bold text-slate-400">ARN (Amazon Resource Name)</span>
                                            <span className="font-medium text-slate-900 font-sans text-xs break-all">{activeGrp.awsArn || '—'}</span>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex flex-col justify-center items-start md:items-end">
                                        {activeGrp.awsStatus === 'PENDING' ? (
                                          <button 
                                            onClick={() => handlePushGroupToAws(activeGrp.id)}
                                            className="px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold rounded-xl flex items-center gap-2 shadow-sm transition-base"
                                          >
                                            <Cloud className="w-4 h-4" /> Push to AWS IoT Core <ChevronRight className="w-4 h-4 inline" />
                                          </button>
                                        ) : activeGrp.awsStatus === 'INTEGRATING' ? (
                                          <button disabled className="px-6 py-3 bg-slate-100 border border-slate-200 text-sm font-medium text-amber-600 rounded-xl flex items-center gap-2">
                                            <RefreshCw className="w-4 h-4 animate-spin" /> Provisioning Mesh...
                                          </button>
                                        ) : (
                                          <div className="flex flex-col items-end gap-2">
                                            <span className="text-emerald-600 text-sm font-bold flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.20)] shadow-sm">
                                              <CheckCircle className="w-4 h-4" /> AWS Core Provision Synced
                                            </span>
                                            <p className="text-xs text-slate-500 font-medium">Synced instantly with cloud pipeline.</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            } />

            {/* ==========================================
                PAGE 3: /rpi — Data Logger NODE GROUPS
                ========================================== */}
            <Route path="/rpi" element={
              <div className="flex flex-col gap-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="title-primary flex items-center gap-2"><Network className="w-6 h-6 text-[#2563EB]" /> Data Logger Node Groups</h1>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Configure Raspberry Pi gateways and bridge them to AWS Core orchestrator pools</p>
                  </div>
                  <button onClick={handleGlobalRefresh} className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-sm font-medium text-slate-700 rounded-full shadow-sm flex items-center gap-2 transition-base">
                    <RefreshCw className={`w-3.5 h-3.5 ${globalRefreshing ? 'animate-spin' : ''}`} /> Refresh Node Pool
                  </button>
                </div>

                {/* Waiting Room Banner */}
                {rpis.some(r => r.status === 'OFFLINE') && (
                  <div className="card-surface border-amber-200 bg-amber-50/50 animate-[cardReveal_200ms_ease] flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-[rgba(245,158,11,0.15)] pb-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                        <div>
                          <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500 fill-amber-500/20" /> Waiting Room: Discovered Data Loggers</p>
                          <p className="text-xs text-slate-500 font-medium">New PiEdge controllers have pinged the telemetry gateway. Allocate them to location meshes.</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      {rpis.filter(r => r.status === 'OFFLINE').map(r => (
                        <div key={r.mac} className="card-surface flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-slate-900">{r.mac}</span>
                              <span className="badge badge-discovered pulse-discovered">
                                DISCOVERED
                              </span>
                            </div>
                            <span className="text-xs font-medium text-slate-400">Pings arriving from: {r.lastSeen} · firmware: {r.fw}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                            <select 
                              id={`alloc_org_${r.mac}`}
                              className="bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-sans text-xs px-2 py-1.5 outline-none focus:border-[#3B82F6] cursor-pointer"
                            >
                              {orgs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                            </select>

                            <select 
                              id={`alloc_grp_${r.mac}`}
                              className="bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-sans text-xs px-2 py-1.5 outline-none focus:border-[#3B82F6] cursor-pointer"
                            >
                              {groups.filter(g => g.type === 'DATA LOGGERS').map(g => (
                                <option key={g.id} value={g.id}>{g.name}</option>
                              ))}
                            </select>

                            <button 
                              onClick={() => {
                                const grpEl = document.getElementById(`alloc_grp_${r.mac}`) as HTMLSelectElement;
                                const grpId = grpEl?.value || 'grp_1';
                                
                                setRpis(prev => prev.map(item => {
                                  if (item.mac === r.mac) {
                                    return {
                                      ...item,
                                      status: 'ONLINE',
                                      grpId: grpId
                                    };
                                  }
                                  return item;
                                }));
                                addToast('success', `Data Logger Node ${r.mac} successfully active inside scope.`);
                              }}
                              className="btn-primary btn-sm"
                            >
                              Register Data Loggers <ArrowRight className="w-4 h-4 inline ml-1" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AWS Status zone */}
                <div className="p-3 px-4 rounded-lg bg-[rgba(16,185,129,0.04)] border border-[rgba(16,185,129,0.15)] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    <span>AWS IoT Core Fleet Integration Online</span>
                  </div>
                  <div className="font-medium text-slate-400">
                    Endpoint: <span className="text-slate-500 select-all">aojggxiqsh1w7-ats.iot.ap-south-1.amazonaws.com</span>
                  </div>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-white shadow-sm border border-slate-200 flex flex-col gap-1 border-l-2 border-l-blue-500">
                    <span className="section-header">TOTAL GROUPS</span>
                    <span className="text-2xl font-medium text-slate-900 font-bold">{groups.length}</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-white shadow-sm border border-slate-200 flex flex-col gap-1 ">
                    <span className="section-header">AWS CORE INTEGRATED</span>
                    <span className="text-2xl font-medium text-emerald-600 font-bold">
                      {groups.filter(g => g.awsStatus === 'INTEGRATED').length}
                    </span>
                  </div>
                  <div className="p-5 rounded-2xl bg-white shadow-sm border border-slate-200 flex flex-col gap-1 border-l-2 border-l-amber-500">
                    <span className="section-header">AWAITING INTEGRATION</span>
                    <span className="text-2xl font-medium text-amber-600 font-bold">
                      {groups.filter(g => g.awsStatus === 'PENDING').length}
                    </span>
                  </div>
                </div>

                {/* Groups table with simulated AWS core pushes */}
                <div className="border border-slate-100 rounded-xl bg-white overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">GROUP NAME</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">DESCRIPTION</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">AWS THING GROUP</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">AWS ARN</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">STATUS</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groups.map(grp => (
                          <tr key={grp.id} className="border-b border-slate-100/60 hover:bg-slate-100 transition-base group">
                            <td className="px-4 py-3.5 text-xs font-bold text-slate-900">{grp.name}</td>
                            <td className="px-4 py-3.5 text-xs text-slate-500">{grp.desc}</td>
                            <td className="px-4 py-3.5 text-xs font-medium text-slate-600">{grp.awsThingGroup || '—'}</td>
                            <td className="px-4 py-3.5 text-xs font-medium text-slate-400 max-w-[200px] truncate">{grp.awsArn || '—'}</td>
                            <td className="px-4 py-3.5 text-xs">
                              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${
                                grp.awsStatus === 'INTEGRATED' 
                                  ? 'badge badge-online'
                                  : grp.awsStatus === 'INTEGRATING'
                                  ? 'badge badge-pending animate-pulse'
                                  : 'badge badge-offline'
                              }`}>
                                {grp.awsStatus}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-right text-xs font-medium">
                              <div className="flex items-center justify-end gap-2">
                                {grp.awsStatus === 'PENDING' ? (
                                  <button 
                                    onClick={() => handlePushGroupToAws(grp.id)}
                                    className="btn-primary btn-sm"
                                  >
                                    Push to AWS IoT Core
                                  </button>
                                ) : grp.awsStatus === 'INTEGRATING' ? (
                                  <span className="text-amber-600 text-xs">Processing...</span>
                                ) : (
                                  <span className="text-emerald-600 text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Synced</span>
                                )}

                                <button 
                                  onClick={() => {
                                    setViewGroupDevices(grp);
                                  }}
                                  title="View Devices"
                                  className="p-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-[#2563EB] text-xs rounded transition-base shadow-sm"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            } />

            {/* ==========================================
                PAGE 4: /fleet — FLEET OTA & STATUS
                ========================================== */}
            <Route path="/fleet" element={
              <div className="flex flex-col gap-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="title-primary flex items-center gap-2"><Monitor className="w-6 h-6 text-[#2563EB]" /> Fleet OTA & Status</h1>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Simulated orchestrator panel for BLE networks & gateway controllers</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setGlobalMetricsOpen(true)}
                      className="px-4 py-2 bg-white border border-amber-200 hover:bg-amber-50 text-sm font-medium text-amber-700 rounded-full shadow-sm transition-base"
                    >
                      <Zap className="w-4 h-4 text-amber-500 fill-amber-500/20 inline mr-1" /> Global Fleet Metrics
                    </button>
                    <button onClick={handleGlobalRefresh} className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-xs font-medium text-slate-900 rounded-lg flex items-center gap-2 transition-base">
                      <RefreshCw className={`w-3.5 h-3.5 ${globalRefreshing ? 'animate-spin' : ''}`} /> Refresh Uptime
                    </button>
                  </div>
                </div>

                {/* Fleet Distribution aggregate block */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mb-6">
                  <div 
                    onClick={() => setFleetTab('rpi')}
                    className={`cursor-pointer p-5 rounded-2xl border transition-all duration-300 ${
                      fleetTab === 'rpi' ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-slate-200 hover:border-blue-300 shadow-sm'
                    } flex items-center justify-between`}
                  >
                    <div className="flex flex-col gap-1 text-left">
                      <span className="text-sm font-medium text-slate-600">Data Logger Data Loggers</span>
                      <span className="text-3xl font-bold text-slate-900">{rpis.length} <span className="text-sm font-normal text-slate-500">active</span></span>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Router className="w-6 h-6" />
                    </div>
                  </div>

                  <div 
                    onClick={() => setFleetTab('iot')}
                    className={`cursor-pointer p-5 rounded-2xl border transition-all duration-300 ${
                      fleetTab === 'iot' ? 'bg-purple-50 border-purple-200 shadow-sm' : 'bg-white border-slate-200 hover:border-purple-300 shadow-sm'
                    } flex items-center justify-between`}
                  >
                    <div className="flex flex-col gap-1 text-left">
                      <span className="text-sm font-medium text-slate-600">BLE Sensors</span>
                      <span className="text-3xl font-bold text-slate-900">{sensors.length} <span className="text-sm font-normal text-slate-500">reporting</span></span>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      <Activity className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Tab switcher */}
                <div className="flex border-b border-slate-100 pb-0.5">
                  <button 
                    onClick={() => setFleetTab('rpi')}
                    className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-base ${
                      fleetTab === 'rpi' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-500'
                    }`}
                  >
                    Data Logger Data Logger Pool ({rpis.length})
                  </button>
                  <button 
                    onClick={() => setFleetTab('iot')}
                    className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-base ${
                      fleetTab === 'iot' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-400 hover:text-slate-500'
                    }`}
                  >
                    BLE Sensor Pool ({sensors.length})
                  </button>
                </div>

                {/* Main Tab Lists */}
                {fleetTab === 'rpi' ? (
                  <div className="border border-slate-100 rounded-xl bg-white overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">IDENTITY (MAC)</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">STATUS</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">CPU USAGE</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">RAM UTILIZATION</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">FW MODEL</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">LAST SEEN CHECK</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rpis.map(rpi => {
                            // Micro bars logic
                            const cpu = rpi.status === 'ONLINE' ? rpi.cpu : 0;
                            const ram = rpi.status === 'ONLINE' ? rpi.ram : 0;

                            const cpuColor = cpu > 85 ? 'bg-[#EF4444]' : cpu > 60 ? 'bg-[#F59E0B]' : 'bg-[#10B981]';
                            const ramColor = ram > 85 ? 'bg-[#EF4444]' : ram > 60 ? 'bg-[#F59E0B]' : 'bg-[#10B981]';

                            return (
                              <tr key={rpi.mac} className="border-b border-slate-100/60 hover:bg-slate-100 transition-base">
                                <td className="px-4 py-3.5 text-sm font-bold text-slate-900">{rpi.mac}</td>
                                <td className="px-4 py-3.5 text-xs">
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
                                    rpi.status === 'ONLINE' 
                                      ? 'badge badge-online'
                                      : rpi.status === 'OFFLINE'
                                      ? 'badge badge-discovered'
                                      : 'badge badge-offline'
                                  }`}>
                                    {rpi.status}
                                  </span>
                                </td>
                                
                                {/* CPU micro indicator */}
                                <td className="px-4 py-3.5 text-xs font-medium">
                                  <div className="flex items-center gap-2">
                                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                      <div className={`h-full ${cpuColor}`} style={{ width: `${cpu}%` }}></div>
                                    </div>
                                    <span className={rpi.status === 'OFFLINE' ? 'text-slate-400' : 'text-slate-900'}>{cpu}%</span>
                                  </div>
                                </td>

                                {/* RAM micro indicator */}
                                <td className="px-4 py-3.5 text-xs font-medium">
                                  <div className="flex items-center gap-2">
                                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                      <div className={`h-full ${ramColor}`} style={{ width: `${ram}%` }}></div>
                                    </div>
                                    <span className={rpi.status === 'OFFLINE' ? 'text-slate-400' : 'text-slate-900'}>{ram}%</span>
                                  </div>
                                </td>

                                <td className="px-4 py-3.5 text-xs font-medium text-slate-900">{rpi.fw}</td>
                                <td className="px-4 py-3.5 text-xs font-medium text-slate-400">{rpi.lastSeen}</td>
                                <td className="px-4 py-3.5 text-right text-xs font-medium">
                                  <div className="flex items-center justify-end gap-2.5">
                                    <button 
                                      onClick={() => {
                                        setShowOtaModal(rpi);
                                      }}
                                      className="btn-primary btn-sm"
                                    >
                                      OTA Update
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="border border-slate-100 rounded-xl bg-white overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50/50">
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">IDENTITY</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">THING NAME</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">STATUS</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">BRIDGE RPI GATEWAY</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">RESOURCES (CPU/RAM)</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">MAINTENANCE</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">LAST SEEN</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sensors.map(sensor => (
                            <tr key={sensor.id} className="border-b border-slate-100/60 hover:bg-slate-100 transition-base">
                              <td className="px-4 py-3.5">
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-slate-900">{sensor.uid}</span>
                                  <span className="text-[10px] font-medium text-slate-500">Sensor ({sensor.type})</span>
                                </div>
                              </td>
                              <td className="px-4 py-3.5 text-xs text-slate-500 font-medium"></td>
                              <td className="px-4 py-3.5 text-xs">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
                                  sensor.status === 'ONLINE' ? 'badge badge-online' : 'badge badge-offline'
                                }`}>
                                  {sensor.status}
                                </span>
                              </td>
                              <td className="px-4 py-3.5 text-xs font-medium text-slate-500">
                                {sensor.rpi}
                              </td>
                              <td className="px-4 py-3.5 text-xs font-medium">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  {sensor.cat === 'Temperature' && sensor.uid.endsWith('01') && (
                                    <>
                                      <span className="px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600 font-mono text-[10px] font-semibold">TEMP_C: 24.3</span>
                                      <span className="px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600 font-mono text-[10px] font-semibold">UNIT: C</span>
                                    </>
                                  )}
                                  {sensor.cat === 'Temperature' && !sensor.uid.endsWith('01') && (
                                    <span className="px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600 font-mono text-[10px] font-semibold">TEMP_C: 23.1</span>
                                  )}
                                  {sensor.cat === 'Humidity' && (
                                    <span className="px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600 font-mono text-[10px] font-semibold">HUMIDITY_PCT: 45.1</span>
                                  )}
                                  {sensor.cat === 'Motion' && (
                                    <span className="px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600 font-mono text-[10px] font-semibold">MOTION: LUX: 212</span>
                                  )}
                                  {sensor.cat === 'Multi' && (
                                    <>
                                      <span className="px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600 font-mono text-[10px] font-semibold">TEMP_C: 22.8</span>
                                      <span className="px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600 font-mono text-[10px] font-semibold">HUMIDITY_PCT: 51.2</span>
                                      <span className="px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600 font-mono text-[10px] font-semibold">CO2_PPM: 620</span>
                                    </>
                                  )}
                                  {sensor.cat === 'Unknown' && (
                                    <span className="px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600 font-mono text-[10px] font-semibold">NO_DATA</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3.5 text-xs font-medium text-slate-500">—</td>
                              <td className="px-4 py-3.5 text-xs font-medium whitespace-nowrap">
                                <div className="flex flex-col">
                                  <span className="text-slate-600 font-bold">{new Date(sensor.lastSeen).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</span>
                                  <span className="text-[10px] text-slate-400 font-medium">{new Date(sensor.lastSeen).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3.5 text-right text-xs font-medium">
                                <div className="flex items-center justify-end gap-2.5">
                                  <button 
                                    onClick={() => {
                                      setShowOtaModal({
                                        mac: sensor.uid,
                                        thingName: sensor.name,
                                        grpId: sensor.grpId || '',
                                        status: sensor.status,
                                        cpu: 0,
                                        ram: 0,
                                        fw: sensor.fw,
                                        lastSeen: sensor.lastSeen
                                      } as any);
                                    }}
                                    className="btn-primary btn-sm"
                                  >
                                    OTA Update
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>
            } />

            {/* ==========================================
                PAGE 5: /iot — IOT SENSORS FLEET
                ========================================== */}
            <Route path="/iot" element={
              <div className="flex flex-col gap-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="title-primary flex items-center gap-2"><Settings className="w-6 h-6 text-[#2563EB]" /> Sensors Fleet</h1>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Provision BLE hardware units onto edge clusters</p>
                  </div>
                  <button 
                    onClick={() => setShowSensorDrawer(true)}
                    className="btn-primary btn-lg"
                  >
                    <Plus className="w-4 h-4" /> Register Sensor
                  </button>
                </div>

                {/* KPI metrics row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-white shadow-sm border border-slate-200 flex flex-col gap-1 border-l-2 border-l-blue-500">
                    <span className="section-header">TOTAL SENSORS</span>
                    <span className="text-2xl font-medium text-slate-900 font-bold">{sensors.length}</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-white shadow-sm border border-slate-200 flex flex-col gap-1 border-l-2 border-l-[#10B981]">
                    <span className="section-header">HEALTHY / ACTIVE</span>
                    <span className="text-2xl font-medium text-emerald-600 font-bold">
                      {sensors.filter(s => s.status === 'ONLINE').length}
                    </span>
                  </div>
                  <div className="p-5 rounded-2xl bg-white shadow-sm border border-slate-200 flex flex-col gap-1 border-l-2 border-l-amber-500">
                    <span className="section-header">PROVISION MESH RATES</span>
                    <span className="text-2xl font-medium text-amber-600 font-bold">100%</span>
                  </div>
                  <div className="p-5 rounded-2xl bg-white shadow-sm border border-slate-200 flex flex-col gap-1 border-l-2 border-l-red-500">
                    <span className="section-header">OFFLINE / SILENT</span>
                    <span className="text-2xl font-medium text-red-600 font-bold">
                      {sensors.filter(s => s.status === 'OFFLINE').length}
                    </span>
                  </div>
                </div>

                {/* Filter and search bar */}
                <div className="flex flex-wrap gap-2.5 p-5 rounded-2xl border border-slate-200 shadow-sm bg-white">
                  <div className="flex-1 min-w-[240px] relative">
                    <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text"
                      value={sensorSearchQuery}
                      onChange={(e) => setSensorSearchQuery(e.target.value)}
                      placeholder="Search by sensor name or MAC..."
                      className="bg-slate-50 border border-slate-200 rounded-lg w-full pl-9 pr-4 py-2 text-xs font-medium text-slate-900 placeholder-[#52525B] focus:border-[#3B82F6] outline-none"
                    />
                  </div>

                  <select 
                    value={sensorTypeFilter}
                    onChange={(e) => setSensorTypeFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans text-slate-900 px-3 py-2 cursor-pointer focus:border-[#3B82F6] outline-none"
                  >
                    <option value="">All Categories</option>
                    <option value="Temperature">Temperature</option>
                    <option value="Humidity">Humidity</option>
                    <option value="Motion">Motion</option>
                    <option value="Multi">Multi</option>
                  </select>

                  <select 
                    value={sensorRpiFilter}
                    onChange={(e) => setSensorRpiFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans text-slate-900 px-3 py-2 cursor-pointer focus:border-[#3B82F6] outline-none"
                  >
                    <option value="">All Data Loggers</option>
                    {rpis.map(r => (
                      <option key={r.mac} value={r.mac}>{r.mac}</option>
                    ))}
                  </select>

                  <select 
                    value={sensorStatusFilter}
                    onChange={(e) => setSensorStatusFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans text-slate-900 px-3 py-2 cursor-pointer focus:border-[#3B82F6] outline-none"
                  >
                    <option value="">All Statuses</option>
                    <option value="ONLINE">ONLINE</option>
                    <option value="OFFLINE">OFFLINE</option>
                  </select>
                </div>

                {/* Table containing the BLE Sensors with inline details expansion */}
                <div className="border border-slate-100 rounded-xl bg-white overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">SENSOR NAME</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">TYPE / CATEGORY</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">PARENT Data Logger</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">STATUS</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">TIME SLOT</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">LAST HEARD</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-slate-500">ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sensors
                          .filter(s => {
                            const matchesSearch = s.name.toLowerCase().includes(sensorSearchQuery.toLowerCase()) || s.uid.toLowerCase().includes(sensorSearchQuery.toLowerCase());
                            const matchesType = sensorTypeFilter === '' || s.cat === sensorTypeFilter;
                            const matchesDataLogger = sensorRpiFilter === '' || s.rpi === sensorRpiFilter;
                            const matchesStatus = sensorStatusFilter === '' || s.status === sensorStatusFilter;
                            return matchesSearch && matchesType && matchesDataLogger && matchesStatus;
                          })
                          .map(sensor => {
                            const isExpanded = expandedSensorId === sensor.id;
                            return (
                              <React.Fragment key={sensor.id}>
                                <tr 
                                  onClick={() => setExpandedSensorId(isExpanded ? null : sensor.id)}
                                  className="border-b border-slate-100/60 hover:bg-slate-100 transition-base cursor-pointer group"
                                >
                                  <td className="px-4 py-3.5">
                                    <div className="flex items-center gap-3">
                                      <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                                      <div className="flex flex-col gap-0.5">
                                        <span className="text-xs font-bold text-slate-900">{sensor.name}</span>
                                        <span className="text-xs font-medium text-slate-600">{sensor.uid}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3.5 text-xs">
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${
                                      sensor.cat === 'Temperature' ? 'border-blue-500/30 text-blue-400 bg-blue-500/5' :
                                      sensor.cat === 'Humidity' ? 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5' :
                                      sensor.cat === 'Motion' ? 'border-purple-500/30 text-purple-400 bg-purple-500/5' :
                                      'border-amber-500/30 text-amber-400 bg-amber-500/5'
                                    }`}>
                                      {sensor.cat} / {sensor.type}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3.5 font-medium text-xs text-slate-500">{sensor.rpi}</td>
                                  <td className="px-4 py-3.5 text-xs">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                      sensor.status === 'ONLINE' 
                                        ? 'badge badge-online'
                                        : 'badge badge-offline'
                                    }`}>
                                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'currentColor' }} />
                                      {sensor.status}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3.5 font-medium text-xs text-slate-900">{sensor.slot || '—'}</td>
                                  <td className="px-4 py-3.5 font-medium text-xs text-slate-400">{sensor.lastSeen}</td>
                                  <td className="px-4 py-3.5 text-right text-xs">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteConfirm({ type: 'sensor', id: sensor.id, name: sensor.name });
                                      }}
                                      className="p-1.5 border border-[#EF4444]/20 hover:bg-[#EF4444]/10 rounded-lg text-red-600 transition-base opacity-0 group-hover:opacity-100"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </td>
                                </tr>
                                
                                {/* Expanded Row Details */}
                                {isExpanded && (
                                  <tr>
                                    <td colSpan={7} className="p-0">
                                      <div className="bg-white/40 border-b border-slate-100 px-6 py-5 flex flex-col gap-4 animate-[cardReveal_200ms_ease]">
                                        <div className="text-xs border-b border-slate-100 pb-2 text-slate-400 font-medium uppercase tracking-wider flex items-center justify-between">
                                          <span>Sensor Details Scope: {sensor.name}</span>
                                          <span>ID: {sensor.id}</span>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium text-slate-500">
                                          <div className="flex flex-col gap-1">
                                            <span>Unique ID:</span>
                                            <span className="text-slate-900">{sensor.uid}</span>
                                          </div>
                                          <div className="flex flex-col gap-1">
                                            <span>Parent Data Logger MAC:</span>
                                            <span className="text-slate-900">{sensor.rpi}</span>
                                          </div>
                                          <div className="flex flex-col gap-1">
                                            <span>Category Slot:</span>
                                            <span className="text-slate-900">{sensor.cat}</span>
                                          </div>
                                          <div className="flex flex-col gap-1">
                                            <span>Node HW Type:</span>
                                            <span className="text-slate-900">{sensor.type}</span>
                                          </div>
                                          <div className="flex flex-col gap-1 mt-2">
                                            <span>Mesh Zone:</span>
                                            <span className="text-slate-900">{groups.find(g => g.id === sensor.grpId)?.name || '—'}</span>
                                          </div>
                                          <div className="flex flex-col gap-1 mt-2">
                                            <span>Reporting Window:</span>
                                            <span className="text-slate-900">{sensor.slot || '—'}</span>
                                          </div>
                                          <div className="flex flex-col gap-1 mt-2">
                                            <span>Firmware Version:</span>
                                            <span className="text-slate-900">{sensor.fw}</span>
                                          </div>
                                          <div className="flex flex-col gap-1 mt-2">
                                            <span>Last Check-In:</span>
                                            <span className="text-slate-900">{sensor.lastSeen}</span>
                                          </div>
                                        </div>

                                        {/* Telemetry charts using Recharts */}
                                        <div className="mt-4 border border-slate-100 bg-slate-50/50 p-4 rounded-lg">
                                          <p className="text-xs font-medium uppercase text-slate-500 tracking-wider mb-3">Live Telemetry Throughput aggregate (last 24h)</p>
                                          <div className="h-[120px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                              <AreaChart data={TELEMETRY_MOCK}>
                                                <defs>
                                                  <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25}/>
                                                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                                                  </linearGradient>
                                                </defs>
                                                <XAxis dataKey="time" stroke="#52525B" fontSize={9} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#52525B" fontSize={9} tickLine={false} axisLine={false} />
                                                <ChartTooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E2E8F0', fontSize: 12, color: '#0F172A' }} />
                                                <Area type="monotone" dataKey="throughput" stroke="#2563EB" strokeWidth={1.5} fillOpacity={1} fill="url(#colorThroughput)" />
                                              </AreaChart>
                                            </ResponsiveContainer>
                                          </div>
                                        </div>

                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            } />

          </Routes>
        </div>
      </main>

      {/* ==========================================
          SHARED DIALOGS & DRAWERS (PORTALS)
          ========================================== */}
      
      {/* 1. Global Command Palette (⌘K) */}
      {commandPaletteOpen && (
        <>
          <div className="fixed inset-0 bg-slate-50/75 backdrop-blur-sm z-[999] overlay-fade-in" onClick={() => setCommandPaletteOpen(false)}></div>
          <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl glass-panel rounded-xl z-[1000] overflow-hidden modal-enter">
            <div className="px-4 py-3.5 border-b border-slate-200 flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search fleet or type command..."
                className="bg-transparent border-none text-slate-900 placeholder-[#52525B] text-sm outline-none w-full font-medium"
                autoFocus
              />
              <button 
                onClick={() => setCommandPaletteOpen(false)}
                className="text-xs font-medium bg-slate-50 border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded"
              >
                ESC
              </button>
            </div>

            <div className="p-3 flex flex-col gap-4 max-h-[300px] overflow-y-auto">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 uppercase px-2 mb-1">Quick Actions</span>
                <button 
                  onClick={() => {
                    setCommandPaletteOpen(false);
                    setShowSensorDrawer(true);
                  }}
                  className="w-full text-left px-2 py-2 hover:bg-slate-100 rounded-lg text-xs font-medium text-slate-900 flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500" /> Register new sensor</span>
                  <span className="text-xs text-slate-400">Scope /iot</span>
                </button>
                <button 
                  onClick={() => {
                    setCommandPaletteOpen(false);
                    navigate('/fleet');
                    addToast('info', 'OTA Deployment scope active');
                  }}
                  className="w-full text-left px-2 py-2 hover:bg-slate-100 rounded-lg text-xs font-medium text-slate-900 flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500" /> Push OTA to fleet</span>
                  <span className="text-xs text-slate-400">Scope /fleet</span>
                </button>
                <button 
                  onClick={() => {
                    setCommandPaletteOpen(false);
                    navigate('/organisation');
                  }}
                  className="w-full text-left px-2 py-2 hover:bg-slate-100 rounded-lg text-xs font-medium text-slate-900 flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500" /> Add new Organisation</span>
                  <span className="text-xs text-slate-400">Scope /organisation</span>
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 uppercase px-2 mb-1">Navigation</span>
                {[
                  { name: 'Overview Command Center', path: '/overview' },
                  { name: 'Organisation Miller Columns', path: '/organisation' },
                  { name: 'Data Logger Node Pools', path: '/rpi' },
                  { name: 'Fleet OTA & Statuses', path: '/fleet' },
                  { name: 'Sensor Registrations', path: '/iot' }
                ].map(item => (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setCommandPaletteOpen(false);
                    }}
                    className="w-full text-left px-2 py-2 hover:bg-slate-100 rounded-lg text-xs font-sans text-slate-500 hover:text-slate-900"
                  >
                    <ArrowRight className="w-3.5 h-3.5 inline mr-1" /> {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* 2. Right side Drawer for "View Devices" (inside Data Logger Node groups) */}
      {viewGroupDevices && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99] overlay-fade-in" onClick={() => setViewGroupDevices(null)}></div>
          <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white border-l border-slate-200 shadow-lg z-[100] flex flex-col justify-between drawer-enter">
            
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex flex-col gap-1 text-left">
                <h3 className="text-sm font-bold tracking-tight text-slate-900">Data Loggers in Mesh Zone</h3>
                <span className="badge bg-blue-50 text-blue-700 border-blue-200 self-start mt-1">
                  {viewGroupDevices.awsThingGroup || 'PENDING'}
                </span>
              </div>
              <button onClick={() => setViewGroupDevices(null)} className="text-slate-500 hover:text-slate-900 transition-base p-1 rounded hover:bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-4 text-left">
              <span className="section-header">Connected Hardware pool</span>
              
              <div className="flex flex-col gap-3">
                {rpis.filter(r => r.grpId === viewGroupDevices.id).length === 0 ? (
                  <p className="text-xs text-slate-400 font-medium italic">No devices registered in this group yet.</p>
                ) : (
                  rpis.filter(r => r.grpId === viewGroupDevices.id).map(rpi => (
                    <div key={rpi.mac} className="card-surface flex flex-col gap-3">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-sm font-bold text-slate-900">{rpi.mac}</span>
                        <span className={`px-2 py-0.2 rounded-full border text-xs ${
                          rpi.status === 'ONLINE' ? 'bg-[#10B981]/10 text-emerald-600 border-[#10B981]/30' : 'bg-[#EF4444]/10 text-red-600 border-[#EF4444]/30'
                        }`}>
                          {rpi.status}
                        </span>
                      </div>
                      
                      <div className="text-sm text-slate-500 font-medium flex flex-col gap-0.5">
                        <span>Organization Scope: <span className="text-slate-900">Pipra Solutions</span></span>
                        <span>Check-In: <span className="text-slate-900">{rpi.lastSeen}</span></span>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/60">
                        <button 
                          onClick={() => {
                            setRpis(prev => prev.map(item => {
                              if (item.mac === rpi.mac) {
                                return { ...item, status: 'OFFLINE', grpId: '' };
                              }
                              return item;
                            }));
                            addToast('warning', `Data Logger ${rpi.mac} returned to Waiting Room.`);
                            setViewGroupDevices(null);
                          }}
                          className="px-2.5 py-1 text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/25 rounded transition-base"
                        >
                          Deregister
                        </button>

                        <button 
                          onClick={() => {
                            setShowPushScriptModal(rpi as any);
                          }}
                          className="px-2.5 py-1 text-xs font-medium bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded transition-base"
                        >
                          Push Script
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex gap-3 justify-end bg-white/55">
              <button 
                onClick={() => setViewGroupDevices(null)} 
                className="px-4 py-2 border border-slate-200 text-xs font-medium text-slate-500 hover:text-slate-900 rounded-lg transition-base"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </>
      )}

      {/* 3. Global Mini-Modal Aggregate Fleet Metrics */}
      {globalMetricsOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] overlay-fade-in" onClick={() => setGlobalMetricsOpen(false)}></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md glass-panel rounded-xl z-[1000] overflow-hidden modal-enter p-5 flex flex-col gap-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> Fleet Aggregates</span>
              <button onClick={() => setGlobalMetricsOpen(false)} className="text-slate-500 hover:text-slate-900">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4 text-xs font-medium text-slate-500 py-2">
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span>TOTAL INSTALLED CONTROLLERS:</span>
                <span className="text-slate-900 font-bold">{rpis.length} nodes</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span>ACTIVE STREAMING BLE MESHES:</span>
                <span className="text-emerald-600 font-bold">{rpis.filter(r => r.status === 'ONLINE').length} active</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span>AVERAGE DOCKED UPTIME RATE:</span>
                <span className="text-slate-900 font-bold">99.84%</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span>CRITICAL ALERTS IN QUEUE:</span>
                <span className="text-red-600 font-bold">{notifications.length} unresolved</span>
              </div>
              <div className="flex justify-between pb-1.5">
                <span>OTA FIRMWARE UPDATE SUCCESS:</span>
                <span className="text-emerald-600 font-bold">100.0%</span>
              </div>
            </div>

            <button 
              onClick={() => setGlobalMetricsOpen(false)} 
              className="w-full bg-slate-100 border border-slate-200 hover:bg-slate-100 text-xs font-medium text-slate-900 py-2 rounded-lg transition-base text-center"
            >
              Acknowledge
            </button>
          </div>
        </>
      )}

      {/* 4. OTA Firmware Push Scheduler Modal */}
      {showOtaModal && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] overlay-fade-in flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowOtaModal(null); }}>
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl z-[1000] overflow-hidden modal-enter text-left">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[#2563EB] font-bold flex items-center gap-1"><Upload className="w-3.5 h-3.5" /> Push OTA Update</span>
              <button onClick={() => setShowOtaModal(null)} className="text-slate-500 hover:text-slate-900">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <div className="p-3.5 bg-white border border-slate-100 rounded-lg flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-400">TARGET DATA LOGGER</span>
                <span className="text-xs font-bold text-slate-900">{showOtaModal.mac} · Data Logger Node · {showOtaModal.status}</span>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-slate-500">Version number</span>
                <select 
                  id="target_ota_fw"
                  className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans text-slate-900 p-2.5 outline-none cursor-pointer focus:border-[#3B82F6]"
                >
                  <option value="v3.1">v3.1 — Latest Stable (2026-05-20)</option>
                  <option value="v3.0">v3.0 — Legacy Base</option>
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-slate-500">Update form</span>
                <input 
                  type="url"
                  id="target_ota_url"
                  placeholder="https://repo.warepro.local/firmware/v3.1.bin"
                  className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans text-slate-900 p-2.5 outline-none focus:border-[#3B82F6]"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-slate-500">Upload Document (Optional)</span>
                <input 
                  type="file"
                  id="target_ota_doc"
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#2563EB]/10 file:text-[#2563EB] hover:file:bg-[#2563EB]/20 border border-slate-200 rounded-lg bg-slate-50 p-1.5 cursor-pointer outline-none focus:border-[#3B82F6]"
                />
              </label>

              <div className="flex gap-3 justify-end border-t border-slate-100 pt-4 mt-2">
                <button 
                  onClick={() => setShowOtaModal(null)} 
                  className="px-4 py-2 border border-slate-200 text-xs font-medium text-slate-500 rounded-lg transition-base hover:text-slate-900"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    const fwEl = document.getElementById("target_ota_fw") as HTMLSelectElement;
                    const version = fwEl?.value || 'v3.1';
                    
                    setRpis(prev => prev.map(item => {
                      if (item.mac === showOtaModal.mac) {
                        return {
                          ...item,
                          fw: version
                        };
                      }
                      return item;
                    }));
                    setSensors(prev => prev.map(item => {
                      if (item.uid === showOtaModal.mac) {
                        return {
                          ...item,
                          fw: version
                        };
                      }
                      return item;
                    }));

                    const docEl = document.getElementById("target_ota_doc") as HTMLInputElement;
                    const hasDoc = docEl?.files && docEl.files.length > 0;

                    addToast('success', `OTA binary push sent to gateway ${showOtaModal.mac}. Target firmware updated to: ${version}${hasDoc ? ' with attached document' : ''}`);
                    setShowOtaModal(null);
                  }}
                  className="btn-primary btn-lg"
                >
                  Push OTA Job <ArrowRight className="w-4 h-4 inline ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
        </>
      )}

            {/* 4b. Push Script Modal */}
      {showPushScriptModal && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] overlay-fade-in flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowPushScriptModal(null); }}>
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl z-[1000] overflow-hidden modal-enter text-left">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[#2563EB] font-bold flex items-center gap-1"><Upload className="w-3.5 h-3.5" /> Push Script to Data Logger</span>
              <button onClick={() => setShowPushScriptModal(null)} className="text-slate-500 hover:text-slate-900">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <div className="p-3.5 bg-white border border-slate-100 rounded-lg flex flex-col gap-1">
                <span className="text-xs font-medium text-slate-400">TARGET DATA LOGGER</span>
                <span className="text-xs font-bold text-slate-900">{showPushScriptModal.mac} · Data Logger Node · {showPushScriptModal.status}</span>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-slate-500">Upload Script File</span>
                <input 
                  type="file"
                  id="target_script_file"
                  accept=".sh,.py,.js,.txt,.bash"
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#2563EB]/10 file:text-[#2563EB] hover:file:bg-[#2563EB]/20 border border-slate-200 rounded-lg bg-slate-50 p-1.5 cursor-pointer outline-none focus:border-[#3B82F6]"
                />
              </label>

              <div className="flex gap-3 justify-end border-t border-slate-100 pt-4 mt-2">
                <button 
                  onClick={() => setShowPushScriptModal(null)} 
                  className="px-4 py-2 border border-slate-200 text-xs font-medium text-slate-500 rounded-lg transition-base hover:text-slate-900"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    const fileEl = document.getElementById("target_script_file") as HTMLInputElement;
                    const file = fileEl?.files?.[0];
                    if (!file) {
                      addToast('warning', 'Please select a script file to upload');
                      return;
                    }
                    addToast('success', `Script (${file.name}) pushed successfully to Data Logger: ${showPushScriptModal.mac}`);
                    setShowPushScriptModal(null);
                  }}
                  className="btn-primary btn-lg"
                >
                  Push Script <ArrowRight className="w-4 h-4 inline ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
        </>
      )}

      {/* 5. Register Sensor Right Drawer */}
      {showSensorDrawer && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99] overlay-fade-in" onClick={() => setShowSensorDrawer(false)}></div>
          <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white border-l border-slate-200 shadow-lg z-[100] flex flex-col justify-between drawer-enter text-left">
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <span className="text-sm font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#2563EB]" /> REGISTER IOT SENSOR
              </span>
              <button onClick={() => setShowSensorDrawer(false)} className="text-slate-500 hover:text-slate-900 transition-base p-1 rounded hover:bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-5">
              
              <div className="flex flex-col gap-3">
                <span className="section-header">── IDENTITY ──</span>
                
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-slate-500 uppercase">Sensor Unique ID (MAC)*</span>
                  <input 
                    type="text" 
                    id="reg_sensor_uid"
                    className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-medium text-slate-900 focus:border-[#3B82F6] outline-none"
                    placeholder="11:22:33:44:55:09" 
                  />
                </label>
                
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-slate-500 uppercase">Sensor Display Name *</span>
                  <input 
                    type="text" 
                    id="reg_sensor_name"
                    className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-sans text-slate-900 focus:border-[#3B82F6] outline-none"
                    placeholder="Packaging conveyor Temp" 
                  />
                </label>
              </div>

              <div className="flex flex-col gap-3">
                <span className="section-header">── ASSIGNMENT ──</span>
                
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-slate-500 uppercase">Mesh Location Zone *</span>
                  <select 
                    id="reg_sensor_grp"
                    className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans text-slate-900 p-2.5 outline-none cursor-pointer focus:border-[#3B82F6]"
                  >
                    {groups.filter(g => g.type === 'SENSORS').map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-slate-500 uppercase">Parent Data Logger Data Logger *</span>
                  <select 
                    id="reg_sensor_rpi"
                    className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans text-slate-900 p-2.5 outline-none cursor-pointer focus:border-[#3B82F6]"
                  >
                    {rpis.filter(r => r.status === 'ONLINE').map(r => (
                      <option key={r.mac} value={r.mac}>{r.mac}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="flex flex-col gap-3">
                <span className="section-header">── HARDWARE CONFIG ──</span>
                
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-slate-500 uppercase">Category Slot</span>
                    <select 
                      id="reg_sensor_cat"
                      className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans text-slate-900 p-2.5 outline-none cursor-pointer focus:border-[#3B82F6]"
                    >
                      <option value="Temperature">Temperature</option>
                      <option value="Humidity">Humidity</option>
                      <option value="Motion">Motion</option>
                      <option value="Multi">Multi-Sensor</option>
                    </select>
                  </label>
                  
                  <label className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-slate-500 uppercase">Node HW Type</span>
                    <select 
                      id="reg_sensor_type"
                      className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-sans text-slate-900 p-2.5 outline-none cursor-pointer focus:border-[#3B82F6]"
                    >
                      <option value="Sensor">Sensor (BLE + WiFi)</option>
                      <option value="NRF52">NRF52 (BLE Low-Power)</option>
                      <option value="Sensor-S3">Sensor-S3 custom</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <span className="section-header">── ROUTING ──</span>
                
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-slate-500 uppercase">Specific Routing URL *</span>
                  <input 
                    type="url" 
                    id="reg_sensor_url"
                    className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-sans text-slate-900 focus:border-[#3B82F6] outline-none"
                    placeholder="https://api.warepro.local/sensors/ingest" 
                  />
                </label>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-200 flex gap-3 justify-end bg-white/55">
              <button 
                onClick={() => setShowSensorDrawer(false)}
                className="px-4 py-2 border border-slate-200 text-xs font-medium text-slate-500 hover:text-slate-900 rounded-lg transition-base"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  const uidEl = document.getElementById("reg_sensor_uid") as HTMLInputElement;
                  const nameEl = document.getElementById("reg_sensor_name") as HTMLInputElement;
                  const grpEl = document.getElementById("reg_sensor_grp") as HTMLSelectElement;
                  const rpiEl = document.getElementById("reg_sensor_rpi") as HTMLSelectElement;
                  const catEl = document.getElementById("reg_sensor_cat") as HTMLSelectElement;
                  const typeEl = document.getElementById("reg_sensor_type") as HTMLSelectElement;

                  if (!uidEl?.value || !nameEl?.value) {
                    addToast('error', 'Name and MAC Unique ID are required.');
                    return;
                  }

                  const newSensor = {
                    id: `s_${sensors.length + 1}`,
                    uid: uidEl.value,
                    name: nameEl.value,
                    cat: catEl.value,
                    type: typeEl.value,
                    rpi: rpiEl.value,
                    grpId: grpEl.value,
                    status: "ONLINE",
                    slot: "12:00–12:15",
                    fw: "v3.0",
                    lastSeen: new Date().toISOString().substring(0, 19).replace('T', ' ')
                  };

                  setSensors([...sensors, newSensor]);
                  addToast('success', `Sensor registered and provisioned: ${newSensor.name}`);
                  setShowSensorDrawer(false);
                }}
                className="btn-primary btn-lg"
              >
                Register & Provision <ArrowRight className="w-4 h-4 inline ml-1" />
              </button>
            </div>

          </div>
        </>
      )}

      {/* 6. Delete Confirmation Overlay Modal */}
      {deleteConfirm && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] overlay-fade-in" onClick={() => setDeleteConfirm(null)}></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm glass-panel rounded-xl z-[10000] overflow-hidden modal-enter p-5 flex flex-col gap-4 text-left">
            
            <div className="flex items-center gap-3 text-red-600 border-b border-slate-100 pb-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm font-bold text-slate-900">⚠ Detach Hardware Device?</span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to delete <span className="text-slate-900 font-bold font-medium">"{deleteConfirm.name}"</span> from the fleet database? This action is absolute and cannot be undone.
            </p>

            <div className="flex gap-3 justify-end mt-2">
              <button 
                onClick={() => setDeleteConfirm(null)}
                className="px-3 py-1.5 border border-slate-200 text-xs font-medium text-slate-500 rounded-lg hover:text-slate-900 transition-base"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteConfirm}
                className="px-3.5 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/25 rounded-lg text-xs font-bold transition-base"
              >
                Remove Device
              </button>
            </div>

          </div>
        </>
      )}

    </div>
  );
}
