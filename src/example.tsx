import { h, Fragment, useRef, useEffect } from '.'


const App = () => {

  let count = 0
  const ref = useRef<HTMLPreElement>()

  const print = (count: number) => ref.current.textContent = `${count}`
  const inc = () => print(++count)
  const dec = () => print(--count)

  // fires only once on mount
  useEffect(() => {
    console.log('App component mounted')
  })

  return (
    <>
      <Header title='Counter app h2' bold />
      <main style={{ display: 'flex', gap: '20px' }}>
        <button onclick={inc}>+</button>
        <button onclick={dec}>-</button>
        <pre ref={ref}>{count}</pre>
      </main>
    </>
  )
}


type HeaderProps = { title: string, bold?: boolean }

const Header = ({ title, bold }: HeaderProps) => {
  const onMount = (h2: HTMLHeadingElement) => {
    console.log('h2 element mounted', h2)
  }
  return <h2 ref={onMount} style={bold && { 'font-weight': 'bold' }}>{title}</h2>
}


document.body.appendChild(<App />)
