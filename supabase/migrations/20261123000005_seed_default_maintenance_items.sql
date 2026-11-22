insert into default_maintenance_items (name, interval_type, interval_value, care_note, sort_order) values
  ('Full service', 'months', 12, 'A full service covers the checks a garage does together. Book it yearly, even if you drive little.', 1),
  ('Engine oil and filter', 'months', 12, 'Old oil wears the engine. Change the oil and the filter together.', 2),
  ('Tyre pressure check', 'months', 1, 'Check when the tyres are cold, and use the pressure on the label inside the driver door.', 3),
  ('Tyre rotation', 'months', 6, 'Swapping tyre positions evens out the wear.', 4),
  ('Tyres replaced', 'months', 48, 'Check the tread depth and the sidewalls. Replace early if they are worn or cracked.', 5),
  ('Battery', 'months', 48, 'Slow starts are the first sign it is weakening. Test it before winter.', 6),
  ('Coolant', 'months', 24, 'Keeps the engine from overheating. Check the level when the engine is cold.', 7),
  ('Brake fluid', 'months', 24, 'It absorbs moisture over time, which reduces braking performance.', 8),
  ('Brake pads', 'months', 24, 'A rough estimate. Squealing or a longer stopping distance means check them now.', 9),
  ('Light bulbs', 'months', 36, 'A rough estimate. Check all the lights regularly, including the brake lights.', 10),
  ('Wiper blades', 'months', 12, 'Replace them if they streak or squeak.', 11),
  ('Fuel', 'none', null, 'Track only. Tap Done today each time you fill up.', 12);