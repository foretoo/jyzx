import { h, Fragment, useRef, useEffect } from '.'
import { compute, effect, signal } from './signal'


const count = signal(0)
const label = compute(() => count() == 0 ? 'null' : count() > 0 ? 'cool' : 'oops')


const App = () => {

  const ref = useRef<HTMLPreElement>()

  const inc = () => count(v => ++v)
  const dec = () => count(v => --v)

  // fires only once on mount
  useEffect(() => {
    effect(() => ref.current.textContent = `${count()}`)
    console.log('App component mounted')
  })

  return (
    <>
      <Header title='Counter app h2' bold />
      <main style={{ display: 'flex', gap: '20px' }}>
        <button onclick={inc}>+</button>
        <button onclick={dec}>-</button>
        <pre ref={ref}></pre>
      </main>
    </>
  )
}


type HeaderProps = { title: string, bold?: boolean }

const Header = ({ title, bold }: HeaderProps) => {
  const onMount = (h2: HTMLHeadingElement) => {
    label.watch(v => h2.textContent = title + ' ' + v)
    console.log('h2 element mounted', h2)
  }
  return <h2 ref={onMount} style={bold && { 'font-weight': 'bold' }}>{title + ' ' + label()}</h2>
}


document.body.appendChild(<App />)
