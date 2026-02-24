import type { Field } from 'payload'

type UnitOption = {
  label: string
  value: string
}

function createNumberWithUnitField(args: {
  name: string
  label: string
  unitOptions: UnitOption[]
}): Field {
  return {
    name: args.name,
    type: 'group',
    label: args.label,
    fields: [
      {
        name: 'value',
        type: 'number',
        label: 'Wert',
      },
      {
        name: 'unit',
        type: 'select',
        label: 'Einheit',
        required: false,
        options: args.unitOptions,
      },
    ],
  }
}

export const frontladerZubehoerSpecsFields: Field[] = [
  {
    name: 'technicalData',
    type: 'group',
    label: 'Technische Daten',
    fields: [
      createNumberWithUnitField({
        name: 'width',
        label: 'Breite',
        unitOptions: [
          { label: 'mm', value: 'mm' },
          { label: 'cm', value: 'cm' },
          { label: 'm', value: 'm' },
        ],
      }),
      createNumberWithUnitField({
        name: 'hydraulicCylinders',
        label: 'Hydraulikzylinder',
        unitOptions: [{ label: 'Stk', value: 'Stk' }],
      }),
      {
        name: 'requiresDwConnection',
        type: 'checkbox',
        label: 'DW-Anschluss erforderlich',
      },
      createNumberWithUnitField({
        name: 'weight',
        label: 'Gewicht',
        unitOptions: [{ label: 'kg', value: 'kg' }],
      }),
      {
        name: 'mounting',
        type: 'select',
        label: 'Aufnahme',
        options: [{ label: 'Euroaufnahme', value: 'euroaufnahme' }],
      },
      {
        name: 'swivel',
        type: 'select',
        label: 'Schwenkung',
        hasMany: true,
        options: [
          { label: 'hydraulisch', value: 'hydraulisch' },
          { label: 'Vorlauf', value: 'vorlauf' },
          { label: 'Rücklauf', value: 'ruecklauf' },
        ],
      },
      createNumberWithUnitField({
        name: 'oilPressureTo',
        label: 'Öldruck bis',
        unitOptions: [{ label: 'bar', value: 'bar' }],
      }),
      {
        name: 'driveType',
        type: 'select',
        label: 'Antriebsart',
        options: [
          { label: 'Manuell', value: 'manuell' },
          { label: 'Hydraulisch', value: 'hydraulisch' },
        ],
      },
      createNumberWithUnitField({
        name: 'hydraulicPower',
        label: 'Hydraulikleistung',
        unitOptions: [
          { label: 'l/min', value: 'l/min' },
          { label: 'bar', value: 'bar' },
          { label: 'PS', value: 'PS' },
          { label: 'kW', value: 'kW' },
        ],
      }),
      createNumberWithUnitField({
        name: 'tractorPowerMin',
        label: 'Mind. Leistung Traktor',
        unitOptions: [
          { label: 'PS', value: 'PS' },
          { label: 'kW', value: 'kW' },
        ],
      }),
      createNumberWithUnitField({
        name: 'tractorPowerMax',
        label: 'Max Leistung Traktor',
        unitOptions: [
          { label: 'PS', value: 'PS' },
          { label: 'kW', value: 'kW' },
        ],
      }),
      createNumberWithUnitField({
        name: 'rpmPerMinute',
        label: 'Umdrehungen / Minute',
        unitOptions: [{ label: 'U/min', value: 'U/min' }],
      }),
    ],
  },
  {
    name: 'dimensions',
    type: 'group',
    label: 'Maße',
    fields: [
      createNumberWithUnitField({
        name: 'height',
        label: 'Höhe',
        unitOptions: [
          { label: 'mm', value: 'mm' },
          { label: 'cm', value: 'cm' },
          { label: 'm', value: 'm' },
        ],
      }),
      createNumberWithUnitField({
        name: 'openingWidth',
        label: 'Öffnungsweite',
        unitOptions: [
          { label: 'mm', value: 'mm' },
          { label: 'cm', value: 'cm' },
          { label: 'm', value: 'm' },
        ],
      }),
      {
        name: 'packagingDimensions',
        type: 'group',
        label: 'Packmaße',
        fields: [
          createNumberWithUnitField({
            name: 'length',
            label: 'Länge',
            unitOptions: [
              { label: 'mm', value: 'mm' },
              { label: 'cm', value: 'cm' },
              { label: 'm', value: 'm' },
            ],
          }),
          createNumberWithUnitField({
            name: 'width',
            label: 'Breite',
            unitOptions: [
              { label: 'mm', value: 'mm' },
              { label: 'cm', value: 'cm' },
              { label: 'm', value: 'm' },
            ],
          }),
          createNumberWithUnitField({
            name: 'height',
            label: 'Höhe',
            unitOptions: [
              { label: 'mm', value: 'mm' },
              { label: 'cm', value: 'cm' },
              { label: 'm', value: 'm' },
            ],
          }),
          createNumberWithUnitField({
            name: 'weight',
            label: 'Gewicht',
            unitOptions: [{ label: 'kg', value: 'kg' }],
          }),
        ],
      },
    ],
  },
]
