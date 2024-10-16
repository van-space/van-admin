const Dashboard = () => {
  return (
    <>
      <h1>Dashboard</h1>
      <button
        type="button"
        onClick={() => {
          window.message('Hello from Dashboard')
        }}
      >
        Dashboard
      </button>
    </>
  )
}

export default Dashboard
