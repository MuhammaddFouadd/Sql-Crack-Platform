import { format } from 'sql-formatter'

/** Format SQL string with sql-formatter (sqlite dialect, uppercase keywords). */
export function formatSQL(sql: string): string {
  try {
    return format(sql, {
      language: 'sqlite',
      keywordCase: 'upper',
      indentStyle: 'standard',
      linesBetweenQueries: 1,
    })
  } catch {
    return sql.trim()
  }
}

/** Strip comments and whitespace, then upper-case a SQL string. */
export function normalizeSQL(sql: string): string {
  return sql
    .replace(/--.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/;+$/, '')
    .toUpperCase()
}
