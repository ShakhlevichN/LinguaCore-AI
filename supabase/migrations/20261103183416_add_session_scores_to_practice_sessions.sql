/*
# Add fluency and grammar accuracy scores to practice sessions

Plain-English summary: every saved practice answer now stores two scores so the Skills Dashboard can show real averages instead of placeholder numbers.

1. Modified Tables
- `practice_sessions`
  - `fluency_score` (integer, nullable): clarity score from the coach for that answer, 0 to 100. Empty for older sessions saved before this change.
  - `grammar_accuracy` (integer, nullable): 100 minus 15 points per grammar correction, never below 0. Older sessions are backfilled from their saved corrections.

2. Security
- No change to row level security, policies or grants. The new columns inherit the existing anon and authenticated SELECT and INSERT access.

3. Notes
- No existing data is removed or altered beyond filling the empty grammar accuracy values for older rows.
- Safe to re-run: columns use IF NOT EXISTS and the backfill only touches rows where the value is still empty.
*/

ALTER TABLE practice_sessions ADD COLUMN IF NOT EXISTS fluency_score integer;
ALTER TABLE practice_sessions ADD COLUMN IF NOT EXISTS grammar_accuracy integer;

UPDATE practice_sessions
SET grammar_accuracy = GREATEST(0, 100 - 15 * jsonb_array_length(grammar_corrections))
WHERE grammar_accuracy IS NULL;
