import React, { useEffect, useState } from 'react'

function App() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetch('http://localhost:8080/users')
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => console.log(err));
  }, [])

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>name</th>
            <th>email</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td>{d.user_id}</td>
              <td>{d.name}</td>
              <td>{d.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App