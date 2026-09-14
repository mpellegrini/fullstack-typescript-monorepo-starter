import * as PgDrizzle from 'drizzle-orm/effect-postgres'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import { format } from 'sql-formatter'

const formatQuery = (query: string, params: readonly unknown[]): string =>
  format(query, {
    language: 'postgresql',
    params: Object.fromEntries(
      params.map((value, index) => [
        index + 1,
        typeof value === 'string' ? `'${value}'` : String(value),
      ]),
    ),
  })

/**
 * Drizzle query logger that pretty-prints each statement with its parameters
 * inlined and emits it through Effect's logging pipeline at DEBUG level, so
 * queries carry the surrounding fiber's log spans and annotations.
 */
export const QueryLoggerLive: Layer.Layer<PgDrizzle.EffectLogger> = Layer.succeed(
  PgDrizzle.EffectLogger,
  {
    logQuery: (query, params) =>
      Effect.suspend(() => Effect.logDebug(formatQuery(query, params))).pipe(
        Effect.annotateLogs({ 'db.statement': query }),
        Effect.withLogSpan('drizzle.query'),
      ),
  },
)

/**
 * A Layer that provides an EffectLogger with Effect-based logging.
 *
 * This layer logs queries using `Effect.log()` with annotations for the query
 * SQL and parameters. Use this when you want query logging integrated with
 * Effect's logging infrastructure.
 *
 * @example
 * ```ts
 * const db = yield* PgDrizzle.make({ relations }).pipe(
 *   Effect.provide(EffectLogger.layer),
 *   Effect.provide(PgDrizzle.DefaultServices),
 * );
 * ```
 */
// static layer = Layer.succeed(EffectLogger, { logQuery: Effect.fn("EffectLogger.logQuery")(function* (query, params) {
//     const stringifiedParams = params.map((p) => {
//       try {
//         return JSON.stringify(p);
//       } catch {
//         return String(p);
//       }
//     });
//     yield* Effect.log().pipe(Effect.annotateLogs({
//       query,
//       params: stringifiedParams
//     }));
//   }) });
// };
