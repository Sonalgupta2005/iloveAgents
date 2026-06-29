import { BookOpen, Briefcase, Code2, Palette, PenLine, Search, Sparkles, Zap, ShieldCheck, ListChecks } from 'lucide-react'

export const STEP_IDS = {
  GOAL: 'goal',
  EXPERIENCE: 'experience',
  PROVIDER: 'provider',
  BUDGET: 'budget',
  PREFERENCES: 'preferences',
}

export const RESULT_LIMIT = 5
export const MIN_CONFIDENT_SCORE = 12

export const DEFAULT_RECOMMENDATION_WEIGHTS = {
  exactCategory: 30,
  goalCategory: 20,
  taskType: 18,
  outputFormat: 12,
  providerExact: 8,
  providerAny: 4,
  freeTextName: 10,
  freeTextDescription: 5,
  experience: 3,
  urgency: 3,
}

export const GOAL_OPTIONS = [
  { id: 'build-software', label: 'Build or debug software', description: 'Code, APIs, SQL, DevOps, tests, and technical reviews.', icon: Code2, categories: ['Engineering', 'DevOps', 'Developer Tools', 'Data Science'], taskTypes: ['code', 'debug', 'review', 'analyze'] },
  { id: 'write-content', label: 'Write or improve content', description: 'Marketing copy, posts, SEO, scripts, and rewritten text.', icon: PenLine, categories: ['Marketing', 'Productivity', 'Sales'], taskTypes: ['write', 'generate', 'rewrite', 'optimize'] },
  { id: 'research', label: 'Research or summarize information', description: 'Summaries, analysis, documents, logs, datasets, and insights.', icon: Search, categories: ['Research', 'Productivity', 'Engineering', 'Data Science'], taskTypes: ['research', 'summarize', 'analyze'] },
  { id: 'learn', label: 'Learn or prepare', description: 'Study plans, quizzes, flashcards, interview prep, and explainers.', icon: BookOpen, categories: ['Education', 'Engineering'], taskTypes: ['explain', 'quiz', 'plan', 'practice'] },
  { id: 'business', label: 'Plan business, product, or sales work', description: 'Strategy, personas, PRDs, proposals, outreach, and operations.', icon: Briefcase, categories: ['Business', 'Product', 'Sales', 'HR', 'Finance', 'Real Estate'], taskTypes: ['plan', 'strategy', 'analyze', 'write'] },
  { id: 'design', label: 'Design or create something visual', description: 'Images, typography, colors, game design, and creative assets.', icon: Palette, categories: ['Design', 'Gaming'], taskTypes: ['design', 'creative', 'generate'] },
]

export const EXPERIENCE_OPTIONS = [
  { id: 'beginner', label: 'Beginner', description: 'Explain and guide me step by step.' },
  { id: 'intermediate', label: 'Intermediate', description: 'Give practical structure and examples.' },
  { id: 'advanced', label: 'Advanced', description: 'Be concise, technical, and direct.' },
  { id: 'any', label: 'Any level is fine', description: 'Prioritize the best fit overall.' },
]

export const PROVIDER_OPTIONS = [
  { id: 'any', label: 'Any provider', description: 'Recommend across all providers.' },
  { id: 'openai', label: 'OpenAI', description: 'Prefer OpenAI-backed agents.' },
  { id: 'anthropic', label: 'Anthropic', description: 'Prefer Anthropic-backed agents.' },
  { id: 'gemini', label: 'Gemini', description: 'Prefer Gemini-backed agents.' },
]

export const BUDGET_OPTIONS = [
  { id: 'balanced', label: 'Balanced recommendation', description: 'Balance specificity and capability.' },
  { id: 'quick', label: 'Prefer simpler/faster agents', description: 'Favor focused, direct helpers.' },
  { id: 'thorough', label: 'Prefer capable/thorough agents', description: 'Favor analysis, audits, and detailed planning.' },
  { id: 'any', label: 'No preference', description: 'Do not adjust ranking for this.' },
]

export const EXTRA_PREFERENCE_OPTIONS = [
  { id: 'structured', label: 'Needs structured output', icon: ListChecks, taskTypes: ['structure', 'document'], outputFormat: 'document' },
  { id: 'checklist', label: 'Needs checklist or plan', icon: ListChecks, taskTypes: ['plan', 'checklist'], outputFormat: 'checklist' },
  { id: 'technical', label: 'Needs code or technical detail', icon: Code2, taskTypes: ['code', 'debug', 'technical'], outputFormat: 'code' },
  { id: 'concise', label: 'Needs concise answer', icon: Zap, taskTypes: ['summarize'], outputFormat: 'any' },
  { id: 'creative', label: 'Needs creative ideas', icon: Sparkles, taskTypes: ['creative', 'generate'], outputFormat: 'document' },
  { id: 'review', label: 'Needs risk or quality review', icon: ShieldCheck, taskTypes: ['review', 'audit', 'analyze'], outputFormat: 'checklist' },
]

export const STOP_WORDS = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'your', 'you', 'into', 'about', 'need', 'needs', 'help', 'agent', 'agents', 'please', 'would'])
