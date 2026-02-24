import type { Field } from 'payload'

export const excavatorSpecsFields: Field[] = [
  // ─────────────────────────────────────────
  // Allgemeine Informationen
  // ─────────────────────────────────────────
  { name: 'manufacturer', type: 'text', label: 'Hersteller' },
  { name: 'model', type: 'text', label: 'Modell' },
  { name: 'engine_type', type: 'text', label: 'Motor' },
  { name: 'cooling_type', type: 'text', label: 'Kühlung' },
  { name: 'engine_max_torque_nm', type: 'number', label: 'Max. Drehmoment (Nm)' },
  { name: 'engine_max_rpm', type: 'number', label: 'Max. Drehzahl (r/min)' },
  { name: 'fuel_tank_capacity_l', type: 'number', label: 'Kraftstofftank Kapazität (Liter)' },
  { name: 'starter_voltage_v', type: 'number', label: 'Elektro Starter (Volt)' },
  { name: 'max_speed_kmh', type: 'number', label: 'Maximale Geschwindigkeit (km/h)' },
  { name: 'max_gradeability_deg', type: 'number', label: 'Maximale Steigfähigkeit (°)' },
  { name: 'ground_pressure_kgf_cm2', type: 'number', label: 'Bodendruck (kgf/cm²)' },

  // ─────────────────────────────────────────
  // Maße & Gewicht
  // ─────────────────────────────────────────
  { name: 'dimensions_lxbxh_mm', type: 'text', label: 'Gesamtmaße LxBxH (mm)' },
  { name: 'track_dimensions_lxbxh_mm', type: 'text', label: 'Maße Kettenfahrwerk LxBxH (mm)' },
  { name: 'weight_kg', type: 'number', label: 'Produktgewicht (kg)' },

  // ─────────────────────────────────────────
  // Hydrauliksystem
  // ─────────────────────────────────────────
  { name: 'hydraulic_oil_tank_capacity_l', type: 'number', label: 'Öltank Kapazität (Liter)' },
  { name: 'hydraulic_oil_type', type: 'text', label: 'Hydrauliköl-Typ' },
  { name: 'hydraulic_pump_type', type: 'text', label: 'Hydraulikpumpe' },
  { name: 'hydraulic_working_pressure_bar', type: 'number', label: 'Arbeitsdruck (Bar)' },
  { name: 'hydraulic_max_pressure_bar', type: 'number', label: 'Maximaler Druck (Bar)' },
  { name: 'hydraulic_flow_l_min', type: 'number', label: 'Hydraulikfluss (Liter/min)' },

  // ─────────────────────────────────────────
  // Leistungsdaten
  // ─────────────────────────────────────────
  { name: 'dig_depth_mm', type: 'number', label: 'Grabtiefe (mm)' },
  { name: 'dump_height_mm', type: 'number', label: 'Überladehöhe (mm)' },
  { name: 'reach_at_ground_mm', type: 'number', label: 'Reichweite am Boden (mm)' },
  { name: 'bucket_breakout_force_kg', type: 'number', label: 'Reißkraft an der Schaufel (kg)' },
  { name: 'swing_radius_deg', type: 'text', label: 'Schwenkradius' },
  { name: 'swing_speed_rpm', type: 'number', label: 'Schwenkgeschwindigkeit (r/min)' },

  // ─────────────────────────────────────────
  // Besonderheiten
  // ─────────────────────────────────────────
  {
    name: 'knickmatic_arm',
    type: 'checkbox',
    label: 'Baggerarm mit Knickmatik (120°)',
  },
  {
    name: 'hydraulic_adjustable_track',
    type: 'checkbox',
    label: 'Hydraulisch verstellbares Fahrwerk',
  },
  {
    name: 'auxiliary_hydraulic_connection',
    type: 'checkbox',
    label: 'Zusätzlicher Hydraulikanschluss am Baggerarm',
  },
]
