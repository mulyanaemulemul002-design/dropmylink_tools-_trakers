import { useState, useMemo } from "react";
import {
  Home,
  LayoutGrid,
  Compass,
  Search,
  SlidersHorizontal,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Calendar,
  Users,
  Lightbulb,
  Zap,
  Bell,
  Clock,
} from "lucide-react";

// ─── STATIC DATA ───────────────────────────────────────────

const AIRDROPS = [
  {
    id: 1,
    title: "LayerZero",
    url: "layerzero.network",
    tags: ["Cross-chain", "DeFi"],
    description: "Omnichain interoperability protocol menghubungkan 30+ blockchain. Eligible via bridging & penggunaan dApp.",
    status: "Active",
    reward: "ZRO Token",
    difficulty: "Medium",
  },
  {
    id: 2,
    title: "zkSync Era",
    url: "zksync.io",
    tags: ["ZK", "Layer2"],
    description: "ZK-EVM L2 by Matter Labs. Farm via bridge, swap di dApp, dan mint NFT di mainnet.",
    status: "Active",
    reward: "ZK Token",
    difficulty: "Easy",
  },
  {
    id: 3,
    title: "StarkNet",
    url: "starknet.io",
    tags: ["ZK", "Layer2"],
    description: "ZK-STARK based Layer 2. STRK sudah didistribusikan ke early users dan developer.",
    status: "Distributed",
    reward: "STRK Token",
    difficulty: "Medium",
  },
  {
    id: 4,
    title: "Scroll",
    url: "scroll.io",
    tags: ["ZK", "Layer2"],
    description: "ZK-EVM equivalent L2. Bridge dan gunakan dApp di Scroll mainnet untuk eligibility.",
    status: "Active",
    reward: "SCR Token",
    difficulty: "Easy",
  },
  {
    id: 5,
    title: "Monad",
    url: "monad.xyz",
    tags: ["Layer1", "DeFi"],
    description: "High-performance EVM-compatible L1. 10,000 TPS dengan parallel execution. Ikuti testnet.",
    status: "Testnet",
    reward: "MONAD Token",
    difficulty: "Hard",
  },
  {
    id: 6,
    title: "Berachain",
    url: "berachain.com",
    tags: ["Layer1", "DeFi"],
    description: "EVM-identical L1 dengan Proof of Liquidity. Provide likuiditas untuk farming BERA.",
    status: "Active",
    reward: "BERA Token",
    difficulty: "Medium",
  },
  {
    id: 7,
    title: "Fuel Network",
    url: "fuel.network",
    tags: ["Layer2", "DeFi"],
    description: "Modular execution layer tercepat. Farm via testnet dan interaksi mainnet awal.",
    status: "Mainnet",
    reward: "FUEL Token",
    difficulty: "Medium",
  },
  {
    id: 8,
    title: "Initia",
    url: "initia.xyz",
    tags: ["Layer1", "DeFi"],
    description: "Interwoven L1 dengan native L2 ecosystem. Farm via testnet dan aktivitas Discord.",
    status: "Testnet",
    reward: "INIT Token",
    difficulty: "Easy",
  },
  {
    id: 9,
    title: "Taiko",
    url: "taiko.xyz",
    tags: ["ZK", "Layer2"],
    description: "Based ZK-EVM rollup yang sepenuhnya desentralisasi. Bridge dan transaksi di mainnet.",
    status: "Active",
    reward: "TKO Token",
    difficulty: "Easy",
  },
  {
    id: 10,
    title: "Linea",
    url: "linea.build",
    tags: ["ZK", "Layer2"],
    description: "ZK-EVM L2 by Consensys / MetaMask. Gunakan ekosistem Linea secara aktif.",
    status: "Active",
    reward: "LINEA Token",
    difficulty: "Easy",
  },
];

