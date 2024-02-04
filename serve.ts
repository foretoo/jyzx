const dir = './public'
const html = Bun.file(dir + '/index.html')

Bun.serve({
  port: 80,
  async fetch(req) {
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
