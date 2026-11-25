-- Optional demo products. Never run against a live customer registry.
-- Seed sample products for testing (safe to remove in production)
INSERT INTO products ("serialNumber", "productName", category, status, "useType")
VALUES 
  ('SN-90210-MAC', 'Pro Elite Book 16" (Carbon Silver)', 'Computers', 'unactivated', 'one-time'),
  ('SN-42424-VR', 'AeroVision Pro VR Headset 5K', 'Wearables', 'unactivated', 'one-time'),
  ('SN-13370-PAD', 'Developer Studio Canvas 12G', 'Tablets', 'unactivated', 'unlimited'),
  ('SN-88888-AUD', 'Omnisound ANC Headphone Studio', 'Audio', 'unactivated', 'one-time'),
  ('SN-77777-IOT', 'CoreSmart Pro IoT Gateway v3', 'Smart Home', 'unactivated', 'unlimited')
ON CONFLICT ("serialNumber") DO NOTHING;

