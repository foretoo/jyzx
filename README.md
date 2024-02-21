# jyzx — static jsx renderer
- well typed
- immodestly small
- supports useRef and useEffect hooks
- combined with a basic signals functionality.


```jsx
import { h, Fragment, useRef, useEffect } from './src'
import { signal } from './src/signals'

const count = signal(0)

const App = (props: { title: string }) => {

  const ref = useRef<HTMLHeadingElement>()

  // fires only once on mount
  useEffect(() => {
    console.log('App component mounted')

    let i = 0
    const dots = [ '.', '..', '...' ]
    setInterval(() => ref.current.textContent = props.title + dots[i++ % 3], 1000)
  })

  return (
    <>
      <h2 ref={ref}>{props.title}</h2>
      <section style={{ display: 'flex', gap: '1rem' }}>
        <button onclick={() => count.set(v => ++v)}>+</button>
        <button onclick={() => count.set(v => --v)}>-</button>
        {count}
      </section>
    </>
  )
}

document.body.appendChild(<App title="Counter app" />)
```
