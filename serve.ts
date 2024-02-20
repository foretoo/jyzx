import type { ServerWebSocket } from "bun"
import { watch } from "fs"


const dir = import.meta.dir

const htmlFile = Bun.file(dir + '/index.html')
const htmlContent = await htmlFile.text()

const reloadScriptContent = `<script>
    const injectScript = () => {
      const script = document.createElement('script')
      script.src = "./dist/example.js"
      document.body.append(script)
    }
    const ws = new WebSocket('ws://localhost')
    ws.onopen = () => {
      console.log('\\x1b[32mhmr enabled')
      injectScript()
    }
    ws.onmessage = location.reload
    ws.onerror = injectScript
  </script>`

Bun.write(htmlFile, htmlContent.replace(/<script.+><\/script>/, reloadScriptContent))

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
      return new Response(htmlFile)
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

const exit = () => {
  Bun.write(htmlFile, htmlContent)
  process.exit()
}
process.on('SIGINT', exit)
process.on('uncaughtException', exit)
