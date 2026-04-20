import { useState, useMemo } from "react";
import {
  Sparkles,
  Bell,
  Search,
  SlidersHorizontal,
  ExternalLink,
  Bookmark,
  Share2,
  Home,
  Layers,
  Plus,
  User,
  X,
  ChevronDown,
} from "lucide-react";

const AIRDROPS = [
  {
    id: 1,
    icon: "🤖",
    title: "Nexus AI Protocol",
    url: "nexusai.xyz",
    description:
      "Nexus AI is a decentralized machine learning infrastructure layer built on top of a modular blockchain. Stake $NXS to earn compute credits and participate in governance decisions shaping the future of on-chain AI computation.",
    tags: ["AI", "DeFi", "Layer2"],
  },
  {
    id: 2,
    icon: "🌊",
    title: "OceanSwap DEX",
    url: "oceanswap.finance",
    description:
      "OceanSwap is a next-generation automated market maker combining concentrated liquidity with dynamic fee tiers. Connect your wallet, add liquidity to any pair, and earn $WAVE tokens as trading fee rewards every epoch.",
    tags: ["DeFi", "DEX"],
  },
  {
    id: 3,
    icon: "🏛️",
    title: "AgoraDAO",
    url: "agoradao.io",
    description:
      "AgoraDAO reimagines on-chain governance through quadratic voting and soul-bound credentials. Join the waitlist, verify your identity via zero-knowledge proof, and earn founding member $AGORA tokens before the public TGE.",
    tags: ["DAO", "Governance", "ZK"],
  },
  {
    id: 4,
    icon: "⚡",
    title: "Voltchain Network",
    url: "voltchain.network",
    description:
      "Voltchain is an EVM-compatible Layer-1 blockchain optimized for real-time microtransactions and IoT payment streams. Run a validator node or simply delegate $VOLT to earn staking rewards and early network incentives.",
    tags: ["Layer1", "IoT"],
  },
  {
    id: 5,
    icon: "🎮",
    title: "PixelRealm",
    url: "pixelrealm.gg",
    description:
      "PixelRealm is a fully on-chain RPG where every item, land parcel, and character stat is stored on-chain. Complete seasonal quests to earn $PIXEL tokens redeemable for exclusive NFT gear drops and future in-game expansions.",
    tags: ["GameFi", "NFT", "Play2Earn"],
  },
];

const TAG_COLORS = {
  AI: { text: "text-violet-300", bg: "bg-violet-500/8", ring: "ring-violet-500/20" },
  DeFi: { text: "text-sky-300", bg: "bg-sky-500/8", ring: "ring-sky-500/20" },
  Layer2: { text: "text-emerald-300", bg: "bg-emerald-500/8", ring: "ring-emerald-500/20" },
  DEX: { text: "text-amber-300", bg: "bg-amber-500/8", ring: "ring-amber-500/20" },
  DAO: { text: "text-rose-300", bg: "bg-rose-500/8", ring: "ring-rose-500/20" },
  Governance: { text: "text-orange-300", bg: "bg-orange-500/8", ring: "ring-orange-500/20" },
  ZK: { text: "text-fuchsia-300", bg: "bg-fuchsia-500/8", ring: "ring-fuchsia-500/20" },
  Layer1: { text: "text-cyan-300", bg: "bg-cyan-500/8", ring: "ring-cyan-500/20" },
  IoT: { text: "text-teal-300", bg: "bg-teal-500/8", ring: "ring-teal-500/20" },
  GameFi: { text: "text-pink-300", bg: "bg-pink-500/8", ring: "ring-pink-500/20" },
  NFT: { text: "text-indigo-300", bg: "bg-indigo-500/8", ring: "ring-indigo-500/20" },
  Play2Earn: { text: "text-lime-300", bg: "bg-lime-500/8", ring: "ring-lime-500/20" },
};

const DEFAULT_TAG_COLOR = { text: "text-violet-300", bg: "bg-violet-500/8", ring: "ring-violet-500/20" };

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