const NEWS_ITEMS = [
  { id: 1, title: "Ethereum ETF Inflows Capai Rekor $1.2B Minggu Ini", category: "Market", time: "2j lalu", color: "from-blue-600/30 to-blue-900/20" },
  { id: 2, title: "LayerZero ZRO Airdrop: Panduan Lengkap Eligibility", category: "Airdrop", time: "4j lalu", color: "from-violet-600/30 to-violet-900/20" },
  { id: 3, title: "zkSync Umumkan Kampanye Insentif Q3 2025", category: "Layer2", time: "6j lalu", color: "from-sky-600/30 to-sky-900/20" },
  { id: 4, title: "Monad Testnet Buka Registrasi Publik", category: "Testnet", time: "1h lalu", color: "from-emerald-600/30 to-emerald-900/20" },
  { id: 5, title: "Berachain TVL Tembus $500M dalam 72 Jam", category: "DeFi", time: "1h lalu", color: "from-amber-600/30 to-amber-900/20" },
  { id: 6, title: "SEC Setujui Trading Opsi Spot Bitcoin ETF", category: "Regulasi", time: "2h lalu", color: "from-orange-600/30 to-orange-900/20" },
];

const QUICK_INFO = [
  {
    id: "tge",
    type: "TGE",
    label: "Token Launch",
    icon: Zap,
    color: "from-amber-500/20 to-amber-900/10",
    accent: "text-amber-400",
    ring: "ring-amber-500/25",
    items: [
      { name: "Monad (MONAD)", date: "Q3 2025", status: "Soon" },
      { name: "Fuel Network (FUEL)", date: "Jun 2025", status: "Confirmed" },
      { name: "Initia (INIT)", date: "Mei 2025", status: "Confirmed" },
    ],
  },
  {
    id: "snapshot",
    type: "SNAPSHOT",
    label: "Governance Vote",
    icon: Clock,
    color: "from-sky-500/20 to-sky-900/10",
    accent: "text-sky-400",
    ring: "ring-sky-500/25",
    items: [
      { name: "Arbitrum DAO", date: "15 Mei", status: "Active" },
      { name: "Uniswap v4 Fee", date: "18 Mei", status: "Upcoming" },
      { name: "Optimism RetroPGF", date: "22 Mei", status: "Upcoming" },
    ],
  },
  {
    id: "new",
    type: "NEW AIRDROP",
    label: "Baru Diumumkan",
    icon: Bell,
    color: "from-violet-500/20 to-violet-900/10",
    accent: "text-violet-400",
    ring: "ring-violet-500/25",
    items: [
      { name: "Taiko (TKO)", date: "Announced", status: "New" },
      { name: "Scroll (SCR)", date: "Announced", status: "New" },
      { name: "Linea (LINEA)", date: "Expected", status: "Rumored" },
    ],
  },
];

const CALENDAR_EVENTS = [
  { id: 1, date: "Mei 10", title: "LayerZero Snapshot", type: "Snapshot", color: "bg-sky-500/20 text-sky-300" },
  { id: 2, date: "Mei 12", title: "Initia TGE", type: "TGE", color: "bg-amber-500/20 text-amber-300" },
  { id: 3, date: "Mei 15", title: "Arbitrum DAO Vote", type: "DAO", color: "bg-blue-500/20 text-blue-300" },
  { id: 4, date: "Mei 18", title: "Monad Testnet Phase 2", type: "Testnet", color: "bg-emerald-500/20 text-emerald-300" },
  { id: 5, date: "Mei 20", title: "Scroll SCR Distribution", type: "Airdrop", color: "bg-violet-500/20 text-violet-300" },
  { id: 6, date: "Mei 25", title: "Fuel Network Mainnet", type: "Launch", color: "bg-rose-500/20 text-rose-300" },
];

const TIPS = [
  {
    id: 1,
    icon: "🔥",
    title: "Cara Farming L2 Secara Efektif",
    content: "Bridge minimal 0.1 ETH, lakukan 10+ transaksi berbeda setiap bulan, gunakan dApp native seperti DEX dan lending protocol di jaringan target.",
    tags: ["Layer2", "Beginner"],
  },
  {
    id: 2,
    icon: "💼",
    title: "Multi-Wallet Strategy",
    content: "Gunakan 3-5 wallet berbeda. Pastikan setiap wallet punya aktivitas independen dan tidak saling transfer langsung satu sama lain.",
    tags: ["Strategy", "Advanced"],
  },
  {
    id: 3,
    icon: "⛽",
    title: "Gas Fee Management",
    content: "Gunakan Ethereum di jam sepi (02:00–06:00 WIB) untuk gas lebih murah. Pantau di etherscan.io/gastracker sebelum transaksi.",
    tags: ["Tips", "Saving"],
  },
  {
    id: 4,
    icon: "✅",
    title: "Cara Cek Eligibility Airdrop",
    content: "Selalu cek hanya lewat official website. Jangan klik link dari DM siapapun. Gunakan wallet yang sama saat farming.",
    tags: ["Security", "Beginner"],
  },
];

