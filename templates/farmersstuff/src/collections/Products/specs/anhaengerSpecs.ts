import type { Field } from 'payload'

export const anhaengerSpecsFields: Field[] = [
  {
    name: 'axle_configuration',
    type: 'select',
    label: 'Achs Typ',
    options: [
      { label: 'Ein Achser', value: 'single_axle' },
      { label: 'Doppel Achser', value: 'tandem_axle' },
    ],
  },
  {
    name: 'function',
    type: 'select',
    label: 'Funktion',
    hasMany: true,
    options: [{ label: '3 Seiten Kipper', value: 'three_side_tipper' }],
  },
  {
    name: 'technology',
    type: 'text',
    label: 'Technik',
  },
  {
    name: 'stvo_lighting',
    type: 'select',
    label: 'StVO Beleuchtung',
    options: [
      { label: 'Ja', value: 'yes' },
      { label: 'Nein', value: 'no' },
    ],
  },
  {
    name: 'max_permitted_weight_kg',
    type: 'number',
    label: 'Maximales Zulassungsgewicht (kg)',
  },
  {
    name: 'can_be_derated',
    type: 'select',
    label: 'Ablastbar',
    options: [
      { label: 'Ja', value: 'yes' },
      { label: 'Nein', value: 'no' },
    ],
  },
  {
    name: 'equipment',
    type: 'select',
    label: 'Ausstattung',
    hasMany: true,
    options: [
      { label: 'massive verzinkte Bordwände', value: 'massive_verzinkte_bordwaende' },
      { label: 'höhen verstellbare Deichsel', value: 'hoehen_verstellbare_deichsel' },
      { label: 'Verzurrösen', value: 'verzurroesen' },
      { label: 'Gitteraufsatzbracke', value: 'gitteraufsatzbracke' },
      { label: 'Plane', value: 'plane' },
    ],
  },
  {
    name: 'delivery',
    type: 'select',
    label: 'Lieferung',
    options: [
      { label: 'Fertig Montiert', value: 'assembled' },
      { label: 'Endmontage benötigt', value: 'final_assembly_required' },
    ],
  },
  {
    name: 'registration',
    type: 'select',
    label: 'Zulassung',
    hasMany: true,
    options: [
      { label: 'Straßenzulassung', value: 'road_legal' },
      { label: '100 km/h Zulassung', value: '100_kmh' },
      { label: 'TÜV neu', value: 'tuv_new' },
    ],
  },
  {
    name: 'height_adjustable_support_leg',
    type: 'checkbox',
    label: 'Stützfuß höhen verstellbar',
  },
  {
    name: 'axle_type',
    type: 'select',
    label: 'Achsentyp',
    options: [
      { label: 'Pendel Achsen', value: 'pendelachsen' },
      { label: 'Starrachse', value: 'starrachse' },
    ],
  },
  {
    name: 'box_dimensions_inside',
    type: 'text',
    label: 'Maße Kasten Innen',
  },
  {
    name: 'box_dimensions_outside',
    type: 'text',
    label: 'Maße Kasten Außen',
  },
  {
    name: 'tires',
    type: 'text',
    label: 'Bereifung',
  },
  {
    name: 'hitch',
    type: 'group',
    label: 'Zugmaul',
    fields: [
      {
        name: 'type',
        type: 'select',
        label: 'Zugmaul Typ',
        options: [
          { label: 'Kugelkopf', value: 'kugelkopf' },
          { label: 'Ringzugöse', value: 'ringzug' },
        ],
      },
      {
        name: 'ball_height_min_mm',
        type: 'number',
        label: 'Zugmaul Höhe Kugelkopf min (mm)',
        admin: {
          condition: (_, siblingData) => siblingData?.type === 'kugelkopf',
        },
      },
      {
        name: 'ball_height_max_mm',
        type: 'number',
        label: 'Zugmaul Höhe Kugelkopf max (mm)',
        admin: {
          condition: (_, siblingData) => siblingData?.type === 'kugelkopf',
        },
      },
      {
        name: 'eye_height_min_mm',
        type: 'number',
        label: 'Zugmaul Höhe Ringzugöse min (mm)',
        admin: {
          condition: (_, siblingData) => siblingData?.type === 'ringzug',
        },
      },
      {
        name: 'eye_height_max_mm',
        type: 'number',
        label: 'Zugmaul Höhe Ringzugöse max (mm)',
        admin: {
          condition: (_, siblingData) => siblingData?.type === 'ringzug',
        },
      },
    ],
  },
]
