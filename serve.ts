import type { ServerWebSocket } from "bun"
import { watch } from "fs"


const dir = import.meta.dir + '/public'

const html = Bun.file(dir + '/index.html')

let htmlWS: ServerWebSocket<string>


//////// WATCHER

watch(dir, () => htmlWS?.send(''))


//////// SERVER

Bun.serve({
  port: 80,

  async fetch(req, server) {
    server.upgrade(req)

    const path = new URL(req.url).pathname

    if (path === '/') {
      return new Response(html)
    }

    const file = Bun.file(dir + path)
    if (await file.exists()) {
      return new Response(file)
    }

    return new Response()
  },

  websocket: {
    open(ws: typeof htmlWS) { htmlWS = ws },
    message() {},
  }
})

console.log('\nhttp://localhost\n')



//////// PROCESS

const exit = () => process.exit()
process.on('SIGINT', exit)
process.on('uncaughtException', exit)
