# Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/) for all git messages.

## Format

```
<type>: <short description>
```

Types:

| Type     | Usage                                              |
|----------|----------------------------------------------------|
| `feat`   | A new feature                                      |
| `fix`    | A bug fix                                          |
| `docs`   | Documentation only changes (README, comments)      |
| `style`  | Code style changes (formatting, missing semicolons)|
| `refactor`| Code change that neither fixes nor adds feature   |
| `perf`   | Performance improvement                            |
| `test`   | Adding or fixing tests                             |
| `chore`  | Build process, deps, config, tooling               |
| `ci`     | CI/CD configuration                                |
| `build`  | Changes to build system                            |

## Rules

1. **Imperative mood**: "add" not "added" or "adds"
2. **No period** at end of subject line
3. **Lowercase** after the colon
4. **One commit per logical change** — don't bundle unrelated changes
5. **Scope is optional** but use it for clarity: `feat(auth): add Google sign-in`

## Examples

```
feat: add sql-formatter for proper SQL formatting
fix: remove broken regex-based SQL formatter
docs: update README with new features
chore: add start.sh script and offline npm command
feat(playground): add schema selector dropdown
fix(auth): handle token expiry gracefully
```

## History

This convention was established on 2026-05-18 based on this conversation's patterns.
