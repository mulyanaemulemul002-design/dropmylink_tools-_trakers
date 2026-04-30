import { useState, useMemo, useRef } from "react";
import {
  Home, LayoutGrid, Compass, Search, SlidersHorizontal,
  ExternalLink, Copy, Check, ChevronDown, ChevronUp,
  Calendar, Users, Lightbulb, Zap, Bell, Clock,
  Settings, Plus, Trash2, X, Shield, Link2,
} from "lucide-react";

// ─── ADMIN CONFIG ─────────────────────────────────────────────
// Ganti email dan PIN ini sebelum deploy!
const ADMIN_EMAIL = "mulyanaemulemul002@gmail.com";
const ADMIN_PIN   = "050208";

// ─── STORAGE ──────────────────────────────────────────────────
const K = {
  airdrops:  "dml_airdrops_v3",
  ads:       "dml_ads_v3",
  news:      "dml_news_v3",
  qinfo:     "dml_qinfo_v3",
};

function load(key, def) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; }
  catch { return def; }
}
function save(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

// ─── DEFAULT DATA ─────────────────────────────────────────────
const DEF_AIRDROPS = [
  { id: 1, icon: "", title: "LayerZero", url: "layerzero.network", customImage: "", tags: ["Cross-chain","DeFi"], description: "Omnichain interoperability protocol menghubungkan 30+ blockchain. Eligible via bridging & penggunaan dApp.", status: "Active", reward: "ZRO Token", difficulty: "Medium" },
  { id: 2, icon: "", title: "zkSync Era", url: "zksync.io", customImage: "", tags: ["ZK","Layer2"], description: "ZK-EVM L2 by Matter Labs. Farm via bridge, swap di dApp, dan mint NFT di mainnet.", status: "Active", reward: "ZK Token", difficulty: "Easy" },
  { id: 3, icon: "", title: "Scroll", url: "scroll.io", customImage: "", tags: ["ZK","Layer2"], description: "ZK-EVM equivalent L2. Bridge dan gunakan dApp di Scroll mainnet untuk eligibility.", status: "Active", reward: "SCR Token", difficulty: "Easy" },
  { id: 4, icon: "", title: "Monad", url: "monad.xyz", customImage: "", tags: ["Layer1","DeFi"], description: "High-performance EVM-compatible L1. 10,000 TPS dengan parallel execution.", status: "Testnet", reward: "MONAD Token", difficulty: "Hard" },
  { id: 5, icon: "", title: "Berachain", url: "berachain.com", customImage: "", tags: ["Layer1","DeFi"], description: "EVM-identical L1 dengan Proof of Liquidity. Provide likuiditas untuk farming BERA.", status: "Active", reward: "BERA Token", difficulty: "Medium" },
  { id: 6, icon: "", title: "Initia", url: "initia.xyz", customImage: "", tags: ["Layer1","DeFi"], description: "Interwoven L1 dengan native L2 ecosystem. Farm via testnet dan aktivitas Discord.", status: "Testnet", reward: "INIT Token", difficulty: "Easy" },
];

const DEF_ADS = [
  { id: 1, title: "Banner Iklan 16:9", subtitle: "Hubungi admin untuk memasang iklan", imageUrl: "", buttonText: "HUBUNGI KAMI", targetUrl: "https://t.me/dropmylink", active: true },
];

const DEF_NEWS = [
  { id: 1, title: "Ethereum ETF Inflows Capai Rekor $1.2B Minggu Ini", category: "Market", time: "2j lalu", color: "from-blue-700/40 to-blue-900/20", buttonText: "BACA SELENGKAPNYA", targetUrl: "https://coindesk.com" },
  { id: 2, title: "LayerZero ZRO Airdrop: Panduan Lengkap Eligibility", category: "Airdrop", time: "4j lalu", color: "from-blue-600/35 to-blue-800/20", buttonText: "LIHAT PANDUAN", targetUrl: "https://layerzero.network" },
  { id: 3, title: "zkSync Umumkan Kampanye Insentif Q3 2025", category: "Layer2", time: "6j lalu", color: "from-blue-500/30 to-blue-900/20", buttonText: "BACA SELENGKAPNYA", targetUrl: "https://zksync.io" },
  { id: 4, title: "Monad Testnet Buka Registrasi Publik", category: "Testnet", time: "1h lalu", color: "from-blue-800/40 to-blue-900/20", buttonText: "DAFTAR SEKARANG", targetUrl: "https://monad.xyz" },
];

const DEF_QINFO = [
  { id: 1, board: "tge",      name: "Monad (MONAD)",      date: "Q3 2025",  status: "Soon",      targetUrl: "https://monad.xyz" },
  { id: 2, board: "tge",      name: "Fuel Network (FUEL)", date: "Jun 2025", status: "Confirmed", targetUrl: "https://fuel.network" },
  { id: 3, board: "tge",      name: "Initia (INIT)",       date: "Mei 2025", status: "Confirmed", targetUrl: "https://initia.xyz" },
  { id: 4, board: "snapshot", name: "Arbitrum DAO",         date: "15 Mei",   status: "Active",    targetUrl: "https://snapshot.org" },
  { id: 5, board: "snapshot", name: "Uniswap v4 Fee",       date: "18 Mei",   status: "Upcoming",  targetUrl: "https://snapshot.org" },
  { id: 6, board: "snapshot", name: "Optimism RetroPGF",    date: "22 Mei",   status: "Upcoming",  targetUrl: "https://snapshot.org" },
  { id: 7, board: "new",      name: "Taiko (TKO)",          date: "Announced",status: "New",       targetUrl: "https://taiko.xyz" },
  { id: 8, board: "new",      name: "Scroll (SCR)",         date: "Announced",status: "New",       targetUrl: "https://scroll.io" },
  { id: 9, board: "new",      name: "Linea (LINEA)",        date: "Expected", status: "Rumored",   targetUrl: "https://linea.build" },
];

const DEF_CALENDAR = [
  { id: 1, date: "Mei 10", title: "LayerZero Snapshot", type: "Snapshot", color: "bg-blue-500/20 text-blue-300" },
  { id: 2, date: "Mei 12", title: "Initia TGE", type: "TGE", color: "bg-amber-500/20 text-amber-300" },
  { id: 3, date: "Mei 15", title: "Arbitrum DAO Vote", type: "DAO", color: "bg-blue-600/20 text-blue-300" },
  { id: 4, date: "Mei 18", title: "Monad Testnet Phase 2", type: "Testnet", color: "bg-emerald-500/20 text-emerald-300" },
  { id: 5, date: "Mei 20", title: "Scroll SCR Distribution", type: "Airdrop", color: "bg-blue-400/20 text-blue-300" },
  { id: 6, date: "Mei 25", title: "Fuel Network Mainnet", type: "Launch", color: "bg-rose-500/20 text-rose-300" },
];

const DEF_TIPS = [
  { id: 1, icon: "🔥", title: "Farming L2 Secara Efektif", content: "Bridge minimal 0.1 ETH, lakukan 10+ transaksi berbeda tiap bulan, gunakan dApp native seperti DEX dan lending protocol di jaringan target.", tags: ["Layer2","Beginner"] },
  { id: 2, icon: "💼", title: "Multi-Wallet Strategy", content: "Gunakan 3-5 wallet berbeda. Pastikan tiap wallet punya aktivitas independen dan tidak saling transfer langsung.", tags: ["Strategy","Advanced"] },
  { id: 3, icon: "⛽", title: "Hemat Gas Fee ETH", content: "Transaksi di jam sepi (02:00–06:00 WIB) untuk gas lebih murah. Cek etherscan.io/gastracker sebelum transaksi.", tags: ["Tips","Saving"] },
  { id: 4, icon: "✅", title: "Cek Eligibility dengan Aman", content: "Selalu cek hanya lewat official website. Jangan klik link dari DM. Gunakan wallet yang sama saat farming.", tags: ["Security","Beginner"] },
];

const DEF_P2P = [
  { id: 1, user: "crypto_whale", selling: "1.000 ARB", price: "0,95 USDT", min: "100 ARB", method: "Bank Transfer", verified: true },
  { id: 2, user: "defi_trader",  selling: "500 OP",    price: "2,10 USDT", min: "50 OP",   method: "DANA / GoPay",  verified: true },
  { id: 3, user: "web3_indo",    selling: "0,5 ETH",   price: "2.950 USDT",min: "0.1 ETH", method: "Semua Metode",  verified: true },
];

// ─── CONSTANTS ────────────────────────────────────────────────
const TAG_COLORS = {
  "Cross-chain": { text: "text-blue-300",    bg: "bg-blue-500/20",    ring: "ring-blue-500/30" },
  DeFi:          { text: "text-sky-300",     bg: "bg-sky-500/20",     ring: "ring-sky-500/30" },
  Layer2:        { text: "text-cyan-300",    bg: "bg-cyan-500/20",    ring: "ring-cyan-500/30" },
  Layer1:        { text: "text-blue-200",    bg: "bg-blue-600/20",    ring: "ring-blue-600/30" },
  ZK:            { text: "text-indigo-300",  bg: "bg-indigo-500/20",  ring: "ring-indigo-500/30" },
  Beginner:      { text: "text-green-300",   bg: "bg-green-500/20",   ring: "ring-green-500/30" },
  Advanced:      { text: "text-red-300",     bg: "bg-red-500/20",     ring: "ring-red-500/30" },
  Strategy:      { text: "text-blue-300",    bg: "bg-blue-500/20",    ring: "ring-blue-500/30" },
  Security:      { text: "text-yellow-300",  bg: "bg-yellow-500/20",  ring: "ring-yellow-500/30" },
  Tips:          { text: "text-teal-300",    bg: "bg-teal-500/20",    ring: "ring-teal-500/30" },
  Saving:        { text: "text-emerald-300", bg: "bg-emerald-500/20", ring: "ring-emerald-500/30" },
  NFT:           { text: "text-indigo-300",  bg: "bg-indigo-500/20",  ring: "ring-indigo-500/30" },
  GameFi:        { text: "text-pink-300",    bg: "bg-pink-500/20",    ring: "ring-pink-500/30" },
  Testnet:       { text: "text-amber-300",   bg: "bg-amber-500/20",   ring: "ring-amber-500/30" },
};
const DEF_TAG = { text: "text-blue-300", bg: "bg-blue-500/15", ring: "ring-blue-500/25" };

const STATUS_STYLE = {
  Active:      "bg-green-500/15 text-green-400 ring-green-500/25",
  Testnet:     "bg-yellow-500/15 text-yellow-400 ring-yellow-500/25",
  Distributed: "bg-gray-500/15 text-gray-400 ring-gray-500/25",
  Mainnet:     "bg-blue-500/15 text-blue-400 ring-blue-500/25",
  Upcoming:    "bg-blue-400/15 text-blue-300 ring-blue-400/25",
};

const QINFO_BOARDS = [
  { id: "tge",      label: "TGE",        icon: Zap,   accent: "text-amber-400", color: "from-amber-500/20 to-amber-900/10", ring: "ring-amber-500/25" },
  { id: "snapshot", label: "SNAPSHOT",   icon: Clock, accent: "text-blue-400",  color: "from-blue-500/20 to-blue-900/10",  ring: "ring-blue-500/25" },
  { id: "new",      label: "NEW AIRDROP",icon: Bell,  accent: "text-sky-400",   color: "from-sky-500/20 to-sky-900/10",    ring: "ring-sky-500/25" },
];

const STATUS_OPTIONS = ["Active", "Upcoming", "Testnet", "Mainnet", "Distributed"];
const QINFO_STATUS   = ["Soon","Confirmed","Active","Upcoming","New","Rumored"];
const DIFFICULTY_OPTIONS = ["Easy","Medium","Hard"];

// ─── MICRO COMPONENTS ─────────────────────────────────────────
function TagChip({ tag }) {
  const c = TAG_COLORS[tag] || DEF_TAG;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ring-1 ${c.text} ${c.bg} ${c.ring}`}>
      {tag}
    </span>
  );
}

function Favicon({ url, customImage, size = 24 }) {
  const src = customImage || `https://www.google.com/s2/favicons?domain=${url}&sz=64`;
  return (
    <img src={src} alt="" width={size} height={size}
      className="rounded-sm object-contain"
      onError={(e) => { e.currentTarget.style.display = "none"; }} />
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      {label && <p className="text-[11px] text-white/40 mb-1 font-medium">{label}</p>}
      <input {...props}
        className="w-full bg-white/[0.06] ring-1 ring-white/15 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:ring-blue-500/50 transition-all" />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      {label && <p className="text-[11px] text-white/40 mb-1 font-medium">{label}</p>}
      <select value={value} onChange={onChange}
        className="w-full bg-white/[0.06] ring-1 ring-white/15 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:ring-blue-500/50 transition-all appearance-none">
        {options.map(o => <option key={o} value={o} className="bg-gray-900">{o}</option>)}
      </select>
    </div>
  );
}

function Btn({ onClick, children, variant = "primary", className = "", type = "button" }) {
  const styles = {
    primary: "bg-blue-500 hover:bg-blue-400 text-white font-bold",
    ghost:   "bg-white/[0.06] ring-1 ring-white/15 text-white/70 hover:bg-white/10",
    danger:  "bg-red-500/15 ring-1 ring-red-500/30 text-red-400 hover:bg-red-500/25",
  };
  return (
    <button type={type} onClick={onClick}
      className={`px-4 py-2.5 rounded-xl text-sm transition-all active:scale-95 ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
}

// ─── ADMIN LOGIN MODAL ────────────────────────────────────────
function AdminLoginModal({ onClose, onSuccess }) {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    if (email.trim() === ADMIN_EMAIL && pin === ADMIN_PIN) {
      sessionStorage.setItem("dml_admin_ok", "1");
      onSuccess();
    } else {
      setErr("Email atau PIN salah.");
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-5">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-3xl bg-[#050510] ring-1 ring-blue-500/30 p-6 shadow-2xl shadow-blue-900/30">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-xl bg-blue-500/15 ring-1 ring-blue-500/30 flex items-center justify-center">
            <Shield className="w-4.5 h-4.5 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Admin Access</p>
            <p className="text-[10px] text-white/30">Masukkan kredensial admin</p>
          </div>
          <button onClick={onClose} className="ml-auto w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center hover:bg-white/10">
            <X className="w-3.5 h-3.5 text-white/50" />
          </button>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <Input label="Email Admin" type="email" placeholder="email@domain.com" value={email} onChange={e => setEmail(e.target.value)} required />
          <Input label="PIN" type="password" placeholder="••••" value={pin} onChange={e => setPin(e.target.value)} required />
          {err && <p className="text-xs text-red-400">{err}</p>}
          <Btn type="submit" className="w-full mt-1">Masuk sebagai Admin</Btn>
        </form>
      </div>
    </div>
  );
}

// ─── ADMIN PANEL ──────────────────────────────────────────────
function AdminPanel({ airdrops, ads, news, qinfo, onUpdate, onClose }) {
  const [tab, setTab] = useState("airdrop");

  return (
    <div className="fixed inset-0 z-[150] flex flex-col bg-[#02020f] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-blue-500/20 bg-[#02020f]">
        <div className="w-8 h-8 rounded-xl bg-blue-500/15 ring-1 ring-blue-500/30 flex items-center justify-center">
          <Settings className="w-4 h-4 text-blue-400" />
        </div>
        <span className="text-sm font-bold text-white flex-1">Panel Admin</span>
        <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/[0.05] ring-1 ring-white/10 flex items-center justify-center hover:bg-white/10">
          <X className="w-4 h-4 text-white/60" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-5 py-3 border-b border-white/[0.06] overflow-x-auto" style={{scrollbarWidth:"none"}}>
        {[
          { id: "airdrop", label: "🪂 Airdrop" },
          { id: "ads",     label: "📢 Iklan" },
          { id: "news",    label: "📰 Berita" },
          { id: "qinfo",   label: "⚡ Info Cepat" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-none px-4 py-2 rounded-xl text-xs font-semibold transition-all ${tab === t.id ? "bg-blue-500/20 ring-1 ring-blue-500/40 text-blue-300" : "text-white/40 hover:text-white/60"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {tab === "airdrop" && <AdminAirdropTab data={airdrops} onUpdate={d => onUpdate("airdrops", d)} />}
        {tab === "ads"     && <AdminAdsTab     data={ads}      onUpdate={d => onUpdate("ads", d)} />}
        {tab === "news"    && <AdminNewsTab     data={news}     onUpdate={d => onUpdate("news", d)} />}
        {tab === "qinfo"   && <AdminQinfoTab    data={qinfo}    onUpdate={d => onUpdate("qinfo", d)} />}
      </div>
    </div>
  );
}

// ─── ADMIN: AIRDROP TAB ───────────────────────────────────────
function AdminAirdropTab({ data, onUpdate }) {
  const blank = { icon:"", title:"", url:"", customImage:"", useCustomImg:false, tags:"", description:"", status:"Active", reward:"", difficulty:"Easy" };
  const [form, setForm] = useState(blank);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  function openAdd()       { setForm(blank); setEditId(null); setShowForm(true); }
  function openEdit(item)  { setForm({ ...item, tags: (item.tags||[]).join(", "), useCustomImg: !!item.customImage }); setEditId(item.id); setShowForm(true); }
  function cancel()        { setShowForm(false); setEditId(null); }

  function handleSave(e) {
    e.preventDefault();
    const item = {
      id: editId || Date.now(),
      icon: form.icon.trim(),
      title: form.title.trim(),
      url: form.url.trim().replace(/^https?:\/\//, ""),
      customImage: form.useCustomImg ? form.customImage.trim() : "",
      tags: form.tags.split(",").map(t=>t.trim()).filter(Boolean),
      description: form.description.trim(),
      status: form.status,
      reward: form.reward.trim(),
      difficulty: form.difficulty,
    };
    const updated = editId ? data.map(d => d.id === editId ? item : d) : [item, ...data];
    onUpdate(updated);
    cancel();
  }

  function del(id) { onUpdate(data.filter(d => d.id !== id)); }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-white/40">{data.length} airdrop</p>
        <Btn onClick={openAdd}><Plus className="w-3.5 h-3.5 inline mr-1" />Tambah</Btn>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="mb-4 p-4 rounded-2xl bg-white/[0.04] ring-1 ring-blue-500/20 flex flex-col gap-3">
          <p className="text-xs font-bold text-blue-400">{editId ? "Edit" : "Tambah"} Airdrop</p>
          <div className="flex gap-2">
            <Input label="Emoji Ikon" placeholder="🚀" value={form.icon} onChange={e=>setForm({...form,icon:e.target.value})} className="w-20 text-center" />
            <div className="flex-1"><Input label="Nama Airdrop *" placeholder="LayerZero" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required /></div>
          </div>
          <Input label="URL / Domain *" placeholder="layerzero.network" value={form.url} onChange={e=>setForm({...form,url:e.target.value})} required />

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.useCustomImg} onChange={e=>setForm({...form,useCustomImg:e.target.checked})}
                className="accent-blue-500 w-4 h-4" />
              <span className="text-[11px] text-white/50">Gunakan gambar custom (ganti auto favicon)</span>
            </label>
            {form.useCustomImg && (
              <div className="mt-2">
                <Input placeholder="https://link-gambar.com/logo.png" value={form.customImage} onChange={e=>setForm({...form,customImage:e.target.value})} />
              </div>
            )}
          </div>

          <Input label="Tags (pisah koma)" placeholder="DeFi, Layer2, ZK" value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})} />
          <div>
            <p className="text-[11px] text-white/40 mb-1 font-medium">Deskripsi</p>
            <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={2} placeholder="Penjelasan singkat cara farming..."
              className="w-full bg-white/[0.06] ring-1 ring-white/15 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:ring-blue-500/50 transition-all resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Select label="Status" value={form.status} onChange={e=>setForm({...form,status:e.target.value})} options={STATUS_OPTIONS} />
            <Select label="Kesulitan" value={form.difficulty} onChange={e=>setForm({...form,difficulty:e.target.value})} options={DIFFICULTY_OPTIONS} />
          </div>
          <Input label="Token Reward" placeholder="ZRO Token" value={form.reward} onChange={e=>setForm({...form,reward:e.target.value})} />
          <div className="flex gap-2 mt-1">
            <Btn type="submit" className="flex-1">Simpan</Btn>
            <Btn variant="ghost" onClick={cancel}>Batal</Btn>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-2">
        {data.map(item => (
          <div key={item.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.04] ring-1 ring-white/10">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {item.icon ? <span className="text-lg">{item.icon}</span> : <Favicon url={item.url} customImage={item.customImage} size={22} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{item.title}</p>
              <p className="text-[10px] text-white/30 font-mono truncate">{item.url}</p>
            </div>
            <div className="flex gap-1.5 flex-shrink-0">
              <button onClick={()=>openEdit(item)} className="w-7 h-7 rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20 flex items-center justify-center hover:bg-blue-500/20 text-blue-400 text-xs">✏</button>
              <button onClick={()=>del(item.id)} className="w-7 h-7 rounded-lg bg-red-500/10 ring-1 ring-red-500/20 flex items-center justify-center hover:bg-red-500/20"><Trash2 className="w-3 h-3 text-red-400" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ADMIN: ADS TAB ───────────────────────────────────────────
function AdminAdsTab({ data, onUpdate }) {
  const blank = { title:"", subtitle:"", imageUrl:"", buttonText:"BUKA", targetUrl:"", active:true };
  const [form, setForm] = useState(blank);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  function openAdd()      { setForm(blank); setEditId(null); setShowForm(true); }
  function openEdit(item) { setForm(item); setEditId(item.id); setShowForm(true); }
  function cancel()       { setShowForm(false); setEditId(null); }

  function handleSave(e) {
    e.preventDefault();
    const item = { ...form, id: editId || Date.now() };
    const updated = editId ? data.map(d => d.id === editId ? item : d) : [item, ...data];
    onUpdate(updated); cancel();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-white/40">{data.length} iklan</p>
        <Btn onClick={openAdd}><Plus className="w-3.5 h-3.5 inline mr-1" />Tambah</Btn>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="mb-4 p-4 rounded-2xl bg-white/[0.04] ring-1 ring-blue-500/20 flex flex-col gap-3">
          <p className="text-xs font-bold text-blue-400">{editId ? "Edit" : "Tambah"} Iklan</p>
          <Input label="Judul Banner *" placeholder="Iklan Terbaru" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required />
          <Input label="Subjudul" placeholder="Teks kecil di bawah judul" value={form.subtitle} onChange={e=>setForm({...form,subtitle:e.target.value})} />
          <Input label="URL Gambar Banner (opsional)" placeholder="https://i.imgur.com/example.jpg" value={form.imageUrl} onChange={e=>setForm({...form,imageUrl:e.target.value})} />
          <Input label="Label Tombol" placeholder="BUKA, KUNJUNGI, DAFTAR..." value={form.buttonText} onChange={e=>setForm({...form,buttonText:e.target.value})} />
          <Input label="URL Target *" placeholder="https://website-iklan.com" value={form.targetUrl} onChange={e=>setForm({...form,targetUrl:e.target.value})} required />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={e=>setForm({...form,active:e.target.checked})} className="accent-blue-500 w-4 h-4" />
            <span className="text-[11px] text-white/50">Tampilkan iklan ini</span>
          </label>
          <div className="flex gap-2 mt-1"><Btn type="submit" className="flex-1">Simpan</Btn><Btn variant="ghost" onClick={cancel}>Batal</Btn></div>
        </form>
      )}

      <div className="flex flex-col gap-2">
        {data.map(item => (
          <div key={item.id} className="p-3 rounded-2xl bg-white/[0.04] ring-1 ring-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="text-[10px] text-white/30">{item.buttonText} → (URL tersembunyi)</p>
              </div>
              <div className="flex gap-1.5">
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${item.active ? "bg-green-500/15 text-green-400" : "bg-gray-500/15 text-gray-400"}`}>{item.active ? "Aktif" : "Nonaktif"}</span>
                <button onClick={()=>openEdit(item)} className="w-7 h-7 rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20 flex items-center justify-center text-blue-400 text-xs">✏</button>
                <button onClick={()=>onUpdate(data.filter(d=>d.id!==item.id))} className="w-7 h-7 rounded-lg bg-red-500/10 ring-1 ring-red-500/20 flex items-center justify-center"><Trash2 className="w-3 h-3 text-red-400" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ADMIN: NEWS TAB ──────────────────────────────────────────
const NEWS_COLORS = [
  { label: "Biru Tua",  value: "from-blue-700/40 to-blue-900/20" },
  { label: "Biru",      value: "from-blue-600/35 to-blue-800/20" },
  { label: "Biru Muda", value: "from-blue-500/30 to-blue-900/20" },
  { label: "Navy",      value: "from-blue-800/40 to-blue-900/20" },
  { label: "Cyan",      value: "from-cyan-600/35 to-cyan-900/20" },
];

function AdminNewsTab({ data, onUpdate }) {
  const blank = { title:"", category:"Market", time:"Baru saja", color: NEWS_COLORS[0].value, buttonText:"BACA SELENGKAPNYA", targetUrl:"" };
  const [form, setForm] = useState(blank);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  function openAdd()      { setForm(blank); setEditId(null); setShowForm(true); }
  function openEdit(item) { setForm(item); setEditId(item.id); setShowForm(true); }
  function cancel()       { setShowForm(false); setEditId(null); }

  function handleSave(e) {
    e.preventDefault();
    const item = { ...form, id: editId || Date.now() };
    onUpdate(editId ? data.map(d => d.id === editId ? item : d) : [item, ...data]);
    cancel();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-white/40">{data.length} berita</p>
        <Btn onClick={openAdd}><Plus className="w-3.5 h-3.5 inline mr-1" />Tambah</Btn>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="mb-4 p-4 rounded-2xl bg-white/[0.04] ring-1 ring-blue-500/20 flex flex-col gap-3">
          <p className="text-xs font-bold text-blue-400">{editId ? "Edit" : "Tambah"} Berita</p>
          <Input label="Judul Berita *" placeholder="Headline berita..." value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required />
          <Input label="Kategori" placeholder="Market, Airdrop, Layer2..." value={form.category} onChange={e=>setForm({...form,category:e.target.value})} />
          <Input label="Waktu" placeholder="2j lalu, 1h lalu..." value={form.time} onChange={e=>setForm({...form,time:e.target.value})} />
          <div>
            <p className="text-[11px] text-white/40 mb-1 font-medium">Warna Card</p>
            <select value={form.color} onChange={e=>setForm({...form,color:e.target.value})}
              className="w-full bg-white/[0.06] ring-1 ring-white/15 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:ring-blue-500/50 appearance-none">
              {NEWS_COLORS.map(c => <option key={c.value} value={c.value} className="bg-gray-900">{c.label}</option>)}
            </select>
          </div>
          <Input label="Label Tombol" placeholder="BACA SELENGKAPNYA" value={form.buttonText} onChange={e=>setForm({...form,buttonText:e.target.value})} />
          <Input label="URL Target *" placeholder="https://link-berita.com" value={form.targetUrl} onChange={e=>setForm({...form,targetUrl:e.target.value})} required />
          <div className="flex gap-2 mt-1"><Btn type="submit" className="flex-1">Simpan</Btn><Btn variant="ghost" onClick={cancel}>Batal</Btn></div>
        </form>
      )}

      <div className="flex flex-col gap-2">
        {data.map(item => (
          <div key={item.id} className={`p-3 rounded-2xl bg-gradient-to-r ${item.color} ring-1 ring-white/10`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-[11px] text-white/50 mb-0.5">{item.category} · {item.time}</p>
                <p className="text-sm font-semibold text-white line-clamp-2">{item.title}</p>
                <p className="text-[10px] text-white/30 mt-1">Tombol: "{item.buttonText}"</p>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={()=>openEdit(item)} className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white/50 text-xs">✏</button>
                <button onClick={()=>onUpdate(data.filter(d=>d.id!==item.id))} className="w-7 h-7 rounded-lg bg-red-500/10 ring-1 ring-red-500/20 flex items-center justify-center"><Trash2 className="w-3 h-3 text-red-400" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ADMIN: QUICK INFO TAB ────────────────────────────────────
function AdminQinfoTab({ data, onUpdate }) {
  const blank = { board:"tge", name:"", date:"", status:"Soon", targetUrl:"" };
  const [form, setForm] = useState(blank);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  function openAdd()      { setForm(blank); setEditId(null); setShowForm(true); }
  function openEdit(item) { setForm(item); setEditId(item.id); setShowForm(true); }
  function cancel()       { setShowForm(false); setEditId(null); }

  function handleSave(e) {
    e.preventDefault();
    const item = { ...form, id: editId || Date.now() };
    onUpdate(editId ? data.map(d => d.id === editId ? item : d) : [item, ...data]);
    cancel();
  }

  const boardLabels = { tge: "TGE", snapshot: "SNAPSHOT", new: "NEW AIRDROP" };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-white/40">{data.length} item</p>
        <Btn onClick={openAdd}><Plus className="w-3.5 h-3.5 inline mr-1" />Tambah</Btn>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="mb-4 p-4 rounded-2xl bg-white/[0.04] ring-1 ring-blue-500/20 flex flex-col gap-3">
          <p className="text-xs font-bold text-blue-400">{editId ? "Edit" : "Tambah"} Info Cepat</p>
          <Select label="Papan" value={form.board} onChange={e=>setForm({...form,board:e.target.value})} options={["tge","snapshot","new"]} />
          <Input label="Nama Proyek *" placeholder="Monad (MONAD)" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
          <Input label="Tanggal / Periode" placeholder="Q3 2025, 15 Mei, dll" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} />
          <Select label="Status" value={form.status} onChange={e=>setForm({...form,status:e.target.value})} options={QINFO_STATUS} />
          <Input label="URL Target (opsional)" placeholder="https://website-proyek.com" value={form.targetUrl} onChange={e=>setForm({...form,targetUrl:e.target.value})} />
          <div className="flex gap-2 mt-1"><Btn type="submit" className="flex-1">Simpan</Btn><Btn variant="ghost" onClick={cancel}>Batal</Btn></div>
        </form>
      )}

      <div className="flex flex-col gap-2">
        {QINFO_BOARDS.map(board => {
          const items = data.filter(d => d.board === board.id);
          if (items.length === 0) return null;
          return (
            <div key={board.id}>
              <p className={`text-[10px] font-bold mb-1.5 ${board.accent}`}>{board.label}</p>
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-2 p-2.5 mb-1.5 rounded-xl bg-white/[0.04] ring-1 ring-white/10">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-white">{item.name}</p>
                    <p className="text-[10px] text-white/30">{item.date} · {item.status}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={()=>openEdit(item)} className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 text-[10px]">✏</button>
                    <button onClick={()=>onUpdate(data.filter(d=>d.id!==item.id))} className="w-6 h-6 rounded-lg bg-red-500/10 flex items-center justify-center"><Trash2 className="w-3 h-3 text-red-400" /></button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── HOME SCREEN ──────────────────────────────────────────────
function HomeScreen({ ads, news, qinfo }) {
  const activeAd = ads.find(a => a.active) || ads[0];

  return (
    <div className="pb-32">
      {/* Hero */}
      <div className="px-5 pt-6 mb-6">
        <span className="text-[10px] font-bold text-blue-400 tracking-widest uppercase">Web3 Channel</span>
        <h1 className="text-2xl font-bold text-white leading-tight mt-1">
          Airdrop & DeFi<br />
          <span className="text-blue-500/60">Info Hub</span>
        </h1>
        <p className="text-xs text-white/30 mt-2">Info airdrop, berita, dan tips Web3 terkurasi</p>
      </div>

      {/* Ad Banner 16:9 */}
      {activeAd && (
        <div className="px-5 mb-6">
          <div className="w-full aspect-video rounded-2xl overflow-hidden ring-1 ring-blue-500/20 relative bg-gradient-to-br from-blue-900/60 via-blue-950/40 to-black flex flex-col items-center justify-center gap-3">
            {activeAd.imageUrl ? (
              <img src={activeAd.imageUrl} alt={activeAd.title} className="absolute inset-0 w-full h-full object-cover opacity-60" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/15 to-blue-900/10" />
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center relative z-10">
              <p className="text-[10px] text-blue-400/60 uppercase tracking-widest">Iklan</p>
              <p className="text-base font-bold text-white">{activeAd.title}</p>
              {activeAd.subtitle && <p className="text-xs text-white/40">{activeAd.subtitle}</p>}
              {activeAd.buttonText && activeAd.targetUrl && (
                <button
                  onClick={() => window.open(activeAd.targetUrl, "_blank")}
                  className="mt-1 px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold active:scale-95 transition-all">
                  {activeAd.buttonText}
                </button>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          </div>
        </div>
      )}

      {/* News */}
      <div className="mb-6">
        <div className="flex items-center justify-between px-5 mb-3">
          <h2 className="text-sm font-bold text-white">📰 Berita Terkini</h2>
          <span className="text-[10px] text-blue-400/60">Geser →</span>
        </div>
        <div className="flex gap-3 pl-5 pr-5 pb-1 overflow-x-auto snap-x snap-mandatory" style={{scrollbarWidth:"none"}}>
          {news.map(item => (
            <div key={item.id}
              className={`snap-start flex-none w-36 aspect-square rounded-2xl p-3 bg-gradient-to-br ${item.color} ring-1 ring-blue-500/15 flex flex-col justify-between cursor-pointer hover:ring-blue-400/30 transition-all active:scale-95`}>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 w-fit">{item.category}</span>
              <div>
                <p className="text-[11px] font-semibold text-white leading-snug line-clamp-3 mb-1.5">{item.title}</p>
                {item.buttonText && item.targetUrl && (
                  <button onClick={() => window.open(item.targetUrl, "_blank")}
                    className="text-[9px] font-bold text-blue-400 bg-blue-500/15 px-2 py-0.5 rounded-full hover:bg-blue-500/25 transition-all">
                    {item.buttonText}
                  </button>
                )}
                <p className="text-[9px] text-white/30 mt-1">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Info: 3 boards 16:9 */}
      <div className="mb-6">
        <div className="flex items-center justify-between px-5 mb-3">
          <h2 className="text-sm font-bold text-white">⚡ Info Cepat</h2>
          <span className="text-[10px] text-blue-400/60">3 papan →</span>
        </div>
        <div className="flex gap-3 pl-5 pr-5 pb-1 overflow-x-auto snap-x snap-mandatory" style={{scrollbarWidth:"none"}}>
          {QINFO_BOARDS.map(board => {
            const Icon = board.icon;
            const items = qinfo.filter(q => q.board === board.id).slice(0, 4);
            return (
              <div key={board.id}
                className={`snap-start flex-none w-[78vw] max-w-sm aspect-video rounded-2xl p-4 bg-gradient-to-br ${board.color} ring-1 ${board.ring} flex flex-col justify-between`}>
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-1.5 ${board.accent}`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold tracking-wider">{board.label}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  {items.map(item => (
                    <div key={item.id}
                      className={`flex items-center justify-between ${item.targetUrl ? "cursor-pointer hover:opacity-80" : ""}`}
                      onClick={() => item.targetUrl && window.open(item.targetUrl, "_blank")}>
                      <span className="text-[11px] text-white/80 font-medium truncate mr-2">{item.name}</span>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-[9px] text-white/30">{item.date}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          item.status==="New"       ? "bg-blue-500/30 text-blue-300" :
                          item.status==="Active"    ? "bg-green-500/30 text-green-300" :
                          item.status==="Confirmed" ? "bg-blue-400/30 text-blue-200" :
                          item.status==="Rumored"   ? "bg-gray-500/30 text-gray-300" :
                                                      "bg-amber-500/30 text-amber-300"
                        }`}>{item.status}</span>
                        {item.targetUrl && <ExternalLink className="w-2.5 h-2.5 text-white/20" />}
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

// ─── AIRDROP SCREEN ───────────────────────────────────────────
function AirdropScreen({ airdrops }) {
  const [search, setSearch]     = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId]   = useState(null);

  const allTags = useMemo(() => {
    const t = new Set();
    airdrops.forEach(a => (a.tags||[]).forEach(tag => t.add(tag)));
    return ["All", ...Array.from(t)];
  }, [airdrops]);

  const filtered = useMemo(() => airdrops.filter(item => {
    const matchTag = activeTag === "All" || (item.tags||[]).includes(activeTag);
    const q = search.toLowerCase();
    const matchSearch = !q || item.title.toLowerCase().includes(q) || (item.description||"").toLowerCase().includes(q);
    return matchTag && matchSearch;
  }), [search, activeTag, airdrops]);

  function copyUrl(item) {
    navigator.clipboard.writeText(`https://${item.url}`).catch(()=>{});
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="pb-32">
      <div className="px-5 pt-6 mb-5">
        <h1 className="text-lg font-bold text-white">🪂 Airdrop List</h1>
        <p className="text-xs text-white/30 mt-0.5">{airdrops.length} proyek terdaftar</p>
      </div>

      <div className="px-5">
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400/50 pointer-events-none" />
          <input type="search" placeholder="Cari airdrop..." value={search} onChange={e=>setSearch(e.target.value)}
            className="w-full bg-blue-500/[0.08] ring-1 ring-blue-500/25 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:ring-blue-400/50 transition-all" />
        </div>

        {/* Filter */}
        <div className="mb-4">
          <button onClick={()=>setFilterOpen(!filterOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ring-1 transition-all ${activeTag!=="All" ? "bg-blue-500/20 ring-blue-400/40 text-blue-300" : "bg-blue-500/[0.08] ring-blue-500/20 text-white/60"}`}>
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {activeTag !== "All" ? `Filter: ${activeTag}` : "Filter Tag"}
            {filterOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {filterOpen && (
            <div className="mt-3 bg-blue-500/[0.06] ring-1 ring-blue-500/20 rounded-2xl p-3 flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button key={tag} onClick={()=>{setActiveTag(tag);setFilterOpen(false);}}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold ring-1 transition-all ${activeTag===tag ? "bg-blue-500/25 ring-blue-400/50 text-blue-300" : "bg-white/[0.04] ring-white/10 text-white/50 hover:bg-blue-500/10 hover:text-blue-300"}`}>
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="text-[11px] text-white/25 mb-3">{filtered.length} hasil{activeTag!=="All" && <> untuk <span className="text-blue-400">{activeTag}</span></>}</p>

        {/* Cards */}
        <div className="flex flex-col gap-3">
          {filtered.map(item => {
            const expanded = expandedId === item.id;
            return (
              <div key={item.id} className={`rounded-2xl ring-1 transition-all duration-300 ${expanded ? "bg-blue-500/[0.08] ring-blue-400/25" : "bg-white/[0.04] ring-white/10 hover:ring-blue-500/20"}`}>
                <div className="flex items-center gap-3 p-4 cursor-pointer select-none" onClick={()=>setExpandedId(expanded?null:item.id)}>
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-500/10 ring-1 ring-blue-500/20 flex items-center justify-center overflow-hidden">
                    {item.icon ? <span className="text-lg">{item.icon}</span> : <Favicon url={item.url} customImage={item.customImage} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-white">{item.title}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ring-1 ${STATUS_STYLE[item.status]||STATUS_STYLE.Active}`}>{item.status}</span>
                    </div>
                    <p className="text-[11px] text-blue-400/40 font-mono mt-0.5 truncate">{item.url}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-blue-400/40 flex-shrink-0 transition-transform duration-300 ${expanded?"rotate-180":""}`} />
                </div>

                {expanded && (
                  <div className="px-4 pb-4 pt-3 border-t border-blue-500/[0.12]">
                    {item.description && <p className="text-xs text-white/50 leading-relaxed mb-3">{item.description}</p>}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(item.tags||[]).map(tag => <TagChip key={tag} tag={tag} />)}
                      {item.reward && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ring-1 text-blue-300 bg-blue-500/15 ring-blue-500/25">{item.reward}</span>}
                      {item.difficulty && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ring-1 ${item.difficulty==="Easy"?"bg-green-500/15 text-green-400 ring-green-500/25":item.difficulty==="Hard"?"bg-red-500/15 text-red-400 ring-red-500/25":"bg-yellow-500/15 text-yellow-400 ring-yellow-500/25"}`}>
                          {item.difficulty}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={()=>window.open(`https://${item.url}`,"_blank")}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold active:scale-95 transition-all">
                        <ExternalLink className="w-3.5 h-3.5" /> Buka Website
                      </button>
                      <button onClick={()=>copyUrl(item)} title="Salin URL"
                        className="w-11 h-11 rounded-xl bg-blue-500/10 ring-1 ring-blue-500/20 flex items-center justify-center hover:bg-blue-500/20 transition-all">
                        {copiedId===item.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-blue-400/60" />}
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

// ─── DISCOVER SCREEN ──────────────────────────────────────────
function DiscoverScreen() {
  const [section, setSection] = useState("p2p");
  return (
    <div className="pb-32">
      <div className="px-5 pt-6 mb-5">
        <h1 className="text-lg font-bold text-white">🧭 Discover</h1>
        <p className="text-xs text-white/30 mt-0.5">P2P, Kalender, dan Tips Web3</p>
      </div>

      <div className="flex gap-2 px-5 mb-5 overflow-x-auto" style={{scrollbarWidth:"none"}}>
        {[
          { id:"p2p",      label:"P2P Seller",      icon: Users },
          { id:"calendar", label:"Airdrop Calendar", icon: Calendar },
          { id:"tips",     label:"Tips & Trik",      icon: Lightbulb },
        ].map(({id,label,icon:Icon}) => (
          <button key={id} onClick={()=>setSection(id)}
            className={`flex-none flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold ring-1 transition-all ${section===id ? "bg-blue-500 text-white ring-blue-500" : "bg-blue-500/[0.08] ring-blue-500/20 text-white/50 hover:bg-blue-500/15 hover:text-blue-300"}`}>
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>

      {section === "p2p" && (
        <div className="px-5 flex flex-col gap-3">
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20">
            <span className="text-base leading-none mt-0.5">⚠️</span>
            <p className="text-[11px] text-amber-300/80 leading-relaxed">Lakukan transaksi dengan hati-hati. Platform tidak bertanggung jawab atas risiko P2P deal.</p>
          </div>
          {DEF_P2P.map(l => (
            <div key={l.id} className="rounded-2xl bg-blue-500/[0.05] ring-1 ring-blue-500/15 p-4">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/15 ring-1 ring-blue-500/20 flex items-center justify-center text-sm">👤</div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-white">{l.user}</span>
                    {l.verified && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30">✓ Verified</span>}
                  </div>
                  <span className="text-[10px] text-white/30">{l.method}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-blue-500/[0.10]">
                <div><p className="text-sm font-bold text-white">{l.selling}</p><p className="text-[10px] text-white/30 mt-0.5">Min: {l.min}</p></div>
                <div className="text-right"><p className="text-sm font-bold text-blue-400">{l.price}</p><p className="text-[10px] text-white/30">per token</p></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {section === "calendar" && (
        <div className="px-5 flex flex-col gap-3">
          {DEF_CALENDAR.map(e => (
            <div key={e.id} className="rounded-2xl bg-blue-500/[0.05] ring-1 ring-blue-500/15 p-4 flex items-center gap-4">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-blue-500/15 ring-1 ring-blue-500/20 flex flex-col items-center justify-center">
                <span className="text-[9px] text-blue-400/60 uppercase font-bold">{e.date.split(" ")[0]}</span>
                <span className="text-xl font-bold text-white leading-none">{e.date.split(" ")[1]}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{e.title}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full mt-1.5 inline-block font-semibold ${e.color}`}>{e.type}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {section === "tips" && (
        <div className="px-5 flex flex-col gap-3">
          {DEF_TIPS.map(tip => (
            <div key={tip.id} className="rounded-2xl bg-blue-500/[0.05] ring-1 ring-blue-500/15 p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl leading-none">{tip.icon}</span>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white mb-1.5">{tip.title}</h3>
                  <p className="text-xs text-white/50 leading-relaxed">{tip.content}</p>
                  <div className="flex gap-1.5 mt-2.5 flex-wrap">{tip.tags.map(tag=><TagChip key={tag} tag={tag}/>)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── BOTTOM NAV ───────────────────────────────────────────────
function BottomNav({ active, onSelect }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6">
      <div className="flex items-center gap-1 px-3 py-2 rounded-full bg-black/80 backdrop-blur-2xl ring-1 ring-blue-500/20 shadow-2xl shadow-blue-900/30">
        {[
          { id:"home",     label:"Home",    icon: Home },
          { id:"airdrops", label:"Airdrop", icon: LayoutGrid },
          { id:"discover", label:"Discover",icon: Compass },
        ].map(({id,label,icon:Icon}) => (
          <button key={id} onClick={()=>onSelect(id)}
            className={`flex flex-col items-center gap-0.5 px-6 py-2 rounded-full transition-all duration-200 ${active===id ? "bg-blue-500/20 text-blue-400" : "text-white/30 hover:text-white/50"}`}>
            <Icon className="w-5 h-5" />
            <span className="text-[9px] font-bold">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────
export default function App() {
  const [tab, setTab]             = useState("home");
  const [airdrops, setAirdrops]   = useState(() => load(K.airdrops, DEF_AIRDROPS));
  const [ads, setAds]             = useState(() => load(K.ads, DEF_ADS));
  const [news, setNews]           = useState(() => load(K.news, DEF_NEWS));
  const [qinfo, setQinfo]         = useState(() => load(K.qinfo, DEF_QINFO));
  const [isAdmin, setIsAdmin]     = useState(() => sessionStorage.getItem("dml_admin_ok") === "1");
  const [showLogin, setShowLogin] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  // 5-tap logo trick for admin access
  const tapCount = useRef(0);
  const tapTimer = useRef(null);
  function handleLogoTap() {
    tapCount.current += 1;
    clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 2000);
    if (tapCount.current >= 5) {
      tapCount.current = 0;
      if (isAdmin) setShowPanel(true);
      else setShowLogin(true);
    }
  }

  function handleAdminSuccess() {
    setIsAdmin(true);
    setShowLogin(false);
    setShowPanel(true);
  }

  function handleAdminUpdate(type, data) {
    if (type === "airdrops") { setAirdrops(data); save(K.airdrops, data); }
    if (type === "ads")      { setAds(data);      save(K.ads, data); }
    if (type === "news")     { setNews(data);      save(K.news, data); }
    if (type === "qinfo")    { setQinfo(data);     save(K.qinfo, data); }
  }

  function handleLogout() {
    sessionStorage.removeItem("dml_admin_ok");
    setIsAdmin(false);
    setShowPanel(false);
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      {/* Blue vertical beam (from logo) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-full bg-gradient-to-b from-blue-500/12 via-blue-500/4 to-transparent" />
        <div className="absolute -top-32 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="absolute top-1/2 -right-40 w-[350px] h-[350px] rounded-full bg-blue-700/10 blur-[120px]" />
        <div className="absolute -bottom-20 left-1/3 w-[300px] h-[300px] rounded-full bg-blue-500/8 blur-[120px]" />
      </div>

      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-black/85 backdrop-blur-xl border-b border-blue-500/[0.12]">
        <div className="max-w-lg mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer select-none" onClick={handleLogoTap}>
            <img src="/logo.jpg" alt="logo" className="w-7 h-7 rounded-lg object-cover ring-1 ring-blue-500/30" />
            <span className="text-sm font-bold text-white">DROP<span className="text-blue-500/60">MYLINK</span></span>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button onClick={()=>setShowPanel(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/15 ring-1 ring-blue-500/30 hover:bg-blue-500/25 transition-all">
                <Settings className="w-3 h-3 text-blue-400" />
                <span className="text-[10px] text-blue-400 font-bold">ADMIN</span>
              </button>
            )}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 ring-1 ring-green-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] text-green-400 font-bold">Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="relative z-10 max-w-lg mx-auto">
        {tab === "home"     && <HomeScreen ads={ads} news={news} qinfo={qinfo} />}
        {tab === "airdrops" && <AirdropScreen airdrops={airdrops} />}
        {tab === "discover" && <DiscoverScreen />}
      </div>

      <BottomNav active={tab} onSelect={setTab} />

      {/* Admin Login */}
      {showLogin && <AdminLoginModal onClose={()=>setShowLogin(false)} onSuccess={handleAdminSuccess} />}

      {/* Admin Panel */}
      {showPanel && (
        <AdminPanel
          airdrops={airdrops} ads={ads} news={news} qinfo={qinfo}
          onUpdate={handleAdminUpdate}
          onClose={()=>setShowPanel(false)}
        />
      )}

      {/* Logout (when admin panel closed) */}
      {isAdmin && !showPanel && (
        <div className="fixed bottom-24 right-4 z-50">
          <button onClick={handleLogout}
            className="text-[9px] text-blue-500/40 hover:text-blue-400 transition-colors px-2 py-1">
            logout admin
          </button>
        </div>
      )}
    </div>
  );
}