const P2P_LISTINGS = [
  { id: 1, user: "crypto_whale", selling: "1.000 ARB", price: "0,95 USDT", min: "100 ARB", method: "Bank Transfer", verified: true },
  { id: 2, user: "defi_trader", selling: "500 OP", price: "2,10 USDT", min: "50 OP", method: "DANA / GoPay", verified: true },
  { id: 3, user: "airdrop_hunter", selling: "200 ZK", price: "0,28 USDT", min: "100 ZK", method: "Bank Transfer", verified: false },
  { id: 4, user: "web3_indo", selling: "0,5 ETH", price: "2.950 USDT", min: "0.1 ETH", method: "Semua Metode", verified: true },
];

// ─── TAG & STATUS COLORS ────────────────────────────────────

const TAG_COLORS = {
  "Cross-chain": { text: "text-violet-300", bg: "bg-violet-500/20", ring: "ring-violet-500/30" },
  DeFi:          { text: "text-sky-300",    bg: "bg-sky-500/20",    ring: "ring-sky-500/30" },
  Layer2:        { text: "text-emerald-300",bg: "bg-emerald-500/20",ring: "ring-emerald-500/30" },
  Layer1:        { text: "text-cyan-300",   bg: "bg-cyan-500/20",   ring: "ring-cyan-500/30" },
  ZK:            { text: "text-fuchsia-300",bg: "bg-fuchsia-500/20",ring: "ring-fuchsia-500/30" },
  Beginner:      { text: "text-green-300",  bg: "bg-green-500/20",  ring: "ring-green-500/30" },
  Advanced:      { text: "text-red-300",    bg: "bg-red-500/20",    ring: "ring-red-500/30" },
  Strategy:      { text: "text-purple-300", bg: "bg-purple-500/20", ring: "ring-purple-500/30" },
  Security:      { text: "text-yellow-300", bg: "bg-yellow-500/20", ring: "ring-yellow-500/30" },
  Tips:          { text: "text-teal-300",   bg: "bg-teal-500/20",   ring: "ring-teal-500/30" },
  Saving:        { text: "text-orange-300", bg: "bg-orange-500/20", ring: "ring-orange-500/30" },
};
const DEFAULT_TAG = { text: "text-white/50", bg: "bg-white/10", ring: "ring-white/20" };

const STATUS_STYLE = {
  Active:      "bg-green-500/15 text-green-400 ring-green-500/25",
  Testnet:     "bg-yellow-500/15 text-yellow-400 ring-yellow-500/25",
  Distributed: "bg-gray-500/15 text-gray-400 ring-gray-500/25",
  Mainnet:     "bg-blue-500/15 text-blue-400 ring-blue-500/25",
  Upcoming:    "bg-violet-500/15 text-violet-400 ring-violet-500/25",
};

// ─── SHARED COMPONENTS ──────────────────────────────────────

