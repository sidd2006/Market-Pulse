"use client";

import { useState } from "react";
import { Search, Loader2, ExternalLink, Zap } from "lucide-react";
import { mockNewsArticles } from "@/lib/mockData";

type Article = {
  id: number;
  title: string;
  source: string;
  date: string;
  summary: string;
  relevance: number;
  tags: string[];
};

function RelevanceBadge({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color =
    score >= 0.9
      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      : score >= 0.8
      ? "text-sky-400 bg-sky-500/10 border-sky-500/20"
      : "text-slate-400 bg-slate-700/50 border-slate-600/20";

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold border ${color}`}>
      <Zap size={10} />
      {pct}% match
    </span>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <div className="glass-card rounded-2xl p-5 hover:border-slate-600/60 transition-colors group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sky-400 text-xs font-semibold uppercase tracking-wider">{article.source}</span>
          <span className="text-slate-600 text-xs">·</span>
          <span className="text-slate-500 text-xs">{article.date}</span>
        </div>
        <RelevanceBadge score={article.relevance} />
      </div>

      <h3 className="text-white font-semibold text-base leading-snug mb-2 group-hover:text-sky-300 transition-colors">
        {article.title}
      </h3>

      <p className="text-slate-400 text-sm leading-relaxed mb-4">{article.summary}</p>

      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {article.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-slate-800 text-slate-400 text-xs rounded-lg">
              #{tag}
            </span>
          ))}
        </div>
        <button className="flex items-center gap-1 text-sky-400 text-xs hover:text-sky-300 transition-colors flex-shrink-0">
          Read more <ExternalLink size={11} />
        </button>
      </div>
    </div>
  );
}

export default function NewsPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Article[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(false);

    // Simulate semantic search delay
    setTimeout(() => {
      // Filter mock articles by query (simple keyword match as mock semantic search)
      const q = query.toLowerCase();
      const filtered = mockNewsArticles.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)) ||
          a.source.toLowerCase().includes(q)
      );
      setResults(filtered.length > 0 ? filtered : mockNewsArticles);
      setLoading(false);
      setSearched(true);
    }, 900);
  };

  return (
    <div className="space-y-6 max-w-screen-xl">
      {/* Hero Search */}
      <div className="glass-card rounded-2xl p-8 text-center">
        <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          <Zap size={12} />
          Semantic Search Powered by AI
        </div>
        <h2 className="text-white text-2xl font-bold mb-2">Financial News Search</h2>
        <p className="text-slate-400 text-sm mb-6 max-w-lg mx-auto">
          Search financial news by meaning, not just keywords. Our AI understands context and finds the most relevant articles for your portfolio.
        </p>

        <form onSubmit={handleSearch} className="flex gap-3 max-w-xl mx-auto">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search financial news by meaning..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-3 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            Search
          </button>
        </form>

        {/* Quick suggestions */}
        <div className="flex items-center gap-2 justify-center mt-4 flex-wrap">
          <span className="text-slate-500 text-xs">Try:</span>
          {["Fed rate cuts", "AAPL earnings", "AI stocks", "EV market"].map((s) => (
            <button
              key={s}
              onClick={() => {
                setQuery(s);
              }}
              className="text-slate-400 text-xs bg-slate-800 hover:bg-slate-700 hover:text-white px-3 py-1 rounded-lg transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading && (
        <div className="text-center py-16">
          <Loader2 size={32} className="animate-spin text-sky-400 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Searching for semantically relevant articles...</p>
        </div>
      )}

      {searched && !loading && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-sm">
              Found <span className="text-white font-semibold">{results.length}</span> articles for{" "}
              <span className="text-sky-400 font-semibold">&ldquo;{query}&rdquo;</span>
            </p>
            <span className="text-slate-500 text-xs">Sorted by relevance</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {results.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </>
      )}

      {/* Default state: show latest news */}
      {!searched && !loading && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">Latest Financial News</h3>
            <span className="text-slate-500 text-xs">Updated just now</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {mockNewsArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
