import type { Field } from 'payload'

export const tractorSpecsFields: Field[] = [
  // ─────────────────────────────────────────
  // Motor
  // ─────────────────────────────────────────
  { name: 'engine_type', type: 'text', label: 'Motortyp' },
  { name: 'power_hp', type: 'number', label: 'Leistung (PS)' },
  { name: 'engine_cylinders', type: 'number', label: 'Zylinder' },
  { name: 'engine_bore_mm', type: 'number', label: 'Bohrung (mm)' },
  { name: 'engine_stroke_mm', type: 'number', label: 'Hub (mm)' },
  { name: 'engine_displacement_cc', type: 'number', label: 'Hubraum (cc)' },
  { name: 'engine_rated_rpm', type: 'number', label: 'Nenndrehzahl (U/min)' },
  { name: 'engine_max_torque_nm', type: 'number', label: 'Max. Drehmoment (Nm)' },
  {
    name: 'engine_max_torque_rpm',
    type: 'number',
    label: 'Max. Drehmoment bei (U/min)',
  },

  // ─────────────────────────────────────────
  // Elektrik
  // ─────────────────────────────────────────
  { name: 'battery_voltage_v', type: 'number', label: 'Batteriespannung (V)' },
  { name: 'battery_capacity_ah', type: 'number', label: 'Batteriekapazität (Ah)' },
  { name: 'alternator_output_a', type: 'number', label: 'Dynamo (A)' },
  {
    name: 'trailer_socket',
    type: 'select',
    label: 'Anhängeranschluss',
    options: [
      { label: 'Keiner', value: 'none' },
      { label: '7-polig', value: '7pin' },
      { label: '13-polig', value: '13pin' },
    ],
  },

  // ─────────────────────────────────────────
  // Hydraulik
  // ─────────────────────────────────────────
  {
    name: 'hydraulics_auto_depth_control',
    type: 'checkbox',
    label: 'Automatische Tiefenkontrolle',
  },
  {
    name: 'hydraulics_position_control',
    type: 'checkbox',
    label: 'Hubpositionskontrolle',
  },
  {
    name: 'three_point_category',
    type: 'select',
    label: '3-Punkt-Kupplung',
    options: [
      { label: 'Kategorie I', value: 'I' },
      { label: 'Kategorie II', value: 'II' },
      { label: 'Kategorie III', value: 'III' },
    ],
  },
  {
    name: 'hydraulic_valves_count',
    type: 'number',
    label: 'Hydraulikventile (Anzahl)',
  },
  {
    name: 'lift_capacity_kg',
    type: 'number',
    label: 'Tragfähigkeit an den Hebebällen (kg)',
  },

  // ─────────────────────────────────────────
  // Bremsen
  // ─────────────────────────────────────────
  { name: 'brake_type', type: 'text', label: 'Bremsentyp' },
  {
    name: 'brake_activation',
    type: 'select',
    label: 'Bremsbetätigung',
    options: [
      { label: 'Mechanisch', value: 'mechanical' },
      { label: 'Hydraulisch', value: 'hydraulic' },
    ],
  },
  {
    name: 'parking_brake',
    type: 'checkbox',
    label: 'Feststellbremse',
  },

  // ─────────────────────────────────────────
  // Wendekreis
  // ─────────────────────────────────────────
  {
    name: 'turning_circle_without_brakes_m',
    type: 'number',
    label: 'Wendekreis ohne Bremsen (m)',
  },
  {
    name: 'turning_circle_with_brakes_m',
    type: 'number',
    label: 'Wendekreis mit Bremsen (m)',
  },

  // ─────────────────────────────────────────
  // Getriebe & Antrieb
  // ─────────────────────────────────────────
  {
    name: 'drive',
    type: 'select',
    label: 'Antrieb',
    options: [
      { label: '2WD', value: '2wd' },
      { label: '4WD', value: '4wd' },
    ],
  },
  { name: 'clutch_type', type: 'text', label: 'Kupplung' },
  { name: 'gearbox', type: 'text', label: 'Getriebe' },
  {
    name: 'transmission_type',
    type: 'text',
    label: 'Übertragung',
  },

  // ─────────────────────────────────────────
  // Geschwindigkeiten
  // ─────────────────────────────────────────
  {
    name: 'min_speed_kmh',
    type: 'number',
    label: 'Min. Fahrgeschwindigkeit (km/h)',
  },
  {
    name: 'min_speed_rpm',
    type: 'number',
    label: 'Min. Fahrgeschwindigkeit bei (U/min)',
  },
  {
    name: 'max_speed_kmh',
    type: 'number',
    label: 'Max. Fahrgeschwindigkeit (km/h)',
  },
  {
    name: 'max_speed_rpm',
    type: 'number',
    label: 'Max. Fahrgeschwindigkeit bei (U/min)',
  },

  // ─────────────────────────────────────────
  // Reifen
  // ─────────────────────────────────────────
  { name: 'tire_front', type: 'text', label: 'Reifen vorne' },
  { name: 'tire_rear', type: 'text', label: 'Reifen hinten' },

  // ─────────────────────────────────────────
  // PTO
  // ─────────────────────────────────────────
  {
    name: 'pto_speeds',
    type: 'text',
    label: 'Zapfwelle (U/min)',
  },
  {
    name: 'pto_type',
    type: 'select',
    label: 'Zapfwellenart',
    options: [
      { label: 'Mechanisch', value: 'mechanical' },
      { label: 'Hydraulisch', value: 'hydraulic' },
    ],
  },

  // ─────────────────────────────────────────
  // Lenkung
  // ─────────────────────────────────────────
  {
    name: 'steering_type',
    type: 'select',
    label: 'Lenksystem',
    options: [
      { label: 'Mechanisch', value: 'mechanical' },
      { label: 'Hydraulisch', value: 'hydraulic' },
    ],
  },

  // ─────────────────────────────────────────
  // Abmessungen & Gewichte
  // ─────────────────────────────────────────
  { name: 'weight_kg', type: 'number', label: 'Gesamtgewicht (kg)' },
  { name: 'wheelbase_mm', type: 'number', label: 'Radstand (mm)' },
  { name: 'length_mm', type: 'number', label: 'Gesamtlänge (mm)' },
  { name: 'width_mm', type: 'number', label: 'Gesamtbreite (mm)' },
  { name: 'height_mm', type: 'number', label: 'Höhe (mm)' },
  { name: 'ground_clearance_mm', type: 'number', label: 'Bodenfreiheit (mm)' },
]
