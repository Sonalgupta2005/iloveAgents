import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart3, Activity, Users, Flame, Zap,
  TrendingUp, ArrowRight, Trash2, Bot,
} from 'lucide-react'
import { useAnalytics } from '../lib/useAnalytics'
import { useDocumentTitle } from '../lib/useDocumentTitle'

// ── Provider colors ─────────────────────────────────────────────────────────
const PROVIDER_COLORS = {
  openai:     { color: '#22c55e', label: 'OpenAI' },
  anthropic:  { color: '#f97316', label: 'Anthropic' },
  gemini:     { color: '#3b82f6', label: 'Gemini' },
  openrouter: { color: '#06b6d4', label: 'OpenRouter' },
  unknown:    { color: '#71717a', label: 'Unknown' },
}

// ── Category gradient mapping (matches HomePage categoryMeta) ───────────────
const CATEGORY_COLORS = {
  Productivity:      'from-blue-500 to-cyan-400',
  Research:          'from-violet-500 to-purple-400',
  Marketing:         'from-pink-500 to-rose-400',
  Engineering:       'from-emerald-500 to-green-400',
  HR:                'from-amber-500 to-yellow-400',
  Business:          'from-orange-500 to-amber-400',
  Education:         'from-indigo-500 to-blue-400',
  Legal:             'from-red-500 to-rose-400',
  Design:            'from-fuchsia-500 to-pink-400',
  Product:           'from-teal-500 to-cyan-400',
  'Developer Tools': 'from-slate-600 to-slate-400',
  DevOps:            'from-lime-500 to-green-400',
  Finance:           'from-emerald-500 to-teal-400',
  Healthcare:        'from-rose-500 to-pink-400',
  Sales:             'from-orange-500 to-red-400',
  Cybersecurity:     'from-red-600 to-rose-500',
  'Data Science':    'from-cyan-500 to-blue-400',
  Gaming:            'from-purple-500 to-indigo-400',
  'Real Estate':     'from-amber-500 to-orange-400',
  Web3:              'from-violet-600 to-purple-500',
}
const DEFAULT_CATEGORY_COLOR = 'from-gray-500 to-gray-400'

// ── Heatmap intensity ───────────────────────────────────────────────────────
function getHeatmapIntensity(count) {
  if (count === 0) return 'bg-gray-100 dark:bg-white/5'
  if (count <= 2) return 'bg-indigo-200 dark:bg-indigo-500/25'
  if (count <= 5) return 'bg-indigo-400 dark:bg-indigo-500/50'
  return 'bg-indigo-600 dark:bg-indigo-400/80'
}

// ═════════════════════════════════════════════════════════════════════════════
// Main Page
// ═════════════════════════════════════════════════════════════════════════════

