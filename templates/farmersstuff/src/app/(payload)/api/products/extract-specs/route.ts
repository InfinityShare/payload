import { getPayload } from 'payload'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

const PRODUCT_TYPE_SCHEMAS: Record<string, object> = {
  tractor: {
    engine_type: 'string | null',
    power_hp: 'number | null',
    engine_cylinders: 'number | null',
    engine_bore_mm: 'number | null',
    engine_stroke_mm: 'number | null',
    engine_displacement_cc: 'number | null',
    engine_rated_rpm: 'number | null',
    engine_max_torque_nm: 'number | null',
    engine_max_torque_rpm: 'number | null',
    battery_voltage_v: 'number | null',
    battery_capacity_ah: 'number | null',
    alternator_output_a: 'number | null',
    trailer_socket: '"none" | "7pin" | "13pin" | null',
    hydraulics_auto_depth_control: 'boolean | null',
    hydraulics_position_control: 'boolean | null',
    three_point_category: '"I" | "II" | "III" | null',
    hydraulic_valves_count: 'number | null',
    lift_capacity_kg: 'number | null',
    brake_type: 'string | null',
    brake_activation: '"mechanical" | "hydraulic" | null',
    parking_brake: 'boolean | null',
    turning_circle_without_brakes_m: 'number | null',
    turning_circle_with_brakes_m: 'number | null',
    drive: '"2wd" | "4wd" | null',
    clutch_type: 'string | null',
    gearbox: 'string | null',
    transmission_type: 'string | null',
    min_speed_kmh: 'number | null',
    min_speed_rpm: 'number | null',
    max_speed_kmh: 'number | null',
    max_speed_rpm: 'number | null',
    tire_front: 'string | null',
    tire_rear: 'string | null',
    pto_speeds: 'string | null',
    pto_type: '"mechanical" | "hydraulic" | null',
    steering_type: '"mechanical" | "hydraulic" | null',
    weight_kg: 'number | null',
    wheelbase_mm: 'number | null',
    length_mm: 'number | null',
    width_mm: 'number | null',
    height_mm: 'number | null',
    ground_clearance_mm: 'number | null',
  },
  attachment: {
    mounting: '"3-punkt" | "frontlader" | "euroaufnahme" | null',
    capacity_l: 'number | null',
    lower_link_attachment: 'string | null',
    upper_link_attachment: 'string | null',
    frame: 'string | null',
    spreader_disc_diameter_cm: 'number | null',
    dimensions_length_cm: 'number | null',
    dimensions_width_cm: 'number | null',
    dimensions_height_cm: 'number | null',
    weight_kg: 'number | null',
    work_speed_min_km_h: 'number | null',
    work_speed_max_km_h: 'number | null',
    ready_to_use: 'boolean | null',
    required_hydraulic_flow_l_min: 'number | null',
    requires_rear_pto: 'boolean | null',
    compatible_hitch_category: '"i" | "ii" | "iii" | null',
  },
  construction: {
    operating_weight_kg: 'number | null',
    engine_power_hp: 'number | null',
    bucket_capacity_m3: 'number | null',
    max_reach_m: 'number | null',
    road_legal: 'boolean | null',
  },
  schlegel: {
    model: 'string | null',
    typology: '"mulcher" | "standardmulcher_heckanbau" | null',
    tractor_power_from_ps: 'number | null',
    tractor_power_to_ps: 'number | null',
    robustness_series: '"leicht" | "mittel" | "schwer" | null',
    mounting_type: '"feste_aufnahme" | "handgefuehrte_verschiebung" | null',
    manual_shifting: 'boolean | null',
    rotor_two_screws: 'boolean | null',
    three_point_category: '"kat1" | "kat2" | "kat1_und_2" | null',
    cardan_shaft_rotation: '"standard" | "rechtsdrehend" | "linksdrehend" | null',
    manufacturing_country: 'string | null',
    gearbox_integrated_freewheel: 'boolean | null',
    belt_lateral_transmission: 'number | null',
    cutting_width_cm: 'number | null',
    max_wood_diameter_mm: 'number | null',
    blade_count: 'number | null',
    standard_tools: '"schlegel" | "hammermesser" | null',
    flail_weight_kg: 'number | null',
    cutting_width_cm_detail: 'number | null',
    counter_blade_rows: 'number | null',
    hydraulic_piston_shifting: 'boolean | null',
    support_roller: 'boolean | null',
    wooden_pallet_included: 'boolean | null',
    side_skids: 'boolean | null',
    cardan_shaft_included: 'boolean | null',
    cardan_shaft: 'boolean | null',
    manual_included: 'boolean | null',
    product_length_cm: 'number | null',
    product_width_cm: 'number | null',
    product_height_cm: 'number | null',
    net_weight_kg: 'number | null',
    packaging_type: '"auf_palette" | "ohne_palette" | null',
    packaging_length_cm: 'number | null',
    packaging_width_cm: 'number | null',
    packaging_height_cm: 'number | null',
    total_weight_with_packaging_kg: 'number | null',
    delivery_hydraulic_unloading_platform: 'boolean | null',
    assembly_time_minutes: 'number | null',
  },
  frontladerZubehoer: {
    technicalData: {
      width: { value: 'number | null', unit: '"mm" | "cm" | "m" | null' },
      hydraulicCylinders: { value: 'number | null', unit: '"Stk" | null' },
      requiresDwConnection: 'boolean | null',
      weight: { value: 'number | null', unit: '"kg" | null' },
      mounting: '"euroaufnahme" | null',
      swivel: 'array of "hydraulisch" | "vorlauf" | "ruecklauf" | null',
      oilPressureTo: { value: 'number | null', unit: '"bar" | null' },
      driveType: '"manuell" | "hydraulisch" | null',
      hydraulicPower: { value: 'number | null', unit: '"l/min" | "bar" | "PS" | "kW" | null' },
      tractorPowerMin: { value: 'number | null', unit: '"PS" | "kW" | null' },
      tractorPowerMax: { value: 'number | null', unit: '"PS" | "kW" | null' },
      rpmPerMinute: { value: 'number | null', unit: '"U/min" | null' },
    },
    dimensions: {
      height: { value: 'number | null', unit: '"mm" | "cm" | "m" | null' },
      openingWidth: { value: 'number | null', unit: '"mm" | "cm" | "m" | null' },
      packagingDimensions: {
        length: { value: 'number | null', unit: '"mm" | "cm" | "m" | null' },
        width: { value: 'number | null', unit: '"mm" | "cm" | "m" | null' },
        height: { value: 'number | null', unit: '"mm" | "cm" | "m" | null' },
        weight: { value: 'number | null', unit: '"kg" | null' },
      },
    },
  },
  anhaenger: {
    axle_configuration: '"single_axle" | "tandem_axle" | null',
    function: 'array of "three_side_tipper" | null',
    technology: 'string | null',
    stvo_lighting: '"yes" | "no" | null',
    max_permitted_weight_kg: 'number | null',
    can_be_derated: '"yes" | "no" | null',
    equipment:
      'array of "massive_verzinkte_bordwaende" | "hoehen_verstellbare_deichsel" | "verzurroesen" | "gitteraufsatzbracke" | "plane" | null',
    delivery: '"assembled" | "final_assembly_required" | null',
    registration: 'array of "road_legal" | "100_kmh" | "tuv_new" | null',
    height_adjustable_support_leg: 'boolean | null',
    axle_type: '"pendelachsen" | "starrachse" | null',
    box_dimensions_inside: 'string | null',
    box_dimensions_outside: 'string | null',
    tires: 'string | null',
    hitch: {
      type: '"kugelkopf" | "ringzug" | null',
      ball_height_min_mm: 'number | null',
      ball_height_max_mm: 'number | null',
      eye_height_min_mm: 'number | null',
      eye_height_max_mm: 'number | null',
    },
  },
  excavator: {
    manufacturer: 'string | null',
    model: 'string | null',
    engine_type: 'string | null',
    cooling_type: 'string | null',
    engine_max_torque_nm: 'number | null',
    engine_max_rpm: 'number | null',
    fuel_tank_capacity_l: 'number | null',
    starter_voltage_v: 'number | null',
    max_speed_kmh: 'number | null',
    max_gradeability_deg: 'number | null',
    ground_pressure_kgf_cm2: 'number | null',
    dimensions_lxbxh_mm: 'string | null',
    track_dimensions_lxbxh_mm: 'string | null',
    weight_kg: 'number | null',
    hydraulic_oil_tank_capacity_l: 'number | null',
    hydraulic_oil_type: 'string | null',
    hydraulic_pump_type: 'string | null',
    hydraulic_working_pressure_bar: 'number | null',
    hydraulic_max_pressure_bar: 'number | null',
    hydraulic_flow_l_min: 'number | null',
    dig_depth_mm: 'number | null',
    dump_height_mm: 'number | null',
    reach_at_ground_mm: 'number | null',
    bucket_breakout_force_kg: 'number | null',
    swing_radius_deg: 'string | null',
    swing_speed_rpm: 'number | null',
    knickmatic_arm: 'boolean | null',
    hydraulic_adjustable_track: 'boolean | null',
    auxiliary_hydraulic_connection: 'boolean | null',
  },
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })

    const authHeader = req.headers.get('Authorization')
    const cookieHeader = req.headers.get('Cookie') ?? ''

    const { user } = await payload.auth({
      headers: new Headers({
        Authorization: authHeader ?? '',
        Cookie: cookieHeader,
      }),
    })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { text, productType, existingDescription, existingMetaDescription } = body as {
      text: string
      productType: string
      existingDescription?: string
      existingMetaDescription?: string
      existingDescriptionLong?: string
    }

    if (!text || !productType) {
      return NextResponse.json({ error: 'text and productType are required' }, { status: 400 })
    }

    const schema = PRODUCT_TYPE_SCHEMAS[productType]
    if (!schema) {
      return NextResponse.json({ error: `Unknown productType: ${productType}` }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENAI_API_KEY not configured' }, { status: 500 })
    }

    const systemPrompt = `Du bist ein Experte für landwirtschaftliche Maschinen und Geräte. 
Extrahiere technische Spezifikationen aus dem gegebenen Text und gib sie als strukturiertes JSON zurück.
Antworte NUR mit einem gültigen JSON-Objekt, ohne Markdown-Codeblöcke oder zusätzlichen Text.
Setze Felder auf null wenn die Information nicht im Text vorhanden ist.
Für select-Felder verwende nur die erlaubten Werte (in Anführungszeichen angegeben).
Für boolean-Felder: true wenn explizit vorhanden/ja, false wenn explizit nicht vorhanden/nein, null wenn unbekannt.`

    const userPrompt = `Produkttyp: ${productType}

Zu extrahierendes Schema (Feldname: erlaubter Typ):
${JSON.stringify(schema, null, 2)}

Eingabetext:
${text}

${
  existingDescription
    ? `Bestehende Kurzbeschreibung (ergänzen, nicht überschreiben):
${existingDescription}`
    : ''
}

${
  existingMetaDescription
    ? `Bestehende SEO-Beschreibung (ergänzen, nicht überschreiben):
${existingMetaDescription}`
    : ''
}

Gib ein JSON-Objekt mit folgenden Schlüsseln zurück:
- "specs": Objekt mit den extrahierten Spezifikationen gemäß Schema
- "description_short": Kurzbeschreibung (max. 300 Zeichen) – ergänze die bestehende um erkannte Highlights, überschreibe sie nicht vollständig. Wenn keine bestehende vorhanden, erstelle eine neue.
- "meta_description": SEO-Beschreibung (max. 160 Zeichen) – ergänze die bestehende um wichtige Keywords. Wenn keine bestehende vorhanden, erstelle eine neue.
- "description_long": Detailbeschreibung als Fließtext (max. 800 Zeichen) auf Basis der Kurzbeschreibung und der wichtigsten technischen Daten. Schreibe einen zusammenhängenden, verkaufsorientierten Text in deutscher Sprache. Kein Markdown, kein HTML, nur reiner Text.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: `OpenAI API error: ${errorText}` }, { status: 502 })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: 'No content from OpenAI' }, { status: 502 })
    }

    let parsed: {
      specs: Record<string, unknown>
      description_short?: string
      meta_description?: string
      description_long?: string
    }
    try {
      parsed = JSON.parse(content)
    } catch {
      return NextResponse.json({ error: 'Invalid JSON from OpenAI', raw: content }, { status: 502 })
    }

    return NextResponse.json({
      specs: parsed.specs ?? {},
      description_short: parsed.description_short ?? null,
      meta_description: parsed.meta_description ?? null,
      description_long: parsed.description_long ?? null,
    })
  } catch (err) {
    console.error('[extract-specs]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
