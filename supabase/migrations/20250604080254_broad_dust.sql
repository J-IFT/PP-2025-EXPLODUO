/*
  # Create games table for multiplayer minesweeper
  
  1. New Tables
    - `games` 
      - `id` (uuid, primary key)
      - `board` (jsonb, stores the game board state)
      - `mines` (integer, number of mines in the game)
      - `rows` (integer, number of rows in the board)
      - `cols` (integer, number of columns in the board) 
      - `game_status` (text, current game status)
      - `player_scores` (jsonb, stores player scores)
      - `created_at` (timestamptz, when the game was created)
      - `updated_at` (timestamptz, when the game was last updated)
  
  2. Security
    - Enable RLS on the `games` table
    - Add policies for public access to games (read/write)
*/

-- Create games table
CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board jsonb NOT NULL,
  mines integer NOT NULL,
  rows integer NOT NULL,
  cols integer NOT NULL,
  game_status text NOT NULL DEFAULT 'playing',
  player_scores jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demonstration purposes)
-- In a production environment, you would want more restrictive policies
CREATE POLICY "Allow public read access to games"
  ON games
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access to games"
  ON games
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update access to games"
  ON games
  FOR UPDATE
  TO anon
  USING (true);