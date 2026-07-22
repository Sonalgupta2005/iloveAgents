import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'ila_analytics'
const MAX_EVENTS = 500

// ── Persistence helpers ─────────────────────────────────────────────────────

function loadEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveEvents(events) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  } catch {}
}

// ── Seed from existing history (one-time) ───────────────────────────────────

function seedFromHistory() {
  const SEED_FLAG = 'ila_analytics_seeded'
  if (localStorage.getItem(SEED_FLAG)) return

  try {
    const historyRaw = localStorage.getItem('iloveAgents_history')
    if (!historyRaw) { localStorage.setItem(SEED_FLAG, '1'); return }

    const history = JSON.parse(historyRaw)
    if (!Array.isArray(history) || history.length === 0) {
      localStorage.setItem(SEED_FLAG, '1')
      return
    }

    const existing = loadEvents()
    const existingIds = new Set(existing.map((e) => e.id))

    const seeded = history
      .filter((run) => !existingIds.has(run.id))
      .map((run) => ({
        id: run.id,
        agentId: run.agentId,
        agentName: run.agentName,
        provider: run.provider || 'unknown',
        category: '',          // history doesn't store category
        model: '',
        duration: null,
        timestamp: run.timestamp || Date.now(),
      }))

    if (seeded.length > 0) {
      const merged = [...seeded, ...existing].slice(0, MAX_EVENTS)
      saveEvents(merged)
    }
  } catch {}

  localStorage.setItem(SEED_FLAG, '1')
}

// ── Plain function (for use outside React components) ───────────────────────

export function recordAnalyticsRun({ agentId, agentName, category, provider, model, duration }) {
  const event = {
    id: `${agentId}_${Date.now()}`,
    agentId,
    agentName,
    category: category || '',
    provider: provider || 'unknown',
    model: model || '',
    duration: duration ?? null,
    timestamp: Date.now(),
  }

  const prev = loadEvents()
  const next = [event, ...prev].slice(0, MAX_EVENTS)
  saveEvents(next)

  // Notify any mounted useAnalytics hooks
  window.dispatchEvent(new Event('ila_analytics_update'))
}

// ── Stats computation ───────────────────────────────────────────────────────

function computeStats(events) {
  if (events.length === 0) {
    return {
      totalRuns: 0,
      uniqueAgents: 0,
      favoriteProvider: null,
      currentStreak: 0,
      topAgents: [],
      providerDistribution: [],
      categoryDistribution: [],
      dailyRuns: [],
      heatmapData: [],
    }
  }

  // ── Basic counts
  const totalRuns = events.length
  const agentSet = new Set(events.map((e) => e.agentId))
  const uniqueAgents = agentSet.size

  // ── Provider distribution
  const providerCounts = {}
  events.forEach((e) => {
    const p = e.provider || 'unknown'
    providerCounts[p] = (providerCounts[p] || 0) + 1
  })
  const providerDistribution = Object.entries(providerCounts)
    .map(([name, count]) => ({ name, count, pct: Math.round((count / totalRuns) * 100) }))
    .sort((a, b) => b.count - a.count)
  const favoriteProvider = providerDistribution[0]?.name || null

  // ── Top agents (top 8)
  const agentCounts = {}
  events.forEach((e) => {
    if (!agentCounts[e.agentId]) {
      agentCounts[e.agentId] = { agentId: e.agentId, agentName: e.agentName, count: 0 }
    }
    agentCounts[e.agentId].count++
  })
  const topAgents = Object.values(agentCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  // ── Category distribution
  const categoryCounts = {}
  events.forEach((e) => {
    const cat = e.category || 'Uncategorized'
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
  })
  const categoryDistribution = Object.entries(categoryCounts)
    .map(([name, count]) => ({ name, count, pct: Math.round((count / totalRuns) * 100) }))
    .sort((a, b) => b.count - a.count)

  // ── Daily runs (last 30 days) for sparkline
  const now = new Date()
  const dailyRuns = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = toDateKey(d)
    dailyRuns.push({ date: key, count: 0 })
  }
  const dailyMap = Object.fromEntries(dailyRuns.map((d) => [d.date, d]))
  events.forEach((e) => {
    const key = toDateKey(new Date(e.timestamp))
    if (dailyMap[key]) dailyMap[key].count++
  })

  // ── Heatmap data (last 12 weeks = 84 days)
  const heatmapData = []
  for (let i = 83; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = toDateKey(d)
    heatmapData.push({ date: key, dayOfWeek: d.getDay(), count: 0 })
  }
  const heatmapMap = Object.fromEntries(heatmapData.map((d) => [d.date, d]))
  events.forEach((e) => {
    const key = toDateKey(new Date(e.timestamp))
    if (heatmapMap[key]) heatmapMap[key].count++
  })

  // ── Current streak (consecutive days with ≥1 run, ending today or yesterday)
  const allDayKeys = new Set(events.map((e) => toDateKey(new Date(e.timestamp))))
  let streak = 0
  const today = toDateKey(now)
  const yesterday = toDateKey(new Date(now.getTime() - 86400000))

  // Start counting from today (or yesterday if today has no runs)
  let startDate = allDayKeys.has(today) ? now : (allDayKeys.has(yesterday) ? new Date(now.getTime() - 86400000) : null)

  if (startDate) {
    let cursor = new Date(startDate)
    while (true) {
      const key = toDateKey(cursor)
      if (allDayKeys.has(key)) {
        streak++
        cursor.setDate(cursor.getDate() - 1)
      } else {
        break
      }
    }
  }

  return {
    totalRuns,
    uniqueAgents,
    favoriteProvider,
    currentStreak,
    topAgents,
    providerDistribution,
    categoryDistribution,
    dailyRuns,
    heatmapData,
  }
}

function toDateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// ── React hook ──────────────────────────────────────────────────────────────

export function useAnalytics() {
  // Seed on first ever mount
  useEffect(() => { seedFromHistory() }, [])

  const [events, setEvents] = useState(loadEvents)

  // Listen to updates from recordAnalyticsRun (possibly same or other component)
  useEffect(() => {
    const sync = () => setEvents(loadEvents())
    window.addEventListener('ila_analytics_update', sync)
    window.addEventListener('storage', (e) => { if (e.key === STORAGE_KEY) sync() })
    return () => {
      window.removeEventListener('ila_analytics_update', sync)
    }
  }, [])

  const stats = computeStats(events)

  const clearAnalytics = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setEvents([])
  }, [])

  return { events, stats, clearAnalytics }
}