function TagChip({ tag }) {
  const c = TAG_COLORS[tag] || DEFAULT_TAG;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ring-1 ${c.text} ${c.bg} ${c.ring}`}>
      {tag}
    </span>
  );
}

function Favicon({ domain }) {
  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
      alt=""
      width={24}
      height={24}
      className="rounded-sm"
      onError={(e) => { e.currentTarget.style.display = "none"; }}
    />
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="px-5 pt-6 mb-5">
      <h1 className="text-lg font-bold text-white">{title}</h1>
      {subtitle && <p className="text-xs text-white/30 mt-0.5">{subtitle}</p>}
    </div>
  );
}

// ─── HOME SCREEN ────────────────────────────────────────────

function HomeScreen() {
  return (
    <div className="pb-32">
      {/* Hero */}
      <div className="px-5 pt-6 mb-6">
        <span className="text-[10px] font-semibold text-blue-400 tracking-widest uppercase">Web3 Channel</span>
        <h1 className="text-2xl font-bold text-white leading-tight mt-1">
          Airdrop & DeFi<br />
          <span className="text-white/35">Info Hub</span>
        </h1>
        <p className="text-xs text-white/30 mt-2">Info airdrop, news, dan tips Web3 terkurasi setiap hari</p>
      </div>

      {/* Ad Banner 16:9 */}
      <div className="px-5 mb-6">
        <div className="w-full aspect-video rounded-2xl overflow-hidden ring-1 ring-white/10 relative bg-gradient-to-br from-blue-900/40 via-violet-900/30 to-black flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-violet-600/5" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-blue-500/50 via-violet-500/50 to-transparent" />
          <div className="relative text-center">
            <p className="text-[10px] text-white/20 uppercase tracking-widest mb-1">Iklan</p>
            <p className="text-base font-bold text-white/15">Banner 16:9</p>
            <p className="text-[10px] text-white/10 mt-1">Hubungi admin untuk pasang iklan</p>
          </div>
        </div>
      </div>

      {/* News Horizontal Scroll */}
      <div className="mb-6">
        <div className="flex items-center justify-between px-5 mb-3">
          <h2 className="text-sm font-semibold text-white">📰 News Terkini</h2>
          <span className="text-[10px] text-white/30">Geser →</span>
        </div>
        <div
          className="flex gap-3 pl-5 pr-5 pb-1 overflow-x-auto snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {NEWS_ITEMS.map((news) => (
            <div
              key={news.id}
              className={`snap-start flex-none w-36 aspect-square rounded-2xl p-3 bg-gradient-to-br ${news.color} ring-1 ring-white/10 flex flex-col justify-between cursor-pointer hover:ring-white/20 transition-all active:scale-95`}
            >
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-white/10 text-white/60 w-fit">
                {news.category}
              </span>
              <div>
                <p className="text-[11px] font-semibold text-white leading-snug line-clamp-3">{news.title}</p>
                <p className="text-[10px] text-white/30 mt-1">{news.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Info: 3 boards 16:9 */}
      <div className="mb-6">
        <div className="flex items-center justify-between px-5 mb-3">
          <h2 className="text-sm font-semibold text-white">⚡ Info Cepat</h2>
          <span className="text-[10px] text-white/30">3 papan →</span>
        </div>
        <div
          className="flex gap-3 pl-5 pr-5 pb-1 overflow-x-auto snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {QUICK_INFO.map((info) => {
            const Icon = info.icon;
            return (
              <div
                key={info.id}
                className={`snap-start flex-none w-[78vw] max-w-sm aspect-video rounded-2xl p-4 bg-gradient-to-br ${info.color} ring-1 ${info.ring} flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-1.5 ${info.accent}`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold tracking-wider">{info.type}</span>
                  </div>
                  <span className="text-[9px] text-white/30">{info.label}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {info.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-[11px] text-white/80 font-medium truncate mr-2">{item.name}</span>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-[9px] text-white/30">{item.date}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          item.status === "New"       ? "bg-violet-500/30 text-violet-300" :
                          item.status === "Active"    ? "bg-green-500/30 text-green-300" :
                          item.status === "Confirmed" ? "bg-blue-500/30 text-blue-300" :
                          item.status === "Rumored"   ? "bg-gray-500/30 text-gray-300" :
                                                        "bg-amber-500/30 text-amber-300"
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── AIRDROP LIST SCREEN ─────────────────────────────────────

function AirdropScreen() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const allTags = useMemo(() => {
    const tags = new Set();
    AIRDROPS.forEach((a) => a.tags.forEach((t) => tags.add(t)));
    return ["All", ...Array.from(tags)];
  }, []);

  const filtered = useMemo(() => {
    return AIRDROPS.filter((item) => {
      const matchTag = activeTag === "All" || item.tags.includes(activeTag);
      const q = search.toLowerCase();
      const matchSearch = !q || item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
      return matchTag && matchSearch;
    });
  }, [search, activeTag]);

  function copyUrl(item) {
    navigator.clipboard.writeText(`https://${item.url}`).catch(() => {});
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="pb-32">
      <SectionHeader title="🪂 Airdrop List" subtitle={`${AIRDROPS.length} proyek terdaftar`} />

      <div className="px-5">
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          <input
            type="search"
            placeholder="Cari airdrop..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/10 ring-1 ring-white/20 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:ring-white/40 transition-all"
          />
        </div>

        {/* Filter */}
        <div className="mb-4">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ring-1 transition-all ${
              activeTag !== "All"
                ? "bg-blue-500/20 ring-blue-400/40 text-blue-300"
                : "bg-white/10 ring-white/20 text-white/60"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {activeTag !== "All" ? `Filter: ${activeTag}` : "Filter"}
            {filterOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {filterOpen && (
            <div className="mt-3 bg-white/[0.06] ring-1 ring-white/15 rounded-2xl p-3 flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => { setActiveTag(tag); setFilterOpen(false); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium ring-1 transition-all ${
                    activeTag === tag
                      ? "bg-blue-500/20 ring-blue-500/50 text-blue-300"
                      : "bg-white/[0.04] ring-white/10 text-white/50 hover:bg-white/10"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results count */}
        <p className="text-[11px] text-white/30 mb-3">
          {filtered.length} hasil{activeTag !== "All" && <span> untuk <span className="text-white/50">{activeTag}</span></span>}
        </p>

        {/* Cards */}
        <div className="flex flex-col gap-3">
          {filtered.map((item) => {
            const expanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className={`rounded-2xl ring-1 transition-all duration-300 ${
                  expanded ? "bg-white/10 ring-white/25" : "bg-white/[0.06] ring-white/15"
                }`}
              >
                {/* Header — tap to expand */}
                <div
                  className="flex items-center gap-3 p-4 cursor-pointer select-none"
                  onClick={() => setExpandedId(expanded ? null : item.id)}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/10 ring-1 ring-white/15 flex items-center justify-center overflow-hidden">
                    <Favicon domain={item.url} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-white">{item.title}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ring-1 ${STATUS_STYLE[item.status] || STATUS_STYLE.Active}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/30 font-mono mt-0.5 truncate">{item.url}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-white/30 flex-shrink-0 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
                </div>

                {/* Expanded */}
                {expanded && (
                  <div className="px-4 pb-4 pt-3 border-t border-white/[0.07]">
                    <p className="text-xs text-white/55 leading-relaxed mb-3">{item.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {item.tags.map((tag) => <TagChip key={tag} tag={tag} />)}
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ring-1 text-white/40 bg-white/10 ring-white/15">
                        {item.reward}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ring-1 ${
                        item.difficulty === "Easy" ? "bg-green-500/15 text-green-400 ring-green-500/25" :
                        item.difficulty === "Hard" ? "bg-red-500/15 text-red-400 ring-red-500/25" :
                                                     "bg-yellow-500/15 text-yellow-400 ring-yellow-500/25"
                      }`}>
                        {item.difficulty}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => window.open(`https://${item.url}`, "_blank")}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-white/90 active:scale-95 transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Buka Website
                      </button>
                      <button
                        onClick={() => copyUrl(item)}
                        title="Salin URL"
                        className="w-11 h-11 rounded-xl bg-white/10 ring-1 ring-white/20 flex items-center justify-center hover:bg-white/15 transition-all"
                      >
                        {copiedId === item.id
                          ? <Check className="w-4 h-4 text-green-400" />
                          : <Copy className="w-4 h-4 text-white/50" />
                        }
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── DISCOVER SCREEN ─────────────────────────────────────────

function DiscoverScreen() {
  const [section, setSection] = useState("p2p");

  const SECTIONS = [
    { id: "p2p",      label: "P2P Seller",       icon: Users },
    { id: "calendar", label: "Airdrop Calendar",  icon: Calendar },
    { id: "tips",     label: "Tips & Trik",       icon: Lightbulb },
  ];

  return (
    <div className="pb-32">
      <SectionHeader title="🧭 Discover" subtitle="P2P, Kalender, dan Tips Web3" />

      {/* Section Tabs */}
      <div
        className="flex gap-2 px-5 mb-5 overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {SECTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSection(id)}
            className={`flex-none flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold ring-1 transition-all ${
              section === id
                ? "bg-white text-black ring-white"
                : "bg-white/10 ring-white/20 text-white/60 hover:bg-white/15"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* P2P Seller */}
      {section === "p2p" && (
        <div className="px-5 flex flex-col gap-3">
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20">
            <span className="text-base leading-none mt-0.5">⚠️</span>
            <p className="text-[11px] text-amber-300/80 leading-relaxed">
              Lakukan transaksi dengan hati-hati. Platform tidak bertanggung jawab atas risiko P2P deal.
            </p>
          </div>
          {P2P_LISTINGS.map((listing) => (
            <div key={listing.id} className="rounded-2xl bg-white/[0.06] ring-1 ring-white/15 p-4">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-full bg-white/10 ring-1 ring-white/15 flex items-center justify-center text-sm">
                  👤
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-white">{listing.user}</span>
                    {listing.verified && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-white/30">{listing.method}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.07]">
                <div>
                  <p className="text-sm font-bold text-white">{listing.selling}</p>
                  <p className="text-[10px] text-white/35 mt-0.5">Min: {listing.min}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-400">{listing.price}</p>
                  <p className="text-[10px] text-white/30">per token</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Airdrop Calendar */}
      {section === "calendar" && (
        <div className="px-5 flex flex-col gap-3">
          {CALENDAR_EVENTS.map((event) => (
            <div key={event.id} className="rounded-2xl bg-white/[0.06] ring-1 ring-white/15 p-4 flex items-center gap-4">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white/10 ring-1 ring-white/15 flex flex-col items-center justify-center">
                <span className="text-[9px] text-white/40 uppercase font-medium">{event.date.split(" ")[0]}</span>
                <span className="text-xl font-bold text-white leading-none">{event.date.split(" ")[1]}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{event.title}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full mt-1.5 inline-block font-medium ${event.color}`}>
                  {event.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tips & Trik */}
      {section === "tips" && (
        <div className="px-5 flex flex-col gap-3">
          {TIPS.map((tip) => (
            <div key={tip.id} className="rounded-2xl bg-white/[0.06] ring-1 ring-white/15 p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl leading-none">{tip.icon}</span>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-white mb-1.5">{tip.title}</h3>
                  <p className="text-xs text-white/50 leading-relaxed">{tip.content}</p>
                  <div className="flex gap-1.5 mt-2.5 flex-wrap">
                    {tip.tags.map((tag) => <TagChip key={tag} tag={tag} />)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── BOTTOM NAV ──────────────────────────────────────────────

function BottomNav({ active, onSelect }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6">
      <div className="flex items-center gap-1 px-3 py-2 rounded-full bg-white/[0.08] backdrop-blur-2xl ring-1 ring-white/15 shadow-2xl shadow-black/60">
        {[
          { id: "home",     label: "Home",    icon: Home },
          { id: "airdrops", label: "Airdrop", icon: LayoutGrid },
          { id: "discover", label: "Discover",icon: Compass },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`flex flex-col items-center gap-0.5 px-6 py-2 rounded-full transition-all duration-200 ${
              active === id ? "bg-white/15 text-white" : "text-white/35 hover:text-white/60"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[9px] font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("home");

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      {/* Mesh gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute -bottom-20 left-1/4 w-[350px] h-[350px] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="max-w-lg mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/10 ring-1 ring-white/20 flex items-center justify-center">
              <span className="text-sm">🪂</span>
            </div>
            <span className="text-sm font-bold text-white">
              DROP<span className="text-white/35">MYLINK</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 ring-1 ring-green-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] text-green-400 font-medium">Live</span>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="relative z-10 max-w-lg mx-auto">
        {tab === "home"     && <HomeScreen />}
        {tab === "airdrops" && <AirdropScreen />}
        {tab === "discover" && <DiscoverScreen />}
      </div>

      <BottomNav active={tab} onSelect={setTab} />
    </div>
  );
}
