import { useState, useEffect } from 'react'

function useFetch(url, token) {
    const [data, setData] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!url) return

        const fetchData = async () => {
        setCargando(true)
        try {
            const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
            })
            const json = await res.json()
            if (json.error) {
            setError(json.error)
            } else {
            setData(json)
            }
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setError('Error de conexión con el servidor')
        }
        setCargando(false)
        }

        fetchData()
    }, [url, token])

    return { data, cargando, error }
}

export default useFetch