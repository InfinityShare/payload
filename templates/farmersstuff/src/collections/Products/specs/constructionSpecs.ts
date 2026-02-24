import type { Field } from 'payload'

/**
 * Construction equipment-specific technical specifications.
 * All fields are filterable via REST API (e.g., where[constructionSpecs.operating_weight_kg][gte]=5000).
 */
export const constructionSpecsFields: Field[] = [
  {
    name: 'operating_weight_kg',
    type: 'number',
    label: 'Betriebsgewicht (kg)',
  },
  {
    name: 'engine_power_hp',
    type: 'number',
    label: 'Motorleistung (HP)',
  },
  {
    name: 'bucket_capacity_m3',
    type: 'number',
    label: 'Schaufelvolumen (m³)',
  },
  {
    name: 'max_reach_m',
    type: 'number',
    label: 'Maximale Reichweite (m)',
  },
  {
    name: 'road_legal',
    type: 'checkbox',
    label: 'Straßenzulassung',
  },
]
