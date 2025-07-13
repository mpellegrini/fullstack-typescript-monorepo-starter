import { NodeSdk } from '@effect/opentelemetry'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { Config, Effect, Layer } from 'effect'

export const TracingLive = Layer.unwrapEffect(
  Effect.gen(function* () {
    const endpoint = yield* Config.option(Config.url('OTEL_EXPORTER_OTLP_ENDPOINT'))
    if (endpoint._tag === 'None') {
      yield* Effect.logWarning(
        'OpenTelemetry Exporter OTLP Endpoint not defined. OTEL Traces will not be exported.',
      )
      return Layer.empty
    }
    return NodeSdk.layer(() => ({
      resource: {
        serviceName: 'effect-api-server',
        serviceVersion: 'v1',
      },
      spanProcessor: new BatchSpanProcessor(
        new OTLPTraceExporter({ url: `${endpoint.value.origin}/v1/traces` }),
      ),
    }))
  }),
)
