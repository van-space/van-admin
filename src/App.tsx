import './App.css'

const App = () => {
  const [count, setCount] = useState(0)
  return (
    <div className="content">
      <h1 className="underline">Rsbuild with React</h1>
      <p>Start building amazing things with Rsbuild.</p>
      <button
        className="bg-white p-2 text-black"
        onClick={() => setCount((pre) => pre + 1)}
      >
        {count}
      </button>
    </div>
  )
}

export default App
