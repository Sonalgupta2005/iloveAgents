export function buildRecommendationReasons(agent, preferences = {}, matchedSignals = {}) {
  const reasons = []
  if (matchedSignals.exactCategory) reasons.push(`Matches your selected ${agent?.category || 'category'} focus.`)
  else if (matchedSignals.goalCategory) reasons.push(`Fits your ${preferences.primaryGoal?.replaceAll('-', ' ') || 'selected'} goal.`)
  if (matchedSignals.taskTypes?.length) reasons.push(`Strong fit for ${matchedSignals.taskTypes.slice(0, 2).join(' and ')} tasks.`)
  if (matchedSignals.outputFormat) reasons.push(`Aligns with your preferred ${matchedSignals.outputFormat} style output.`)
  if (matchedSignals.provider) reasons.push('Works with your selected provider preference.')
  if (matchedSignals.freeTextTerms?.length) reasons.push(`Matched terms from your goal: ${matchedSignals.freeTextTerms.slice(0, 3).join(', ')}.`)
  if (!reasons.length) reasons.push('Recommended from its name, category, and description metadata.')
  return reasons.slice(0, 4)
}
