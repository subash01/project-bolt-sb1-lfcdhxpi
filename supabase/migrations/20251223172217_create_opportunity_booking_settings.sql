/*
  # Create Opportunity Resource Booking Settings

  1. New Tables
    - `opportunity_booking_settings`
      - `id` (uuid, primary key) - Unique identifier for the setting
      - `setting_name` (text) - Name of the setting (e.g., 'default_booking_rules')
      - `is_active` (boolean) - Whether this setting is currently active
      - `created_at` (timestamptz) - When the setting was created
      - `updated_at` (timestamptz) - When the setting was last updated
      - `created_by` (text) - User who created the setting
      
    - `booking_status_rules`
      - `id` (uuid, primary key) - Unique identifier
      - `setting_id` (uuid, foreign key) - References opportunity_booking_settings
      - `opportunity_status` (text) - Opportunity status (Open, In Progress, Closed-Won, Closed-Lost)
      - `booking_action` (text) - Action to take (create_soft, convert_to_confirmed, cancel)
      - `booking_type` (text) - Type of booking (soft-booked, hard-booked)
      - `is_enabled` (boolean) - Whether this rule is enabled
      - `sort_order` (integer) - Display order
      
    - `probability_thresholds`
      - `id` (uuid, primary key) - Unique identifier
      - `setting_id` (uuid, foreign key) - References opportunity_booking_settings
      - `min_probability` (integer) - Minimum probability percentage
      - `max_probability` (integer) - Maximum probability percentage
      - `auto_create_booking` (boolean) - Whether to automatically create booking
      - `booking_type` (text) - Type of booking to create
      - `is_enabled` (boolean) - Whether this threshold is enabled

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage settings
*/

-- Create opportunity_booking_settings table
CREATE TABLE IF NOT EXISTS opportunity_booking_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_name text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by text NOT NULL
);

ALTER TABLE opportunity_booking_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view booking settings"
  ON opportunity_booking_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert booking settings"
  ON opportunity_booking_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update booking settings"
  ON opportunity_booking_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete booking settings"
  ON opportunity_booking_settings FOR DELETE
  TO authenticated
  USING (true);

-- Create booking_status_rules table
CREATE TABLE IF NOT EXISTS booking_status_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_id uuid REFERENCES opportunity_booking_settings(id) ON DELETE CASCADE,
  opportunity_status text NOT NULL,
  booking_action text NOT NULL,
  booking_type text NOT NULL,
  is_enabled boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE booking_status_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view status rules"
  ON booking_status_rules FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert status rules"
  ON booking_status_rules FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update status rules"
  ON booking_status_rules FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete status rules"
  ON booking_status_rules FOR DELETE
  TO authenticated
  USING (true);

-- Create probability_thresholds table
CREATE TABLE IF NOT EXISTS probability_thresholds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_id uuid REFERENCES opportunity_booking_settings(id) ON DELETE CASCADE,
  min_probability integer NOT NULL,
  max_probability integer NOT NULL,
  auto_create_booking boolean DEFAULT false,
  booking_type text NOT NULL,
  is_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE probability_thresholds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view probability thresholds"
  ON probability_thresholds FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert probability thresholds"
  ON probability_thresholds FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update probability thresholds"
  ON probability_thresholds FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete probability thresholds"
  ON probability_thresholds FOR DELETE
  TO authenticated
  USING (true);

-- Insert default settings
INSERT INTO opportunity_booking_settings (setting_name, created_by)
VALUES ('Default Booking Rules', 'system')
ON CONFLICT DO NOTHING;

-- Insert default status rules
DO $$
DECLARE
  default_setting_id uuid;
BEGIN
  SELECT id INTO default_setting_id 
  FROM opportunity_booking_settings 
  WHERE setting_name = 'Default Booking Rules' 
  LIMIT 1;
  
  IF default_setting_id IS NOT NULL THEN
    INSERT INTO booking_status_rules (setting_id, opportunity_status, booking_action, booking_type, sort_order)
    VALUES 
      (default_setting_id, 'Open', 'create_soft', 'soft-booked', 1),
      (default_setting_id, 'In Progress', 'create_soft', 'soft-booked', 2),
      (default_setting_id, 'Closed-Won', 'convert_to_confirmed', 'hard-booked', 3),
      (default_setting_id, 'Closed-Lost', 'cancel', 'cancelled', 4)
    ON CONFLICT DO NOTHING;
    
    INSERT INTO probability_thresholds (setting_id, min_probability, max_probability, auto_create_booking, booking_type)
    VALUES 
      (default_setting_id, 0, 25, false, 'soft-booked'),
      (default_setting_id, 26, 50, true, 'soft-booked'),
      (default_setting_id, 51, 75, true, 'soft-booked'),
      (default_setting_id, 76, 100, true, 'soft-booked')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;