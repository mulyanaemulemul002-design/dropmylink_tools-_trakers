import { useState, useMemo, useEffect } from "react";
import {
  Sparkles,
  Search,
  SlidersHorizontal,
  ExternalLink,
  Bookmark,
  Share2,
  Home,
  Plus,
  X,
  ChevronDown,
  Link2,
} from "lucide-react";

const STORAGE_KEY = "dropmylink_airdrops";

const TAG_COLORS = {
  AI: { text: "text-violet-300", bg: "bg-violet-500/20", ring: "ring-violet-500/30" },
  DeFi: { text: "text-sky-300", bg: "bg-sky-500/20", ring: "ring-sky-500/30" },
  Layer2: { text: "text-emerald-300", bg: "bg-emerald-500/20", ring: "ring-emerald-500/30" },
  DEX: { text: "text-amber-300", bg: "bg-amber-500/20", ring: "ring-amber-500/30" },
  DAO: { text: "text-rose-300", bg: "bg-rose-500/20", ring: "ring-rose-500/30" },
  Governance: { text: "text-orange-300", bg: "bg-orange-500/20", ring: "ring-orange-500/30" },
  ZK: { text: "text-fuchsia-300", bg: "bg-fuchsia-500/20", ring: "ring-fuchsia-500/30" },
  Layer1: { text: "text-cyan-300", bg: "bg-cyan-500/20", ring: "ring-cyan-500/30" },
  IoT: { text: "text-teal-300", bg: "bg-teal-500/20", ring: "ring-teal-500/30" },
  GameFi: { text: "text-pink-300", bg: "bg-pink-500/20", ring: "ring-pink-500/30" },
  NFT: { text: "text-indigo-300", bg: "bg-indigo-500/20", ring: "ring-indigo-500/30" },
  "Play2Earn": { text: "text-lime-300", bg: "bg-lime-500/20", ring: "ring-lime-500/30" },
};

const DEFAULT_TAG_COLOR = { text: "text-violet-300", bg: "bg-violet-500/20", ring: "ring-violet-500/30" };

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

