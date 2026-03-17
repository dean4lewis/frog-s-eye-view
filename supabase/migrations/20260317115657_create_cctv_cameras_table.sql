/*
  # CCTV Cameras Database Migration
  
  Creates a comprehensive table for storing CCTV camera information across Indonesia.
  
  ## New Tables
    - `cctv_cameras`
      - `id` (uuid, primary key)
      - `camera_name` (text) - Name/identifier of the camera
      - `stream_url` (text) - HLS stream URL
      - `province` (text) - Province location
      - `city` (text) - City/regency location
      - `location_detail` (text) - Specific location description
      - `latitude` (numeric) - GPS latitude
      - `longitude` (numeric) - GPS longitude
      - `status` (text) - Camera status (active/inactive)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  ## Security
    - Enable RLS on `cctv_cameras` table
    - Add policy for public read access (surveillance data is public)
    - Add policy for authenticated users to manage cameras
*/

CREATE TABLE IF NOT EXISTS cctv_cameras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  camera_name text NOT NULL,
  stream_url text NOT NULL,
  province text NOT NULL,
  city text NOT NULL,
  location_detail text,
  latitude numeric,
  longitude numeric,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cctv_cameras ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to CCTV cameras"
  ON cctv_cameras
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to insert cameras"
  ON cctv_cameras
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update cameras"
  ON cctv_cameras
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete cameras"
  ON cctv_cameras
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_cctv_province ON cctv_cameras(province);
CREATE INDEX IF NOT EXISTS idx_cctv_city ON cctv_cameras(city);
CREATE INDEX IF NOT EXISTS idx_cctv_status ON cctv_cameras(status);