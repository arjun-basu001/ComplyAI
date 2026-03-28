import React, { useState, useEffect, useMemo } from 'react';
import { 
  Map, 
  FileCheck, 
  Library, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Bell, 
  UserCircle, 
  Wrench, 
  Globe, 
  Info, 
  ArrowRight, 
  Lightbulb, 
  X,
  CheckCircle2,
  PlusCircle,
  Plus,
  Minus,
  Menu,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Scan,
  Sparkles,
  Brain,
  Baby,
  Clapperboard,
  Database,
  HeartPulse,
  Landmark,
  LayoutGrid,
  Bot,
  MessageSquare,
  Eye,
  Smile,
  TrendingUp,
  Mic
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type RiskLevel = 'Low' | 'Medium' | 'High';

interface Feature {
  id: string;
  label: string;
  enabled: boolean;
  riskWeight: number;
  riskLevel: RiskLevel;
  icon: any;
}

interface Region {
  id: string;
  label: string;
  selected: boolean;
}

interface Policy {
  id: string;
  title: string;
  description: string;
  icon: any;
}

// --- Components ---

const SidebarItem: React.FC<{ icon: any, label: string, active?: boolean, onClick?: () => void }> = ({ icon: Icon, label, active = false, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative group ${
      active 
        ? 'text-primary-brand font-bold bg-white whisper-shadow' 
        : 'text-on-surface-variant hover:text-primary-brand hover:bg-surface-container-low'
    }`}
  >
    {active && (
      <motion.div 
        layoutId="sidebar-active"
        className="absolute left-0 w-1 h-6 bg-primary-brand rounded-r-full"
      />
    )}
    <Icon size={20} className={active ? 'text-primary-brand' : 'text-on-surface-variant group-hover:scale-110 transition-transform'} />
    <span className="font-headline text-sm tracking-tight">{label}</span>
  </button>
);

const FeatureToggle: React.FC<{ 
  label: string, 
  enabled: boolean, 
  onToggle: () => void, 
  icon: any,
  riskLevel: RiskLevel 
}> = ({ label, enabled, onToggle, icon: Icon, riskLevel }) => {
  const riskColors = {
    Low: 'bg-green-100 text-green-700 border-green-200',
    Medium: 'bg-amber-100 text-amber-700 border-amber-200',
    High: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <motion.label 
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl cursor-pointer hover:bg-white group transition-all duration-200 whisper-shadow border border-on-surface-variant/5"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg transition-colors ${enabled ? 'bg-primary-brand/10 text-primary-brand' : 'bg-surface-container-low text-on-surface-variant/60'}`}>
          <Icon size={18} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-medium text-on-surface text-xs lg:text-sm leading-tight">{label}</span>
          <span className={`text-[9px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded border w-fit ${riskColors[riskLevel]}`}>
            {riskLevel} Risk
          </span>
        </div>
      </div>
      <div 
        onClick={(e) => { e.preventDefault(); onToggle(); }}
        className={`toggle-track ${enabled ? 'active' : ''}`}
      >
        <div className="toggle-thumb" />
      </div>
    </motion.label>
  );
};

const RegionChip: React.FC<{ label: string, selected: boolean, onToggle: () => void }> = ({ label, selected, onToggle }) => (
  <button 
    onClick={onToggle}
    className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all duration-200 shadow-sm hover:scale-105 active:scale-95 ${
      selected 
        ? 'bg-primary-brand text-white shadow-xl' 
        : 'bg-surface-container-lowest text-on-surface hover:bg-primary-brand hover:text-white'
    }`}
  >
    {selected ? <CheckCircle2 size={14} fill="currentColor" /> : <PlusCircle size={14} />}
    {label}
  </button>
);

const ComplianceScore = ({ score }: { score: number }) => {
  const color = score > 80 ? 'text-green-600' : score > 50 ? 'text-amber-500' : 'text-red-500';
  
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl whisper-shadow border border-on-surface-variant/5">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <path
            className="text-surface-container-high stroke-current"
            strokeWidth="3"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <motion.path
            initial={{ strokeDasharray: "0, 100" }}
            animate={{ strokeDasharray: `${score}, 100` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`${color} stroke-current`}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold font-headline ${color}`}>{score}%</span>
        </div>
      </div>
      <span className="mt-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Compliance Score</span>
    </div>
  );
};

