import { Schema } from 'effect'

/**
 * IATA Airline Designator
 *
 * * @see https://en.wikipedia.org/wiki/Airline_codes#IATA_airline_designator
 */
export class AirlineDesignator extends Schema.TaggedClass<AirlineDesignator>()(
  'AirlineDesignator',
  {
    value: Schema.Uppercase.pipe(
      Schema.pattern(/^[A-Z0-9]{2}$/, {
        message: () => "Airline designator must be two alphanumeric characters (e.g., 'G4', 'DL').",
      }),
    ),
  },
) {
  constructor(props: { value: string }) {
    super({ value: props.value.toUpperCase() })
  }
}