function TagChip({ tag }) {
  const color = TAG_COLORS[tag] || DEFAULT_TAG_COLOR;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ring-1 ${color.text} ${color.bg} ${color.ring}`}
    >
      {tag}
    </span>
  );
}

function AirdropCard({ item, onDelete, onAskAI }) {
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className="relative rounded-2xl bg-white/[0.06] ring-1 ring-white/15 p-4 transition-all duration-200 hover:bg-white/10 hover:ring-white/25">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-white/10 ring-1 ring-white/20 flex items-center justify-center text-2xl">
          {item.icon || "🔗"}
        </div>

        <div className="flex-1 min-w-0 pr-16">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-sm font-semibold text-white leading-tight">{item.title}</h3>
            <ExternalLink className="w-3 h-3 text-white/30 flex-shrink-0" />
          </div>
          <p className="text-[11px] text-white/30 mt-0.5 font-mono">{item.url}</p>
        </div>
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-1.5">
        <button
          onClick={() => onAskAI(item.title, item.url)}
          className="w-7 h-7 rounded-lg bg-violet-500/10 ring-1 ring-violet-500/25 flex items-center justify-center transition-colors hover:bg-violet-500/20"
          title="Ask AI"
        >
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
        </button>
        <button
          onClick={() => setBookmarked(!bookmarked)}
          className="w-7 h-7 rounded-lg bg-white/[0.04] ring-1 ring-white/10 flex items-center justify-center transition-colors hover:bg-white/[0.08]"
        >
          <Bookmark
            className={`w-3.5 h-3.5 transition-colors ${bookmarked ? "text-blue-400 fill-blue-400" : "text-white/40"}`}
          />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="w-7 h-7 rounded-lg bg-white/[0.04] ring-1 ring-white/10 flex items-center justify-center transition-colors hover:bg-red-500/20 hover:ring-red-500/30"
        >
          <X className="w-3.5 h-3.5 text-white/40 hover:text-red-400" />
        </button>
      </div>

      {item.description && (
        <p className="text-[13px] text-white/50 leading-relaxed mt-3">{item.description}</p>
      )}

      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {item.tags.slice(0, 3).map((tag) => (
            <TagChip key={tag} tag={tag} />
          ))}
        </div>
      )}
    </div>
  );
}

function AddLinkModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ icon: "", title: "", url: "", description: "", tags: "" });

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim()) return;
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onAdd({
      id: Date.now(),
      icon: form.icon.trim() || "🔗",
      title: form.title.trim(),
      url: form.url.trim().replace(/^https?:\/\//, ""),
      description: form.description.trim(),
      tags,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl bg-[#0a0a0a] ring-1 ring-white/10 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white">Tambah Link Baru</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/[0.05] ring-1 ring-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              placeholder="Emoji ikon (e.g. 🚀)"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="w-24 bg-white/[0.04] ring-1 ring-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:ring-white/20 transition-all text-center"
            />
            <input
              required
              placeholder="Judul airdrop *"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="flex-1 bg-white/[0.04] ring-1 ring-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:ring-white/20 transition-all"
            />
          </div>

          <input
            required
            placeholder="URL (e.g. project.xyz) *"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            className="w-full bg-white/[0.04] ring-1 ring-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:ring-white/20 transition-all font-mono"
          />

          <textarea
            placeholder="Deskripsi (opsional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full bg-white/[0.04] ring-1 ring-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:ring-white/20 transition-all resize-none"
          />

          <input
            placeholder="Tags, pisahkan koma (e.g. AI, DeFi, NFT)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="w-full bg-white/[0.04] ring-1 ring-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:ring-white/20 transition-all"
          />

          <button
            type="submit"
            className="w-full mt-1 py-3 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 active:scale-[0.98] transition-all"
          >
            Simpan Link
          </button>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  const [airdrops, setAirdrops] = useState(() => loadFromStorage());
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeTag, setActiveTag] = useState("All");
  const [activeNav, setActiveNav] = useState("home");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    saveToStorage(airdrops);
  }, [airdrops]);

  function handleAdd(item) {
    setAirdrops((prev) => [item, ...prev]);
  }

  function handleDelete(id) {
    setAirdrops((prev) => prev.filter((a) => a.id !== id));
  }

  function handleAskGemini(name, url) {
    const text = `Cari info airdrop terbaru untuk project: ${name} di ${url}`;
    navigator.clipboard.writeText(text).catch(() => {});
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      window.open("https://gemini.google.com/app", "_blank");
    }, 1000);
  }

  const allTags = useMemo(() => {
    const tags = new Set();
    airdrops.forEach((a) => (a.tags || []).forEach((t) => tags.add(t)));
    return ["All", ...Array.from(tags)];
  }, [airdrops]);

  const filtered = useMemo(() => {
    return airdrops.filter((item) => {
      const matchTag = activeTag === "All" || (item.tags || []).includes(activeTag);
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        (item.description || "").toLowerCase().includes(q) ||
        (item.tags || []).some((t) => t.toLowerCase().includes(q));
      return matchTag && matchSearch;
    });
  }, [activeTag, search, airdrops]);

  const filterLabel = activeTag !== "All" ? `Filter • ${activeTag}` : "Filter";

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute -bottom-20 left-1/4 w-[350px] h-[350px] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-5 pb-36 pt-6">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 ring-1 ring-white/20 flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-blue-400" />
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-base font-bold tracking-tight text-white">DROP</span>
              <span className="text-base font-bold tracking-tight text-white/50">MYLINK</span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 ring-1 ring-white/20">
            <Link2 className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-bold text-white">{airdrops.length}</span>
            <span className="text-xs text-white/50">
              {airdrops.length === 1 ? "link" : "links"} tersimpan
            </span>
          </div>
        </header>

        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          <input
            type="search"
            placeholder="Search airdrops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/10 ring-1 ring-white/20 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:ring-white/40 focus:bg-white/15 transition-all"
          />
        </div>

        <div className="mb-5">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ring-1 ${
              activeTag !== "All"
                ? "bg-blue-500/25 ring-blue-400/50 text-blue-300"
                : "bg-white/10 ring-white/20 text-white/70 hover:bg-white/15 hover:text-white"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {filterLabel}
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-300 ${filterOpen ? "rotate-180" : ""}`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              filterOpen ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0"
            }`}
          >
            <div className="bg-white/[0.06] ring-1 ring-white/15 rounded-2xl p-3 flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ring-1 ${
                    activeTag === tag
                      ? "bg-blue-500/20 ring-blue-500/50 text-blue-300"
                      : "bg-white/[0.04] ring-white/10 text-white/50 hover:bg-white/[0.08] hover:text-white/80"
                  }`}
                >
                  {tag}
                </button>
              ))}
              {activeTag !== "All" && (
                <button
                  onClick={() => setActiveTag("All")}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium ring-1 bg-red-500/10 ring-red-500/25 text-red-400 hover:bg-red-500/20 transition-all"
                >
                  <X className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {airdrops.length > 0 && (
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-white/30 font-medium">
              {filtered.length} {filtered.length === 1 ? "result" : "results"}
              {activeTag !== "All" && (
                <span> for <span className="text-white/50">{activeTag}</span></span>
              )}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {airdrops.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] ring-1 ring-white/10 flex items-center justify-center">
                <Link2 className="w-7 h-7 text-white/20" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/40">Belum ada link tersimpan</p>
                <p className="text-xs text-white/20 mt-1">Ketuk tombol + untuk menambah airdrop pertamamu</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.06] ring-1 ring-white/15 text-sm text-white/70 hover:bg-white/[0.10] hover:text-white transition-all"
              >
                <Plus className="w-4 h-4" />
                Tambah Link
              </button>
            </div>
          ) : filtered.length > 0 ? (
            filtered.map((item) => (
              <AirdropCard key={item.id} item={item} onDelete={handleDelete} onAskAI={handleAskGemini} />
            ))
          ) : (
            <div className="text-center py-16 text-white/25">
              <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Tidak ada hasil</p>
              <p className="text-xs mt-1 opacity-60">Coba kata kunci atau filter lain</p>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 px-4">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.07] backdrop-blur-2xl ring-1 ring-white/15 shadow-2xl shadow-black/60">
          <button
            onClick={() => setActiveNav("home")}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 ${
              activeNav === "home"
                ? "bg-white/15 text-white"
                : "text-white/40 hover:text-white/70 hover:bg-white/8"
            }`}
          >
            <Home className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg shadow-white/20 mx-1 hover:bg-white/90 active:scale-95 transition-all duration-200"
          >
            <Plus className="w-5 h-5 text-black" />
          </button>

          <button
            onClick={() => setActiveNav("bookmarks")}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 ${
              activeNav === "bookmarks"
                ? "bg-white/15 text-white"
                : "text-white/40 hover:text-white/70 hover:bg-white/8"
            }`}
          >
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showAddModal && (
        <AddLinkModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />
      )}

      <div
        className={`fixed bottom-28 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#18182a] ring-1 ring-violet-500/30 shadow-2xl shadow-violet-900/30 transition-all duration-300 ${
          showToast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
        <Sparkles className="w-4 h-4 text-violet-400 flex-shrink-0" />
        <p className="text-xs text-white/80 whitespace-nowrap">Prompt disalin! Membuka Gemini…</p>
      </div>
    </div>
  );
}
