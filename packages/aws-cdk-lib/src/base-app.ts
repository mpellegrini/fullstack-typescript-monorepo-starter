import { type AppProps, App, Tags } from 'aws-cdk-lib'

export class BaseApp extends App {
  constructor(props: AppProps = {}) {
    super({
      ...props,
      // reset any of the following props back to recommended defaults
      analyticsReporting: false,
      autoSynth: false,
      stackTraces: false,
    })

    Tags.of(this).add('project', 'need to define project name')
  }
}
