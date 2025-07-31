import { Schema } from 'effect'

/**
 * IATA Airport Code
 *
 * @see https://en.wikipedia.org/wiki/IATA_airport_code
 */
export class AirportCode extends Schema.TaggedClass<AirportCode>()('AirportCode', {
  value: Schema.Uppercase.pipe(
    Schema.pattern(/^[A-Z]{3}$/, {
      message: () => 'Airport code must be three uppercase letters (e.g., JFK, LAX, LHR).',
    }),
  ),
}) {
  constructor(props: { value: string }) {
    super({ value: props.value.toUpperCase() })
  }
}
