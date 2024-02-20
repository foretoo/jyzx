import { h, Fragment, useRef, useEffect } from './src'
import { compute, signal } from './src/signals'


const count = signal(0)
const inc = () => count.set(v => ++v)
const dec = () => count.set(v => --v)


const App = () => {

  const pre = useRef<HTMLPreElement>()

  // fires only once on mount
  useEffect(() => {
    console.log('App component mounted', pre.current)
  })

  return (
    <>
      <Header title='Counter app h2' bold />
      <main style={{ display: 'flex', gap: '20px' }}>
        <button onclick={inc}>+</button>
        <button onclick={dec}>-</button>
        <pre ref={pre}>{count}</pre>
      </main>
    </>
  )
}


const Header = ({ title, bold }: { title: string, bold?: boolean }) => {

  const label = compute(() => {
    const v = count()
    return title + ' ' + (v == 0 ? 'null' : v > 0 ? 'cool' : 'oops')
  })

  const onMount = (h2: HTMLHeadingElement) => {
    console.log('h2 element mounted', h2)
  }

  return <h2 ref={onMount} style={bold && { 'font-weight': 'bold' }}>{label}</h2>
}


document.body.appendChild(<App />)
