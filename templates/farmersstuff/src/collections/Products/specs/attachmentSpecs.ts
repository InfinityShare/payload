import type { Field } from 'payload'

/**
 * Attachment-specific technical specifications.
 * All fields are filterable via REST API (e.g., where[attachmentSpecs.mounting][equals]=3-punkt).
 */
export const attachmentSpecsFields: Field[] = [
  {
    name: 'mounting',
    type: 'select',
    options: [
      { label: '3-Punkt', value: '3-punkt' },
      { label: 'Frontlader', value: 'frontlader' },
      { label: 'Euroaufnahme', value: 'euroaufnahme' },
    ],
  },
  {
    name: 'capacity_l',
    type: 'number',
    label: 'Fassungsvermögen (l)',
  },
  {
    name: 'lower_link_attachment',
    type: 'text',
    label: 'Unterlenkeraufnahme',
  },
  {
    name: 'upper_link_attachment',
    type: 'text',
    label: 'Oberlenkeraufnahme',
  },
  {
    name: 'frame',
    type: 'text',
    label: 'Rahmen',
  },
  {
    name: 'spreader_disc_diameter_cm',
    type: 'number',
    label: 'Streuscheibe Ø (cm)',
  },
  {
    name: 'dimensions_length_cm',
    type: 'number',
    label: 'Abmessungen Länge (cm)',
  },
  {
    name: 'dimensions_width_cm',
    type: 'number',
    label: 'Abmessungen Breite (cm)',
  },
  {
    name: 'dimensions_height_cm',
    type: 'number',
    label: 'Abmessungen Höhe (cm)',
  },
  {
    name: 'weight_kg',
    type: 'number',
    label: 'Eigengewicht (kg)',
  },
  {
    name: 'work_speed_min_km_h',
    type: 'number',
    label: 'Arbeitsgeschwindigkeit min. (km/h)',
  },
  {
    name: 'work_speed_max_km_h',
    type: 'number',
    label: 'Arbeitsgeschwindigkeit max. (km/h)',
  },
  {
    name: 'ready_to_use',
    type: 'checkbox',
    label: 'Direkt Mitnehmen – Sofort Einsetzbar!',
  },
  {
    name: 'required_hydraulic_flow_l_min',
    type: 'number',
    label: 'Hydraulikbedarf (l/min)',
  },
  {
    name: 'requires_rear_pto',
    type: 'checkbox',
    label: 'Benötigt Heck-PTO',
  },
  {
    name: 'compatible_hitch_category',
    type: 'select',
    options: [
      { label: 'Kat. I', value: 'i' },
      { label: 'Kat. II', value: 'ii' },
      { label: 'Kat. III', value: 'iii' },
    ],
  },
]
