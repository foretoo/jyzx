# jyzx
static jsx renderer, with a simple signals support


```jsx
import { h, Fragment, useRef, useEffect } from './src'
import { signal } from './src/signals'

const count = signal(0)

const App = () => {

  const h2 = useRef<HTMLHeadingElement>()

  // fires only once on mount
  useEffect(() => {
    h2.current.textContent = 'Counter app'
    console.log('App component mounted')
  })

  return (
    <>
      <h2 ref={h2}></h2>
      <section style={{ display: 'flex', gap: '1rem' }}>
        <button onclick={() => count.set(v => ++v)}>+</button>
        <button onclick={() => count.set(v => --v)}>-</button>
        {count}
      </section>
    </>
  )
}

document.body.appendChild(<App />)
```