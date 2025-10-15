/* eslint-disable */
/* tslint:disable */

/**
 * Mock Service Worker (2.4.14).
 * @see https://github.com/mswjs/msw
 * - Please do NOT modify this file.
 * - Please do NOT serve this file on production.
 */

const INTEGRITY_CHECKSUM = '0a6cbb7a5152aa99cde18b75ce1dc1ba'
const IS_MOCKED_RESPONSE = Symbol('isMockedResponse')
const activeClientIds = new Set()

self.addEventListener('install', function () {
  self.skipWaiting()
})

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('message', async function (event) {
  const clientId = event.source.id

  if (!clientId || !event.data) {
    return
  }

  const allClients = await self.clients.matchAll({
    type: 'window',
  })

  switch (event.data.type) {
    case 'KEEPALIVE_REQUEST': {
      sendToClient(clientId, {
        type: 'KEEPALIVE_RESPONSE',
      })
      break
    }

    case 'INTEGRITY_CHECK_REQUEST': {
      sendToClient(clientId, {
        type: 'INTEGRITY_CHECK_RESPONSE',
        payload: INTEGRITY_CHECKSUM,
      })
      break
    }

    case 'MOCK_ACTIVATE': {
      activeClientIds.add(clientId)

      sendToClient(clientId, {
        type: 'MOCKING_ENABLED',
        payload: true,
      })
      break
    }

    case 'MOCK_DEACTIVATE': {
      activeClientIds.delete(clientId)
      break
    }

    case 'CLIENT_CLOSED': {
      activeClientIds.delete(clientId)

      const remainingClients = allClients.filter((client) => {
        return client.id !== clientId
      })

      if (remainingClients.length === 0) {
        self.registration.unregister()
      }

      break
    }
  }
})

self.addEventListener('fetch', function (event) {
  const { request } = event

  if (request.mode === 'navigate') {
    return
  }

  if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') {
    return
  }

  if (activeClientIds.size === 0) {
    return
  }

  const requestId = crypto.randomUUID()

  event.respondWith(
    handleRequest(event, requestId).catch((error) => {
      console.error(
        '[MSW] Failed to mock a "%s" request to "%s": %s',
        request.method,
        request.url,
        error,
      )
    }),
  )
})

async function handleRequest(event, requestId) {
  const client = await event.target.clients.get(event.clientId)

  if (!client) {
    return passthrough(event.request)
  }

  if (!activeClientIds.has(client.id)) {
    return passthrough(event.request)
  }

  const clonedRequest = event.request.clone()

  sendToClient(
    client.id,
    {
      type: 'REQUEST',
      payload: {
        id: requestId,
        url: clonedRequest.url,
        mode: clonedRequest.mode,
        method: clonedRequest.method,
        headers: Object.fromEntries(clonedRequest.headers.entries()),
        cache: clonedRequest.cache,
        credentials: clonedRequest.credentials,
        destination: clonedRequest.destination,
        integrity: clonedRequest.integrity,
        redirect: clonedRequest.redirect,
        referrer: clonedRequest.referrer,
        referrerPolicy: clonedRequest.referrerPolicy,
        body: await clonedRequest.text(),
        keepalive: clonedRequest.keepalive,
      },
    },
    [event.resultingClientId],
  )

  const { data } = await nextMessageFrom(client, requestId)

  if (!data) {
    return passthrough(event.request)
  }

  if (data.type === 'MOCK_RESPONSE') {
    return respondWithMock(data.payload)
  }

  if (data.type === 'PASSTHROUGH') {
    return passthrough(event.request)
  }
}

function sendToClient(clientId, message, transferables = []) {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel()

    channel.port1.onmessage = (event) => {
      if (event.data && event.data.error) {
        return reject(event.data.error)
      }

      resolve(event.data)
    }

    self.clients
      .get(clientId)
      .then((client) => {
        if (!client) {
          return
        }

        client.postMessage(message, [channel.port2].concat(transferables))
      })
      .catch(reject)
  })
}

async function nextMessageFrom(client, requestId) {
  return new Promise((resolve) => {
    function listener(event) {
      if (
        event.data &&
        event.data.type === 'MOCK_RESPONSE' &&
        event.data.payload.requestId === requestId
      ) {
        client.removeEventListener('message', listener)
        resolve(event)
      }

      if (
        event.data &&
        event.data.type === 'PASSTHROUGH' &&
        event.data.payload.requestId === requestId
      ) {
        client.removeEventListener('message', listener)
        resolve(event)
      }
    }

    client.addEventListener('message', listener)
  })
}

function passthrough(request) {
  const headers = new Headers(request.headers)
  headers.delete('x-msw-intention')

  return fetch(request, { headers })
}

function respondWithMock(response) {
  const responseOptions = {
    status: response.status,
    statusText: response.statusText,
    headers: new Headers(response.headers),
  }

  const mockedResponse = new Response(response.body, responseOptions)

  Reflect.defineProperty(mockedResponse, IS_MOCKED_RESPONSE, {
    value: true,
    enumerable: true,
  })

  return mockedResponse
}
