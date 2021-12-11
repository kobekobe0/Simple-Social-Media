import React from 'react'
import { db } from '../../../firebase'
import { BiSearch } from 'react-icons/bi'
import { Link, useLocation, useHistory } from 'react-router-dom'
import { Spinner } from 'react-bootstrap'
import './search.css'

function Search() {
    const [search, setSearch] = React.useState('')
    const [results, setResults] = React.useState([])
    const [noResults, setNoResults] = React.useState(false)
    const [spinner, setSpinner] = React.useState(false)
    const userRef = db.collection('users')
    const location = useLocation()
    const history = useHistory()

    const handleLink = (e) => {
        history.push(`/visit/${e}`)
    }

    const handleSearch = async (e) => {
        e.preventDefault()

        setSpinner(true)

        let temp = []

        if (search.length >= 3) {
            setNoResults(false)
            await userRef
                .where('username', '>=', search)
                .where('username', '<=', search + '\uf8ff')
                .get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        temp.push(doc.data())
                    })
                })
            Promise.resolve(setResults(temp))
        } else {
            alert('Search must be at least 4 characters long')
        }
        if (temp.length === 0) {
            setNoResults(true)
        }
        setSpinner(false)
    }

    return (
        <div className="search">
            <div className="searchWrapper">
                <form onSubmit={handleSearch} className="searchForm">
                    <input
                        type="text"
                        minLength="4"
                        maxLength="12"
                        placeholder="Search"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <BiSearch
                        onClick={handleSearch}
                        style={{ cursor: 'pointer' }}
                        size={40}
                    />
                </form>
                {noResults && <p style={{ fontWeight: '400' }}>No result</p>}
                {spinner && (
                    <Spinner animation="border" style={{ marginTop: '2rem' }} />
                )}
                <div className="results">
                    {results.map((result) => (
                        <div
                            className="resultCard"
                            onClick={() => handleLink(result.userId)}
                        >
                            <img src={result.profilePicture} alt="" />

                            <p>{result.username}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Search
