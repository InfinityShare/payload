import type { Field } from 'payload'

export const schlegelSpecsFields: Field[] = [
  // ─────────────────────────────────────────
  // Produktmerkmale
  // ─────────────────────────────────────────
  { name: 'model', type: 'text', label: 'Modell' },
  {
    name: 'typology',
    type: 'select',
    label: 'Typologie',
    options: [
      { label: 'Mulcher', value: 'mulcher' },
      { label: 'Standardmulcher Heckanbau', value: 'standardmulcher_heckanbau' },
    ],
  },
  {
    name: 'tractor_power_from_ps',
    type: 'number',
    label: 'Traktorleistung von (PS)',
  },
  {
    name: 'tractor_power_to_ps',
    type: 'number',
    label: 'Traktorleistung bis (PS)',
  },
  {
    name: 'robustness_series',
    type: 'select',
    label: 'Robustheit - Reihe',
    options: [
      { label: 'Leicht', value: 'leicht' },
      { label: 'Mittel', value: 'mittel' },
      { label: 'Schwer', value: 'schwer' },
    ],
  },
  {
    name: 'mounting_type',
    type: 'select',
    label: 'Verschiebung',
    options: [
      { label: 'Feste Aufnahme', value: 'feste_aufnahme' },
      { label: 'Handgeführte Verschiebung', value: 'handgefuehrte_verschiebung' },
    ],
  },
  {
    name: 'manual_shifting',
    type: 'checkbox',
    label: 'Handgeführte Verschiebung',
  },
  {
    name: 'rotor_two_screws',
    type: 'checkbox',
    label: 'Rotor mit zwei Schnecken',
  },
  {
    name: 'three_point_category',
    type: 'select',
    label: 'Kategorie Dreipunktaufnahme',
    options: [
      { label: 'Kat. 1', value: 'kat1' },
      { label: 'Kat. 2', value: 'kat2' },
      { label: 'Kat. 1 und 2', value: 'kat1_und_2' },
    ],
  },
  {
    name: 'cardan_shaft_rotation',
    type: 'select',
    label: 'Rotation der Kardanwelle',
    options: [
      { label: 'Standard', value: 'standard' },
      { label: 'Rechtsdrehend', value: 'rechtsdrehend' },
      { label: 'Linksdrehend', value: 'linksdrehend' },
    ],
  },
  { name: 'manufacturing_country', type: 'text', label: 'Herstellungsland' },

  // ─────────────────────────────────────────
  // Technische Daten Getriebe
  // ─────────────────────────────────────────
  {
    name: 'gearbox_integrated_freewheel',
    type: 'checkbox',
    label: 'Vorrichtung integrierte Freirad',
  },
  {
    name: 'belt_lateral_transmission',
    type: 'number',
    label: 'Riemen seitliche Übertragung',
  },

  // ─────────────────────────────────────────
  // Technische Daten Mähwerk
  // ─────────────────────────────────────────
  { name: 'cutting_width_cm', type: 'number', label: 'Schnittbreite (cm)' },
  {
    name: 'max_wood_diameter_mm',
    type: 'number',
    label: 'Ø Durchmesser Holzgut (mm)',
  },
  { name: 'blade_count', type: 'number', label: 'Anz. Klingen' },
  {
    name: 'standard_tools',
    type: 'select',
    label: 'Serienmäßige Werkzeuge',
    options: [
      { label: 'Schlegel', value: 'schlegel' },
      { label: 'Hammermesser', value: 'hammermesser' },
    ],
  },
  { name: 'flail_weight_kg', type: 'number', label: 'Schlegel Gewicht (kg)' },
  {
    name: 'cutting_width_cm_detail',
    type: 'number',
    label: 'Schnittbreite Detail (cm)',
  },

  // ─────────────────────────────────────────
  // Ausstattung
  // ─────────────────────────────────────────
  {
    name: 'counter_blade_rows',
    type: 'number',
    label: 'Gegenmesser (Reihen)',
  },
  {
    name: 'hydraulic_piston_shifting',
    type: 'checkbox',
    label: 'Hydraulische Kolben für die Verschiebung',
  },
  {
    name: 'support_roller',
    type: 'checkbox',
    label: 'Stützwalze',
  },

  // ─────────────────────────────────────────
  // Lieferumfang/Gratis-Zubehör
  // ─────────────────────────────────────────
  {
    name: 'wooden_pallet_included',
    type: 'checkbox',
    label: 'Holzpalette (sichere Lieferung)',
  },
  {
    name: 'side_skids',
    type: 'checkbox',
    label: 'Seitliche Kufen',
  },
  {
    name: 'cardan_shaft_included',
    type: 'checkbox',
    label: 'Kardanwelle im Lieferumfang',
  },
  {
    name: 'cardan_shaft',
    type: 'checkbox',
    label: 'Kardanwelle',
  },
  {
    name: 'manual_included',
    type: 'checkbox',
    label: 'Bedienungsanleitung',
  },

  // ─────────────────────────────────────────
  // Abmessungen
  // ─────────────────────────────────────────
  {
    name: 'product_length_cm',
    type: 'number',
    label: 'Abmessung Produkt Länge (cm)',
  },
  {
    name: 'product_width_cm',
    type: 'number',
    label: 'Abmessung Produkt Breite (cm)',
  },
  {
    name: 'product_height_cm',
    type: 'number',
    label: 'Abmessung Produkt Höhe (cm)',
  },
  { name: 'net_weight_kg', type: 'number', label: 'Nettogewicht (kg)' },
  {
    name: 'packaging_type',
    type: 'select',
    label: 'Verpackung',
    options: [
      { label: 'Auf Palette', value: 'auf_palette' },
      { label: 'Ohne Palette', value: 'ohne_palette' },
    ],
  },
  {
    name: 'packaging_length_cm',
    type: 'number',
    label: 'Abmessung Verpackung Länge (cm)',
  },
  {
    name: 'packaging_width_cm',
    type: 'number',
    label: 'Abmessung Verpackung Breite (cm)',
  },
  {
    name: 'packaging_height_cm',
    type: 'number',
    label: 'Abmessung Verpackung Höhe (cm)',
  },
  {
    name: 'total_weight_with_packaging_kg',
    type: 'number',
    label: 'Gesamtgewicht mit Verpackung (kg)',
  },
  {
    name: 'delivery_hydraulic_unloading_platform',
    type: 'checkbox',
    label: 'Lieferung mit hydraulischer Entladeplattform',
  },
  {
    name: 'assembly_time_minutes',
    type: 'number',
    label: 'Montagezeit (Minuten)',
  },
]