function AirdropCard({ item }) {
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className="relative rounded-2xl bg-white/[0.02] ring-1 ring-white/10 p-4 transition-all duration-200 hover:bg-white/[0.04] hover:ring-white/15">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-white/[0.06] ring-1 ring-white/10 flex items-center justify-center text-2xl">
          {item.icon}
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
          onClick={() => setBookmarked(!bookmarked)}
          className="w-7 h-7 rounded-lg bg-white/[0.04] ring-1 ring-white/10 flex items-center justify-center transition-colors hover:bg-white/[0.08]"
        >
          <Bookmark
            className={`w-3.5 h-3.5 transition-colors ${bookmarked ? "text-blue-400 fill-blue-400" : "text-white/40"}`}
          />
        </button>
        <button className="w-7 h-7 rounded-lg bg-white/[0.04] ring-1 ring-white/10 flex items-center justify-center transition-colors hover:bg-white/[0.08]">
          <Share2 className="w-3.5 h-3.5 text-white/40" />
        </button>
      </div>

      <p className="text-[13px] text-white/50 leading-relaxed mt-3">{item.description}</p>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {item.tags.slice(0, 3).map((tag) => (
          <TagChip key={tag} tag={tag} />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeTag, setActiveTag] = useState("All");
  const [activeNav, setActiveNav] = useState("home");

  const allTags = useMemo(() => {
    const tags = new Set();
    AIRDROPS.forEach((a) => a.tags.forEach((t) => tags.add(t)));
    return ["All", ...Array.from(tags)];
  }, []);

  const filtered = useMemo(() => {
    return AIRDROPS.filter((item) => {
      const matchTag = activeTag === "All" || item.tags.includes(activeTag);
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));
      return matchTag && matchSearch;
    });
  }, [activeTag, search]);

  const filterLabel =
    activeTag !== "All" ? `Filter • ${activeTag}` : "Filter";

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-1/2 -right-40 w-[400px] h-[400px] rounded-full bg-violet-600/8 blur-[120px]" />
        <div className="absolute -bottom-20 left-1/4 w-[350px] h-[350px] rounded-full bg-indigo-600/6 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 pb-36 pt-6">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/[0.06] ring-1 ring-white/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-base font-bold tracking-tight text-white">DROP</span>
              <span className="text-base font-bold tracking-tight text-white/40">MYLINK</span>
            </div>
          </div>

          <button className="relative w-9 h-9 rounded-xl bg-white/[0.04] ring-1 ring-white/10 flex items-center justify-center transition-colors hover:bg-white/[0.08]">
            <Bell className="w-4.5 h-4.5 text-white/70" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-blue-500 ring-1 ring-black" />
          </button>
        </header>

        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
          <input
            type="search"
            placeholder="Search airdrops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.04] ring-1 ring-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:ring-white/20 focus:bg-white/[0.06] transition-all"
          />
        </div>

        <div className="mb-5">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ring-1 ${
              activeTag !== "All"
                ? "bg-blue-500/15 ring-blue-500/40 text-blue-300"
                : "bg-white/[0.04] ring-white/10 text-white/60 hover:bg-white/[0.07] hover:text-white/80"
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
            <div className="bg-white/[0.02] ring-1 ring-white/8 rounded-2xl p-3 flex flex-wrap gap-2">
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

        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-white/30 font-medium">
            {filtered.length} {filtered.length === 1 ? "result" : "results"}{" "}
            {activeTag !== "All" && <span>for <span className="text-white/50">{activeTag}</span></span>}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {filtered.length > 0 ? (
            filtered.map((item) => <AirdropCard key={item.id} item={item} />)
          ) : (
            <div className="text-center py-16 text-white/25">
              <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No airdrops found</p>
              <p className="text-xs mt-1 opacity-60">Try a different search or filter</p>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 px-4">
        <div className="flex items-center gap-1 px-3 py-2.5 rounded-full bg-white/[0.07] backdrop-blur-2xl ring-1 ring-white/15 shadow-2xl shadow-black/60">
          {[
            { id: "home", icon: Home, label: "Home" },
            { id: "layers", icon: Layers, label: "Explore" },
            { id: "plus", icon: Plus, label: "Add", special: true },
            { id: "bookmarks", icon: Bookmark, label: "Saved" },
            { id: "user", icon: User, label: "Profile" },
          ].map(({ id, icon: Icon, special }) => (
            <button
              key={id}
              onClick={() => setActiveNav(id)}
              className={`flex items-center justify-center transition-all duration-200 ${
                special
                  ? "w-11 h-11 rounded-full bg-white shadow-lg shadow-white/20 mx-1"
                  : `w-10 h-10 rounded-full ${
                      activeNav === id
                        ? "bg-white/15 text-white"
                        : "text-white/40 hover:text-white/70 hover:bg-white/8"
                    }`
              }`}
            >
              <Icon
                className={special ? "w-5 h-5 text-black" : "w-4.5 h-4.5"}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
