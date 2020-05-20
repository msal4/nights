import React, { FunctionComponent, useState, useEffect } from "react"
import { useAuth } from "~context/auth-context"
import { useHistory } from "react-router-dom"
import { Title as ITitle } from "~core/interfaces/title"
import { getMyList } from "~api/title"
import Title from "~components/Title"

const MyListPage: FunctionComponent = () => {
  const { titles, error } = useMyList()

  return (
    <>
      <h1 className="mb-10 text-6xl font-bold">My List</h1>
      <div className="flex flex-wrap">
        {titles && titles.map(title => <Title key={title.id} title={title} />)}
        {error && <div>{error.detail}</div>}
      </div>
    </>
  )
}

export const useMyList = () => {
  const { token } = useAuth()
  const history = useHistory()
  const [titles, setTitles] = useState<ITitle[]>(null)
  const [error, setError] = useState(null)

  if (!token) history.push("/login")

  const getTitles = async () => {
    try {
      const data = await getMyList()
      setTitles(data.results)

      // Cleanup
      error && setError(null)
    } catch (err) {
      setError(err)
    }
  }

  useEffect(() => {
    getTitles()
  }, [token])

  return { titles, error }
}

export default MyListPage
