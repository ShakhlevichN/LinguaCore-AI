/*
# Create practice sessions table

1. New Tables
- `practice_sessions`
  - `id` (uuid, primary key)
  - `topic` (text, the scenario the learner picked, e.g. Job Interview Prep)
  - `transcript` (text, what the learner said)
  - `cefr_level` (text, estimated CEFR level such as B1)
  - `grammar_corrections` (jsonb, list of original/corrected pairs)
  - `vocabulary_suggestions` (jsonb, list of suggested words)
  - `created_at` (timestamptz, when the practice turn was saved)

2. Security
- Row level security is enabled on `practice_sessions`.
- The app has no sign-in, so anon and authenticated roles can read and write.
- Data is intentionally shared/public for this MVP; no ownership column exists.

3. Notes
- No existing data is modified or removed.
*/

CREATE TABLE IF NOT EXISTS practice_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic text NOT NULL,
  transcript text NOT NULL,
  cefr_level text NOT NULL,
  grammar_corrections jsonb NOT NULL DEFAULT '[]'::jsonb,
  vocabulary_suggestions jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON practice_sessions TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_practice_sessions" ON practice_sessions;
CREATE POLICY "anon_select_practice_sessions" ON practice_sessions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_practice_sessions" ON practice_sessions;
CREATE POLICY "anon_insert_practice_sessions" ON practice_sessions FOR INSERT
  TO anon, authenticated WITH CHECK (true);
