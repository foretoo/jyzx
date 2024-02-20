import type { ServerWebSocket } from "bun"
import { watch } from "fs"


const dir = import.meta.dir + '/public'

const html = Bun.file(dir + '/index.html')

let htmlReloader = { send() {}} as any as ServerWebSocket<unknown>


//////// WATCHER

const msg = 'reload'
watch(dir, () => htmlReloader.send(msg))


//////// SERVER

Bun.serve({
  port: 80,

  websocket: {
    open(ws) { htmlReloader = ws },
    message() {},
  },

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
})

console.log('\nhttp://localhost\n')



//////// PROCESS

const exit = () => process.exit()
process.on('SIGINT', exit)
process.on('uncaughtException', exit)
