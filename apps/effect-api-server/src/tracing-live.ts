import { NodeSdk } from '@effect/opentelemetry'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { Config, Effect, Layer, Option } from 'effect'

export const TracingLive = Config.option(Config.url('OTEL_EXPORTER_OTLP_ENDPOINT')).pipe(
  Effect.flatMap(
    Option.match({
      onNone: () =>
        Effect.logWarning(
          'OpenTelemetry Exporter OTLP Endpoint not defined. OTEL Traces will not be exported.',
        ).pipe(Effect.as(Layer.empty)),
      onSome: (endpoint) =>
        Effect.succeed(
          NodeSdk.layer(() => ({
            resource: {
              serviceName: 'effect-api-server',
              serviceVersion: 'v1',
            },
            spanProcessor: new BatchSpanProcessor(
              new OTLPTraceExporter({ url: `${endpoint.origin}/v1/traces` }),
            ),
          })),
        ),
    }),
  ),
  Layer.unwrap,
)