export default function AnalyticsPage() {
  useDocumentTitle('Analytics')
  const navigate = useNavigate()
  const { stats, clearAnalytics } = useAnalytics()

  // ── Empty state ───────────────────────────────────────────────────────────
  if (stats.totalRuns === 0) {
    return (
      <div className="animate-fade-in max-w-4xl mx-auto">
        <PageHeader onClear={clearAnalytics} hasData={false} />
        <div className="rounded-2xl border p-12 text-center flex flex-col items-center gap-4
          dark:bg-surface-card dark:border-border bg-white border-gray-200">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
            <BarChart3 size={32} className="text-accent" />
          </div>
          <h2 className="text-lg font-bold dark:text-text-primary text-gray-900">
            No analytics yet
          </h2>
          <p className="text-sm dark:text-text-secondary text-gray-500 max-w-md leading-relaxed">
            Run a few agents and your usage stats will automatically appear here — 
            top agents, provider breakdown, activity streaks, and more.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white
              bg-accent hover:bg-accent-hover transition-all duration-200 active:scale-[0.97] mt-2"
          >
            <Zap size={16} />
            Run an Agent
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <PageHeader onClear={clearAnalytics} hasData={true} />

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard
          icon={<Activity size={18} />}
          label="Total Runs"
          value={stats.totalRuns}
          color="text-accent"
          delay={0}
        />
        <StatCard
          icon={<Bot size={18} />}
          label="Unique Agents"
          value={stats.uniqueAgents}
          color="text-emerald-500"
          delay={60}
        />
        <StatCard
          icon={<Users size={18} />}
          label="Fav Provider"
          value={formatProvider(stats.favoriteProvider)}
          color="text-amber-500"
          delay={120}
        />
        <StatCard
          icon={<Flame size={18} />}
          label="Day Streak"
          value={`${stats.currentStreak}🔥`}
          color="text-rose-500"
          delay={180}
        />
      </div>

      {/* ── Activity Heatmap ── */}
      <SectionCard title="Activity" icon={<TrendingUp size={16} />} delay={220}>
        <ActivityHeatmap data={stats.heatmapData} />
      </SectionCard>

      {/* ── Two-column: Top Agents + Provider Donut ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        <div className="lg:col-span-3">
          <SectionCard title="Top Agents" icon={<BarChart3 size={16} />} delay={280}>
            <TopAgentsChart agents={stats.topAgents} />
          </SectionCard>
        </div>
        <div className="lg:col-span-2">
          <SectionCard title="Providers" icon={<Users size={16} />} delay={340}>
            <ProviderDonut data={stats.providerDistribution} total={stats.totalRuns} />
          </SectionCard>
        </div>
      </div>

      {/* ── Two-column: Categories + Sparkline ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <SectionCard title="Categories" icon={<BarChart3 size={16} />} delay={400}>
          <CategoryBars data={stats.categoryDistribution} />
        </SectionCard>
        <SectionCard title="Last 30 Days" icon={<Activity size={16} />} delay={460}>
          <Sparkline data={stats.dailyRuns} />
        </SectionCard>
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// Sub-components
// ═════════════════════════════════════════════════════════════════════════════

function PageHeader({ onClear, hasData }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
          <BarChart3 size={20} className="text-accent" />
        </div>
        <div>
          <h1 className="text-lg font-bold dark:text-text-primary text-gray-900">Analytics</h1>
          <p className="text-xs dark:text-text-secondary text-gray-500">Your agent usage at a glance</p>
        </div>
      </div>
      {hasData && (
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
            text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          <Trash2 size={13} />
          Clear Data
        </button>
      )}
    </div>
  )
}

function StatCard({ icon, label, value, color, delay }) {
  return (
    <div
      className="relative p-4 rounded-2xl border border-white/40 dark:border-white/10
        bg-white/70 dark:bg-[#101014]/70
        shadow-[0_18px_55px_rgba(15,23,42,0.10),0_0_20px_rgba(99,102,241,0.08)]
        backdrop-blur-2xl transition-all duration-300 hover:scale-[1.03]
        before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-2xl
        before:bg-gradient-to-r before:from-cyan-400/20 before:via-indigo-400/20 before:to-rose-400/20 before:p-px
        animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`mb-2 ${color}`}>{icon}</div>
      <div className="text-xl font-bold dark:text-text-primary text-gray-900 tabular-nums">
        {value}
      </div>
      <div className="text-[11px] dark:text-text-muted text-gray-400 font-medium mt-0.5">
        {label}
      </div>
    </div>
  )
}

function SectionCard({ title, icon, delay, children }) {
  return (
    <div
      className="rounded-xl border p-4 mb-4
        dark:bg-surface-card dark:border-border bg-white border-gray-200
        animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-accent">{icon}</span>
        <h2 className="text-sm font-semibold uppercase tracking-wider dark:text-text-muted text-gray-400">
          {title}
        </h2>
      </div>
      {children}
    </div>
  )
}

// ── Activity Heatmap ────────────────────────────────────────────────────────

function ActivityHeatmap({ data }) {
  // Group by weeks (columns)
  const weeks = useMemo(() => {
    const w = []
    let currentWeek = []
    data.forEach((day, i) => {
      currentWeek.push(day)
      if (currentWeek.length === 7 || i === data.length - 1) {
        w.push(currentWeek)
        currentWeek = []
      }
    })
    return w
  }, [data])

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const maxCount = Math.max(...data.map((d) => d.count), 1)

  return (
    <div>
      <div className="flex gap-0.5 overflow-x-auto pb-2">
        {/* Day labels */}
        <div className="flex flex-col gap-0.5 mr-1 shrink-0">
          {dayLabels.map((label, i) => (
            <div key={i} className="h-[14px] w-4 flex items-center justify-center text-[8px] dark:text-text-muted text-gray-400 font-medium">
              {i % 2 === 1 ? label : ''}
            </div>
          ))}
        </div>
        {/* Week columns */}
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-0.5">
            {week.map((day) => (
              <div
                key={day.date}
                className={`h-[14px] w-[14px] rounded-[3px] transition-all duration-300 ${getHeatmapIntensity(day.count)}`}
                title={`${day.date}: ${day.count} run${day.count !== 1 ? 's' : ''}`}
              />
            ))}
            {/* Pad short weeks */}
            {week.length < 7 && Array.from({ length: 7 - week.length }).map((_, i) => (
              <div key={`pad-${i}`} className="h-[14px] w-[14px]" />
            ))}
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex items-center gap-2 mt-2">
        <span className="text-[10px] dark:text-text-muted text-gray-400">Less</span>
        <div className="flex gap-0.5">
          {['bg-gray-100 dark:bg-white/5', 'bg-indigo-200 dark:bg-indigo-500/25', 'bg-indigo-400 dark:bg-indigo-500/50', 'bg-indigo-600 dark:bg-indigo-400/80'].map((cls, i) => (
            <div key={i} className={`h-[10px] w-[10px] rounded-[2px] ${cls}`} />
          ))}
        </div>
        <span className="text-[10px] dark:text-text-muted text-gray-400">More</span>
      </div>
    </div>
  )
}

// ── Top Agents Bar Chart ────────────────────────────────────────────────────

function TopAgentsChart({ agents }) {
  if (agents.length === 0) return <EmptyMini text="No agent data yet" />

  const maxCount = agents[0]?.count || 1

  return (
    <div className="space-y-2.5">
      {agents.map((agent, i) => {
        const pct = Math.max(5, (agent.count / maxCount) * 100)
        return (
          <div key={agent.agentId} className="group">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium dark:text-text-primary text-gray-700 truncate max-w-[200px]">
                {agent.agentName}
              </span>
              <span className="text-[11px] font-bold tabular-nums dark:text-text-muted text-gray-400">
                {agent.count}
              </span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent to-indigo-400 transition-all duration-700 ease-out"
                style={{
                  width: `${pct}%`,
                  animationDelay: `${i * 80}ms`,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Provider Donut (SVG) ────────────────────────────────────────────────────

function ProviderDonut({ data, total }) {
  if (data.length === 0) return <EmptyMini text="No provider data" />

  const size = 140
  const strokeWidth = 22
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  let cumulativeOffset = 0
  const segments = data.map((item) => {
    const pct = item.count / total
    const dash = pct * circumference
    const offset = cumulativeOffset
    cumulativeOffset += dash
    const providerInfo = PROVIDER_COLORS[item.name] || PROVIDER_COLORS.unknown
    return { ...item, dash, offset, color: providerInfo.color, label: providerInfo.label }
  })

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-100 dark:text-white/5"
          />
          {/* Segments */}
          {segments.map((seg, i) => (
            <circle
              key={seg.name}
              cx={size / 2} cy={size / 2} r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
              strokeDashoffset={-seg.offset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold dark:text-text-primary text-gray-900 tabular-nums">{total}</span>
          <span className="text-[9px] dark:text-text-muted text-gray-400 font-medium">RUNS</span>
        </div>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
        {segments.map((seg) => (
          <div key={seg.name} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: seg.color }} />
            <span className="text-[10px] font-medium dark:text-text-secondary text-gray-500">
              {seg.label} ({seg.pct}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Category Breakdown Bars ─────────────────────────────────────────────────

function CategoryBars({ data }) {
  if (data.length === 0) return <EmptyMini text="No category data" />

  const maxCount = data[0]?.count || 1

  return (
    <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
      {data.map((cat, i) => {
        const pct = Math.max(5, (cat.count / maxCount) * 100)
        const gradient = CATEGORY_COLORS[cat.name] || DEFAULT_CATEGORY_COLOR
        return (
          <div key={cat.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium dark:text-text-primary text-gray-700">
                {cat.name}
              </span>
              <span className="text-[10px] font-bold tabular-nums dark:text-text-muted text-gray-400">
                {cat.count} ({cat.pct}%)
              </span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700 ease-out`}
                style={{ width: `${pct}%`, animationDelay: `${i * 60}ms` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Sparkline (last 30 days) ────────────────────────────────────────────────

function Sparkline({ data }) {
  const maxCount = Math.max(...data.map((d) => d.count), 1)
  const width = 400
  const height = 100
  const padding = 4

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2)
    const y = height - padding - ((d.count / maxCount) * (height - padding * 2))
    return { x, y, ...d }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-28" preserveAspectRatio="none">
        {/* Gradient fill */}
        <defs>
          <linearGradient id="sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Area */}
        <path d={areaPath} fill="url(#sparkline-gradient)" />
        {/* Line */}
        <path d={linePath} fill="none" stroke="rgb(99, 102, 241)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots for days with runs */}
        {points.filter((p) => p.count > 0).map((p, i) => (
          <circle
            key={i}
            cx={p.x} cy={p.y} r="3"
            fill="rgb(99, 102, 241)"
            className="transition-all duration-300"
          >
            <title>{`${p.date}: ${p.count} run${p.count !== 1 ? 's' : ''}`}</title>
          </circle>
        ))}
      </svg>
      {/* X-axis labels */}
      <div className="flex justify-between mt-1">
        <span className="text-[9px] dark:text-text-muted text-gray-400">30 days ago</span>
        <span className="text-[9px] dark:text-text-muted text-gray-400">Today</span>
      </div>
    </div>
  )
}

// ── Tiny empty state ────────────────────────────────────────────────────────

function EmptyMini({ text }) {
  return (
    <div className="py-6 text-center text-xs dark:text-text-muted text-gray-400">
      {text}
    </div>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatProvider(p) {
  const labels = { openai: 'OpenAI', anthropic: 'Anthropic', gemini: 'Gemini', openrouter: 'OpenRouter' }
  return labels[p] || p || '—'
}
