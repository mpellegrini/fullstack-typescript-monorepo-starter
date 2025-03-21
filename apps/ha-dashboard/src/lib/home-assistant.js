import { createConnection, subscribeEntities } from 'home-assistant-js-websocket'

export class HomeAssistant {
  constructor(url, token) {
    this.url = url
    this.token = token
    this.connection = null
  }

  async callService(domain, service, serviceData) {
    if (!this.connection) {
      throw new Error('Not connected to Home Assistant')
    }

    return this.connection.sendMessagePromise({
      domain,
      service,
      service_data: serviceData,
      type: 'call_service',
    })
  }

  async connect() {
    this.connection = await createConnection({
      auth: {
        token: this.token,
      },
      setupRetry: 5, // Retry connection up to 5 times
    })
    return this.connection
  }

  async getStates() {
    if (!this.connection) {
      throw new Error('Not connected to Home Assistant')
    }

    // Use the subscribeEntities function to get all entities
    return new Promise((resolve) => {
      subscribeEntities(this.connection, (entities) => {
        resolve(entities)
      })
    })
  }
}
