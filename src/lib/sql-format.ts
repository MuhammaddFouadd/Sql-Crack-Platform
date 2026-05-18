const SQL_KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER',
  'ON', 'GROUP', 'BY', 'HAVING', 'ORDER', 'ASC', 'DESC', 'LIMIT', 'OFFSET',
  'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE',
  'ALTER', 'DROP', 'INDEX', 'VIEW', 'AS', 'DISTINCT', 'UNION', 'ALL', 'INTERSECT',
  'EXCEPT', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'IN', 'BETWEEN', 'LIKE',
  'IS', 'NULL', 'NOT', 'EXISTS', 'WITH', 'RECURSIVE',
])

export function formatSQL(sql: string): string {
  let formatted = sql.trim()
  for (const kw of SQL_KEYWORDS) {
    const regex = new RegExp(`\\b${kw}\\b`, 'gi')
    formatted = formatted.replace(regex, `\n${kw}`)
  }
  formatted = formatted.replace(/\n\s*\n/g, '\n').trim()
  formatted = formatted.replace(/,\s*\n/g, ', ')
  const lines = formatted.split('\n')
  const indented = lines.map((line) => {
    const trimmed = line.trim()
    if (!trimmed) return ''
    const upper = trimmed.toUpperCase()
    if (['SELECT', 'FROM', 'WHERE', 'ORDER', 'GROUP', 'HAVING', 'LIMIT', 'INSERT', 'UPDATE', 'DELETE', 'WITH'].some((kw) => upper.startsWith(kw) || upper.startsWith(`-- ${kw}`))) {
      return trimmed
    }
    return `  ${trimmed}`
  })
  return indented.filter(Boolean).join('\n')
}

export function normalizeSQL(sql: string): string {
  return sql
    .replace(/--.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/;+$/, '')
    .toUpperCase()
}
