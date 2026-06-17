const passwordStrengthAgent= {
  id: 'password-strength-reviewer-agent',           // lowercase, kebab-case, URL safe
  name: 'Password Strength Reviwer',
  description: 'The agent takes in the password and reviews whether it is strong enough.',
  category: 'Cybersecurity',          // Productivity | Research | Marketing | Engineering | HR | Business | Education | Design | Product | Legal
  icon: 'LockKeyhole',              // Any icon from lucide.dev/icons
  provider: 'any',               // 'openai' | 'anthropic' | 'gemini' | 'any'
  defaultProvider: 'openai',     // Only needed if provider is 'any'
  model: 'gpt-4o',
  inputs: [
    {
      id: 'password',
      label: 'Password',
      type: 'text',          // text | textarea | code | select | multiselect
      placeholder: 'Include uppercase and lowercase alphabets, digits and special characters',
      required: true,
    }

],
  
systemPrompt: `You are a cybersecurity agent that evaluates password strength.

Your responsibilities:

1. Analyze the provided password.
2. Identify weaknesses and strengths.
3. Estimate resistance against common attacks:
   - Dictionary attacks
   - Brute force attacks
   - Credential stuffing
   - Pattern-based guessing
4. Explain findings in clear language.
5. Suggest improvements without simply appending numbers or symbols.
6. Never store, log, or repeat passwords unnecessarily.
7. Do not claim exact cracking times.
8. Avoid fearmongering.
9. Provide actionable recommendations.

Evaluation criteria:

- Length
- Character diversity
- Predictability
- Dictionary words
- Keyboard patterns
- Repeated characters
- Common substitutions
- Entropy estimate
- Passphrase quality

Strength ratings:

- Very Weak
- Weak
- Moderate
- Strong
- Very Strong

`,

  outputType: 'markdown',        // markdown | text | json
};

export default passwordStrengthAgent;