export default function App() {
  const [features, setFeatures] = useState<Feature[]>([
    { id: 'facial-biometric', label: 'Facial/Biometric Recognition', enabled: false, riskWeight: 30, riskLevel: 'High', icon: Scan },
    { id: 'gen-ai-synthetic', label: 'Generative AI / Synthetic Content', enabled: true, riskWeight: 15, riskLevel: 'Medium', icon: Sparkles },
    { id: 'autonomous-decision', label: 'Autonomous Decision Making', enabled: false, riskWeight: 25, riskLevel: 'High', icon: Brain },
    { id: 'child-directed', label: 'Child-Directed Features', enabled: false, riskWeight: 20, riskLevel: 'Medium', icon: Baby },
    { id: 'deepfake-media', label: 'Deepfake / Synthetic Media Generation', enabled: false, riskWeight: 20, riskLevel: 'Medium', icon: Clapperboard },
    { id: 'personal-data', label: 'Personal Data Processing', enabled: true, riskWeight: 10, riskLevel: 'Low', icon: Database },
    { id: 'health-medical', label: 'Health/Medical AI', enabled: false, riskWeight: 25, riskLevel: 'High', icon: HeartPulse },
    { id: 'financial-credit', label: 'Financial AI / Credit Scoring', enabled: false, riskWeight: 25, riskLevel: 'High', icon: Landmark },
    { id: 'content-recommendation', label: 'Content Recommendation / Personalization', enabled: true, riskWeight: 10, riskLevel: 'Low', icon: LayoutGrid },
    { id: 'agentic-ai', label: 'Agentic AI / Autonomous Agents', enabled: false, riskWeight: 20, riskLevel: 'Medium', icon: Bot },
    { id: 'nlp-chatbots', label: 'Natural Language Processing / Chatbots', enabled: true, riskWeight: 10, riskLevel: 'Low', icon: MessageSquare },
    { id: 'computer-vision', label: 'Computer Vision', enabled: false, riskWeight: 15, riskLevel: 'Medium', icon: Eye },
    { id: 'emotion-sentiment', label: 'Emotion/Sentiment Detection', enabled: false, riskWeight: 15, riskLevel: 'Medium', icon: Smile },
    { id: 'predictive-analytics', label: 'Predictive Analytics', enabled: true, riskWeight: 10, riskLevel: 'Low', icon: TrendingUp },
    { id: 'voice-audio', label: 'Voice/Audio Processing', enabled: false, riskWeight: 15, riskLevel: 'Medium', icon: Mic },
  ]);

  const [regions, setRegions] = useState<Region[]>([
    { id: 'eu', label: 'European Union', selected: true },
    { id: 'us', label: 'United States', selected: true },
    { id: 'sg', label: 'Singapore', selected: false },
    { id: 'in', label: 'India', selected: true },
    { id: 'cn', label: 'China', selected: false },
  ]);

  const policies: Policy[] = [
    { id: 'eu-ai', title: 'EU AI Act', description: 'Comprehensive regulation on artificial intelligence based on risk levels.', icon: ShieldCheck },
    { id: 'gdpr', title: 'GDPR Compliance', description: 'Data protection and privacy for individuals within the EU.', icon: FileCheck },
    { id: 'nist', title: 'NIST Framework', description: 'Voluntary standards for managing cybersecurity-related risk.', icon: Library },
  ];

  const [activePolicyIdx, setActivePolicyIdx] = useState(0);
  const [showToast, setShowToast] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<'map' | 'report' | 'library' | 'settings' | 'support'>('map');
  const [appName, setAppName] = useState('[My AI App]');
  const [isEditingAppName, setIsEditingAppName] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState('Profile');

  const toggleFeature = (id: string) => {
    setFeatures(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  const toggleRegion = (id: string) => {
    setRegions(prev => prev.map(r => r.id === id ? { ...r, selected: !r.selected } : r));
  };

  const complianceScore = useMemo(() => {
    const totalRisk = features.filter(f => f.enabled).reduce((acc, f) => acc + f.riskWeight, 0);
    const regionPenalty = regions.filter(r => r.selected).length * 5;
    return Math.max(0, Math.min(100, 100 - (totalRisk + regionPenalty)));
  }, [features, regions]);

  const selectedRegionsCount = regions.filter(r => r.selected).length;

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-primary-brand/20 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        w-64 fixed left-0 top-0 h-screen bg-slate-50 flex flex-col py-8 px-4 z-[70] transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="mb-10 px-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-tighter text-primary-brand font-headline">ComplyAI</h1>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/50 mt-1 font-bold">The Authoritative Curator</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-on-surface-variant">
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 space-y-2">
          <SidebarItem icon={Map} label="Feature Map" active={currentTab === 'map'} onClick={() => { setCurrentTab('map'); setIsSidebarOpen(false); }} />
          <SidebarItem icon={FileCheck} label="Compliance Report" active={currentTab === 'report'} onClick={() => { setCurrentTab('report'); setIsSidebarOpen(false); }} />
          <SidebarItem icon={Library} label="Policy Library" active={currentTab === 'library'} onClick={() => { setCurrentTab('library'); setIsSidebarOpen(false); }} />
          <SidebarItem icon={Settings} label="Settings" active={currentTab === 'settings'} onClick={() => { setCurrentTab('settings'); setIsSidebarOpen(false); }} />
        </nav>

        <div className="mt-auto space-y-1">
          <button 
            onClick={() => { setCurrentTab('support'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-2 transition-all text-sm ${currentTab === 'support' ? 'text-primary-brand font-bold' : 'text-on-surface-variant hover:text-primary-brand'}`}
          >
            <HelpCircle size={18} />
            <span>Support</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-red-600 transition-all text-sm">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 relative">
        {/* Top Bar */}
        <header className="fixed top-0 right-0 w-full lg:w-[calc(100%-16rem)] h-16 z-40 glass-panel flex justify-between items-center px-4 lg:px-8">
          <div className="flex items-center gap-3 lg:gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 hover:bg-surface-container-low rounded-lg">
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2 lg:gap-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Product:</span>
              <span className="font-headline text-sm lg:text-lg font-semibold tracking-tight text-primary-brand truncate max-w-[120px] lg:max-w-none">{appName}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 lg:gap-6">
            <button className="hidden sm:block text-xs lg:text-sm font-medium text-secondary-brand hover:underline transition-all">Review Status</button>
            <div className="flex items-center gap-3 lg:gap-4 text-on-surface-variant">
              <button className="hover:text-primary-brand transition-colors p-1">
                <Bell size={18} />
              </button>
              <button className="hover:text-primary-brand transition-colors p-1">
                <UserCircle size={22} />
              </button>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <section className="pt-20 lg:pt-24 pb-32 px-4 lg:px-12 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {currentTab === 'map' ? (
              <motion.div
                key="map-view"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Hero Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1"
                  >
                <div className="flex items-center gap-3 group mb-4">
                  {isEditingAppName ? (
                    <input
                      type="text"
                      value={appName}
                      onChange={(e) => setAppName(e.target.value)}
                      onBlur={() => setIsEditingAppName(false)}
                      onKeyDown={(e) => e.key === 'Enter' && setIsEditingAppName(false)}
                      autoFocus
                      className="font-headline text-3xl lg:text-5xl font-extrabold tracking-tighter text-primary-brand bg-transparent border-b-2 border-primary-brand outline-none"
                    />
                  ) : (
                    <h2 
                      onClick={() => setIsEditingAppName(true)}
                      className="font-headline text-3xl lg:text-5xl font-extrabold tracking-tighter text-primary-brand leading-tight cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      {appName}
                    </h2>
                  )}
                  <button onClick={() => setIsEditingAppName(!isEditingAppName)} className="text-on-surface-variant/40 hover:text-primary-brand transition-colors">
                    <Wrench size={20} />
                  </button>
                </div>
                <h2 className="font-headline text-2xl lg:text-4xl font-bold tracking-tight text-secondary-brand mb-4 leading-tight">
                  Map Your Product's <br/>
                  <span className="italic">AI Compliance DNA</span>
                </h2>
                    <p className="text-base lg:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
                      Tell us what you're building and where it's going. We'll handle the 400+ pages of policy headaches.
                    </p>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <ComplianceScore score={complianceScore} />
                  </motion.div>
                </div>

                {/* Bento Layout */}
                <div className="flex flex-col gap-8 lg:gap-12">
                  {/* Step 1: Target Regions */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="w-full"
                  >
                    <div className="bg-surface-container-low rounded-2xl p-6 lg:p-10 border border-on-surface-variant/5 whisper-shadow">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary-brand text-white flex items-center justify-center font-bold text-lg shadow-lg">1</div>
                          <div>
                            <div className="flex items-center gap-3">
                              <Globe size={24} className="text-primary-brand" />
                              <h3 className="font-headline text-xl lg:text-2xl font-bold">Target Regions</h3>
                            </div>
                            <p className="text-sm text-on-surface-variant mt-1">Where will your AI product be deployed?</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-primary-brand/5 rounded-xl border border-primary-brand/10">
                          <span className="text-xs font-bold uppercase tracking-widest text-primary-brand">
                            {selectedRegionsCount} Jurisdictions Selected
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Map Interface */}
                        <div className="lg:col-span-8 relative min-h-[300px] lg:min-h-[400px] rounded-2xl overflow-hidden bg-surface-container-highest border border-on-surface-variant/10 whisper-shadow group">
                          <img 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHFNgKFUbOK8ELZysF-AM4unl7W2Ng3Xl2_2hN03bSAXmcDxQY15x4e_eChreW2rZyaJNL2knX5BAVD61L2Gwl77fKa6IzD0ITYT6cNXtBjQ9wBK8RTGWuxH4GnwRVQejSqY5MFjfO2pZWIjHuSy-nfPVzX1QTQJO1hYUqfZ-Q94Hdd9VJVdv1VZ1XHbKIl_EyilasYIdnesmj4PkBbj65wZHoZ7rVEQNgPKGYw99DsHexgysppV2Xn7UXrz1vcA9hZ8aIJWh_qFM"
                            alt="Global map"
                            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-multiply grayscale group-hover:grayscale-0 transition-all duration-700"
                            referrerPolicy="no-referrer"
                          />
                          
                          {/* Interactive Region Chips Overlay */}
                          <div className="absolute inset-0 p-6 lg:p-10 flex flex-wrap content-center justify-center gap-3 lg:gap-4">
                            {regions.map(region => (
                              <RegionChip 
                                key={region.id}
                                label={region.label}
                                selected={region.selected}
                                onToggle={() => toggleRegion(region.id)}
                              />
                            ))}
                          </div>

                          <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4 p-4 glass-panel rounded-xl border border-white/20 shadow-2xl">
                            <Info size={20} className="text-primary-brand shrink-0" />
                            <p className="text-xs lg:text-sm text-on-surface leading-tight font-medium">
                              Selecting regions updates your compliance score and regulatory roadmap in real-time.
                            </p>
                          </div>
                        </div>

                        {/* Jurisdictional Summary */}
                        <div className="lg:col-span-4 space-y-4">
                          <div className="p-6 bg-white rounded-2xl border border-on-surface-variant/5 whisper-shadow h-full">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant/60 mb-4">Active Frameworks</h4>
                            <div className="space-y-4">
                              {regions.filter(r => r.selected).map(r => (
                                <div key={r.id} className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-low border border-on-surface-variant/5">
                                  <div className="w-8 h-8 rounded-lg bg-primary-brand/10 flex items-center justify-center text-primary-brand shrink-0">
                                    <ShieldCheck size={16} />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-on-surface">{r.label}</p>
                                    <p className="text-[10px] text-on-surface-variant/70 uppercase tracking-tighter">Regulatory Context Active</p>
                                  </div>
                                </div>
                              ))}
                              {selectedRegionsCount === 0 && (
                                <div className="text-center py-12">
                                  <Globe size={40} className="mx-auto text-on-surface-variant/20 mb-3" />
                                  <p className="text-sm text-on-surface-variant italic">No regions selected yet.</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Step 2: Software Features */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full"
                  >
                    <div className="bg-surface-container-low rounded-2xl p-6 lg:p-10 border border-on-surface-variant/5 whisper-shadow">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-full bg-secondary-brand text-white flex items-center justify-center font-bold text-lg shadow-lg">2</div>
                        <div>
                          <div className="flex items-center gap-3">
                            <Wrench size={24} className="text-secondary-brand" />
                            <h3 className="font-headline text-xl lg:text-2xl font-bold">Software Features</h3>
                          </div>
                          <p className="text-sm text-on-surface-variant mt-1">What AI capabilities are you integrating?</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
                        {features.map((feature, idx) => (
                          <motion.div
                            key={feature.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + idx * 0.03 }}
                          >
                            <FeatureToggle 
                              label={feature.label}
                              enabled={feature.enabled}
                              onToggle={() => toggleFeature(feature.id)}
                              icon={feature.icon}
                              riskLevel={feature.riskLevel}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Policy Carousel - New Interactive Element */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-12 bg-surface-container-low rounded-xl p-6 lg:p-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-headline text-lg lg:text-xl font-bold">Regulatory Frameworks</h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setActivePolicyIdx(prev => Math.max(0, prev - 1))}
                        disabled={activePolicyIdx === 0}
                        className="p-2 rounded-full bg-white whisper-shadow disabled:opacity-30 hover:bg-slate-50 transition-colors"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button 
                        onClick={() => setActivePolicyIdx(prev => Math.min(policies.length - 1, prev + 1))}
                        disabled={activePolicyIdx === policies.length - 1}
                        className="p-2 rounded-full bg-white whisper-shadow disabled:opacity-30 hover:bg-slate-50 transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="overflow-hidden">
                    <motion.div 
                      animate={{ x: `-${activePolicyIdx * 100}%` }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="flex"
                    >
                      {policies.map(policy => (
                        <div key={policy.id} className="min-w-full px-2">
                          <div className="bg-white p-6 rounded-2xl whisper-shadow flex flex-col md:flex-row gap-6 items-center">
                            <div className="w-16 h-16 bg-secondary-fixed rounded-2xl flex items-center justify-center shrink-0">
                              <policy.icon size={32} className="text-primary-brand" />
                            </div>
                            <div className="text-center md:text-left">
                              <h4 className="font-headline text-lg font-bold text-primary-brand mb-1">{policy.title}</h4>
                              <p className="text-sm text-on-surface-variant leading-relaxed">{policy.description}</p>
                            </div>
                            <button className="md:ml-auto px-6 py-2 rounded-full border border-primary-brand text-primary-brand text-sm font-bold hover:bg-primary-brand hover:text-white transition-all">
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  </div>
                </motion.div>

                {/* Action Bar */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-12 flex justify-center"
                >
                  <button 
                    onClick={() => setCurrentTab('report')}
                    className="primary-gradient text-white px-10 lg:px-16 py-4 lg:py-6 rounded-full font-headline text-lg lg:text-xl font-bold shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-4 group relative overflow-hidden"
                  >
                    <motion.div 
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                    />
                    Analyze Compliance
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              </motion.div>
            ) : currentTab === 'report' ? (
              <motion.div
                key="report-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-12"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-headline text-3xl lg:text-4xl font-extrabold tracking-tighter text-primary-brand">Multi-Region Compliance Report</h2>
                    <p className="text-on-surface-variant">Generated for {appName} • {new Date().toLocaleDateString()}</p>
                  </div>
                  <button 
                    onClick={() => setCurrentTab('map')}
                    className="flex items-center gap-2 text-secondary-brand font-bold hover:underline"
                  >
                    <ChevronLeft size={20} />
                    Back to Map
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  {[
                    {
                      id: 'eu',
                      label: 'European Union',
                      flag: '🇪🇺',
                      score: 72,
                      summary: 'High focus on EU AI Act and GDPR. Risk classification: High.',
                      actions: [
                        'Conduct a Data Protection Impact Assessment (DPIA)',
                        'Register with the EU AI Database',
                        'Implement transparency disclosures'
                      ]
                    },
                    {
                      id: 'us',
                      label: 'United States',
                      flag: '🇺🇸',
                      score: 85,
                      summary: 'Alignment with NIST AI RMF and sector-specific guidelines.',
                      actions: [
                        'Review NIST AI Risk Management Framework',
                        'Assess California AI Transparency Act requirements',
                        'Document algorithmic bias mitigation'
                      ]
                    },
                    {
                      id: 'sg',
                      label: 'Singapore',
                      flag: '🇸🇬',
                      score: 91,
                      summary: 'Strong adherence to PDPC guidelines and Model AI Governance Framework.',
                      actions: [
                        'Update Privacy Policy for PDPA compliance',
                        'Review AI Governance Framework alignment',
                        'Implement explainability documentation'
                      ]
                    },
                    {
                      id: 'in',
                      label: 'India',
                      flag: '🇮🇳',
                      score: 78,
                      summary: 'Alignment with MEITY guidelines and emerging Digital India Act framework.',
                      actions: [
                        'Review MEITY AI Advisory requirements',
                        'Assess data localization compliance',
                        'Implement mandatory AI labeling for public tools'
                      ]
                    },
                    {
                      id: 'cn',
                      label: 'China',
                      flag: '🇨🇳',
                      score: 65,
                      summary: 'Strict adherence to CAC algorithms and Generative AI regulations.',
                      actions: [
                        'Register algorithms with CAC filing system',
                        'Implement real-name verification for users',
                        'Ensure content alignment with core socialist values'
                      ]
                    }
                  ]
                  .filter(report => regions.find(r => r.id === report.id)?.selected)
                  .map((regionReport) => (
                    <motion.div 
                      key={regionReport.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="bg-white rounded-3xl whisper-shadow overflow-hidden border border-on-surface-variant/5"
                    >
                      <div className="flex flex-col lg:flex-row">
                        <div className="lg:w-1/3 p-8 bg-surface-container-low flex flex-col items-center justify-center text-center border-b lg:border-b-0 lg:border-r border-on-surface-variant/5">
                          <div className="text-5xl mb-4">{regionReport.flag}</div>
                          <h3 className="font-headline text-2xl font-bold text-primary-brand mb-2">{regionReport.label}</h3>
                          <ComplianceScore score={regionReport.score} />
                        </div>
                        <div className="lg:w-2/3 p-8 space-y-6">
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60 mb-2">Executive Summary</h4>
                            <p className="text-on-surface-variant leading-relaxed">{regionReport.summary}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60 mb-4">Required Actions</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {regionReport.actions.map((action, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 bg-surface-container-low rounded-xl">
                                  <div className="w-5 h-5 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="text-[10px] font-bold text-primary-brand">{i + 1}</span>
                                  </div>
                                  <span className="text-xs font-medium text-on-surface">{action}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="pt-4 flex justify-end">
                            <button className="text-sm font-bold text-primary-brand hover:underline flex items-center gap-2">
                              Download Detailed PDF <ArrowRight size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-primary-brand text-white p-10 rounded-3xl whisper-shadow flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="max-w-xl text-center md:text-left">
                    <h3 className="font-headline text-2xl lg:text-3xl font-bold mb-4">Need a Certified Global Audit?</h3>
                    <p className="text-white/80 leading-relaxed">Our compliance experts can review your full architecture and provide a certified report for all 50+ jurisdictions we track.</p>
                  </div>
                  <button className="px-10 py-4 bg-white text-primary-brand rounded-full font-bold hover:bg-slate-100 transition-all shadow-xl hover:scale-105 active:scale-95 whitespace-nowrap">
                    Book Expert Consultation
                  </button>
                </div>
              </motion.div>
            ) : currentTab === 'library' ? (
              <motion.div
                key="library-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h2 className="font-headline text-3xl lg:text-4xl font-extrabold tracking-tighter text-primary-brand">Policy Library</h2>
                    <p className="text-on-surface-variant">Browse 400+ global AI regulations and frameworks.</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Search policies..." 
                        className="pl-10 pr-4 py-2 bg-white rounded-xl whisper-shadow border border-on-surface-variant/10 focus:outline-none focus:ring-2 focus:ring-primary-brand/20 text-sm"
                      />
                      <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { title: "EU AI Act", region: "Europe", flag: "🇪🇺", status: "Compliant", risk: "High", color: "bg-green-100 text-green-700" },
                    { title: "GDPR", region: "Europe", flag: "🇪🇺", status: "Compliant", risk: "Critical", color: "bg-green-100 text-green-700" },
                    { title: "NIST AI RMF", region: "USA", flag: "🇺🇸", status: "Action Required", risk: "Medium", color: "bg-amber-100 text-amber-700" },
                    { title: "OECD AI Principles", region: "Global", flag: "🌐", status: "Compliant", risk: "Low", color: "bg-green-100 text-green-700" },
                    { title: "California AB 331", region: "USA (CA)", flag: "🇺🇸", status: "Not Applicable", risk: "High", color: "bg-slate-100 text-slate-600" },
                    { title: "Singapore AI Governance", region: "Singapore", flag: "🇸🇬", status: "Action Required", risk: "Medium", color: "bg-amber-100 text-amber-700" },
                  ].map((p, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ y: -5 }}
                      className="bg-white p-6 rounded-2xl whisper-shadow border border-on-surface-variant/5 group cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-surface-container-low rounded-xl flex items-center justify-center group-hover:bg-primary-brand group-hover:text-white transition-colors">
                            <ShieldCheck size={20} />
                          </div>
                          <span className="text-2xl">{p.flag}</span>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${p.color}`}>
                          {p.status}
                        </span>
                      </div>
                      <h4 className="font-headline text-lg font-bold text-primary-brand mb-1">{p.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-on-surface-variant mb-4">
                        <span className="flex items-center gap-1"><Globe size={12} /> {p.region}</span>
                        <span className="w-1 h-1 rounded-full bg-on-surface-variant/30" />
                        <span>Risk: {p.risk}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant/70 leading-relaxed mb-6">
                        Standardized framework for ensuring transparency and accountability in automated decision systems.
                      </p>
                      <button className="w-full py-2 bg-surface-container-low text-primary-brand text-xs font-bold rounded-lg hover:bg-primary-brand hover:text-white transition-all">
                        Open Documentation
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : currentTab === 'settings' ? (
              <motion.div
                key="settings-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto space-y-8"
              >
                <div>
                  <h2 className="font-headline text-3xl lg:text-4xl font-extrabold tracking-tighter text-primary-brand">Settings</h2>
                  <p className="text-on-surface-variant">Manage your account and product configuration.</p>
                </div>

                <div className="bg-white rounded-3xl whisper-shadow overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-4">
                    <div className="bg-surface-container-low p-6 space-y-2 border-r border-on-surface-variant/5">
                      {['Profile', 'Product', 'Security', 'Integrations', 'Billing'].map((item) => (
                        <button 
                          key={item}
                          onClick={() => setActiveSettingsTab(item)}
                          className={`w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeSettingsTab === item ? 'bg-white text-primary-brand shadow-sm' : 'text-on-surface-variant hover:bg-white/50'}`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                    <div className="col-span-3 p-8">
                      {activeSettingsTab === 'Profile' && (
                        <div className="space-y-8">
                          <section>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant/60 mb-6">Profile Information</h3>
                            <div className="flex items-center gap-6 mb-8">
                              <div className="w-20 h-20 rounded-full bg-primary-brand/10 flex items-center justify-center text-primary-brand text-2xl font-bold border-2 border-primary-brand/20">
                                EH
                              </div>
                              <div>
                                <h4 className="text-xl font-bold text-on-surface">Ethan Hunt</h4>
                                <p className="text-sm text-on-surface-variant">IMF Field Agent • Senior Compliance Officer</p>
                                <button className="mt-2 text-xs font-bold text-primary-brand hover:underline">Change Avatar</button>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-on-surface-variant">Full Name</label>
                                <input type="text" defaultValue="Ethan Hunt" className="w-full px-4 py-2 bg-surface-container-lowest rounded-xl border border-on-surface-variant/10 focus:outline-none focus:ring-2 focus:ring-primary-brand/20 text-sm" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-on-surface-variant">Email Address</label>
                                <input type="email" defaultValue="ethan.hunt@imf.gov" className="w-full px-4 py-2 bg-surface-container-lowest rounded-xl border border-on-surface-variant/10 focus:outline-none focus:ring-2 focus:ring-primary-brand/20 text-sm" />
                              </div>
                            </div>
                          </section>
                          <div className="flex justify-end gap-4 pt-4">
                            <button className="px-8 py-2 bg-primary-brand text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all whisper-shadow">Save Changes</button>
                          </div>
                        </div>
                      )}

                      {activeSettingsTab === 'Product' && (
                        <div className="space-y-8">
                          <section>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant/60 mb-6">Product Configuration</h3>
                            <div className="space-y-6">
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-on-surface-variant">Application Name</label>
                                <input 
                                  type="text" 
                                  value={appName} 
                                  onChange={(e) => setAppName(e.target.value)}
                                  className="w-full px-4 py-2 bg-surface-container-lowest rounded-xl border border-on-surface-variant/10 focus:outline-none focus:ring-2 focus:ring-primary-brand/20 text-sm" 
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-bold text-on-surface-variant">Description</label>
                                <textarea rows={3} defaultValue="A generative AI application for enterprise data analysis." className="w-full px-4 py-2 bg-surface-container-lowest rounded-xl border border-on-surface-variant/10 focus:outline-none focus:ring-2 focus:ring-primary-brand/20 text-sm resize-none" />
                              </div>
                            </div>
                          </section>
                          <div className="flex justify-end gap-4 pt-4">
                            <button className="px-8 py-2 bg-primary-brand text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all whisper-shadow">Update Product</button>
                          </div>
                        </div>
                      )}

                      {activeSettingsTab === 'Security' && (
                        <div className="space-y-8 text-center py-12">
                          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                            <ShieldCheck size={32} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-on-surface">Security Center</h3>
                            <p className="text-sm text-on-surface-variant mt-2">Manage your authentication methods and security protocols.</p>
                          </div>
                          <div className="max-w-xs mx-auto space-y-3">
                            <button className="w-full py-2 bg-white border border-on-surface-variant/10 rounded-xl text-sm font-bold hover:bg-surface-container-low transition-colors">Enable 2FA</button>
                            <button className="w-full py-2 bg-white border border-on-surface-variant/10 rounded-xl text-sm font-bold hover:bg-surface-container-low transition-colors">Change Password</button>
                          </div>
                        </div>
                      )}

                      {activeSettingsTab === 'Integrations' && (
                        <div className="space-y-8 text-center py-12">
                          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                            <Wrench size={32} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-on-surface">Integrations</h3>
                            <p className="text-sm text-on-surface-variant mt-2">Connect ComplyAI to your existing development workflow.</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                            {['GitHub', 'Slack', 'Jira', 'Linear'].map(tool => (
                              <div key={tool} className="p-4 border border-on-surface-variant/10 rounded-2xl flex flex-col items-center gap-2">
                                <div className="w-8 h-8 bg-surface-container-low rounded-lg" />
                                <span className="text-xs font-bold">{tool}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeSettingsTab === 'Billing' && (
                        <div className="space-y-8 text-center py-12">
                          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                            <Globe size={32} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-on-surface">Billing & Plans</h3>
                            <p className="text-sm text-on-surface-variant mt-2">You are currently on the <span className="font-bold text-primary-brand">Enterprise Pro</span> plan.</p>
                          </div>
                          <div className="bg-surface-container-low p-6 rounded-2xl max-w-sm mx-auto">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-on-surface-variant">Next Invoice</span>
                              <span className="font-bold">$499.00</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-on-surface-variant">Date</span>
                              <span className="font-bold">April 28, 2026</span>
                            </div>
                            <button className="w-full mt-6 py-2 bg-primary-brand text-white rounded-xl text-sm font-bold">Manage Subscription</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : currentTab === 'support' ? (
              <motion.div
                key="support-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto space-y-12 py-12 text-center"
              >
                <div className="w-24 h-24 bg-primary-brand/10 text-primary-brand rounded-full flex items-center justify-center mx-auto mb-6">
                  <HelpCircle size={48} />
                </div>
                <div className="space-y-4">
                  <h2 className="font-headline text-4xl font-extrabold tracking-tighter text-primary-brand">How can we help?</h2>
                  <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
                    Our mission-critical support team is standing by to assist you with your AI compliance journey.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                  {[
                    { icon: Library, title: 'Documentation', desc: 'Browse our extensive guides.' },
                    { icon: FileCheck, title: 'Submit Ticket', desc: 'Get expert assistance.' },
                    { icon: Globe, title: 'Community', desc: 'Join the discussion.' }
                  ].map((item, i) => (
                    <div key={i} className="p-6 bg-white rounded-2xl whisper-shadow border border-on-surface-variant/5 hover:border-primary-brand transition-all cursor-pointer group">
                      <item.icon size={24} className="text-primary-brand mx-auto mb-4 group-hover:scale-110 transition-transform" />
                      <h4 className="font-bold text-on-surface mb-1">{item.title}</h4>
                      <p className="text-xs text-on-surface-variant">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </section>

        {/* Humor Banner */}
        <AnimatePresence>
          {showToast && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-4 right-4 lg:bottom-8 lg:right-8 z-50"
            >
              <div className="glass-panel text-on-primary-fixed-variant px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-[calc(100vw-2rem)] sm:max-w-sm border border-on-surface-variant/10 whisper-shadow">
                <div className="bg-secondary-fixed p-2 rounded-lg shrink-0">
                  <Lightbulb size={20} className="text-primary-brand" />
                </div>
                <p className="text-xs font-medium italic text-on-primary-fixed">
                  "Fun fact: Reading these policies in one sitting is the #1 cause of 'Regulator's Migraine' in 2026."
                </p>
                <button 
                  onClick={() => setShowToast(false)}
                  className="text-on-surface-variant/50 hover:text-on-surface-variant transition-colors p-1"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
