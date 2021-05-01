import { FormEvent, useState } from "react"
import { GetServerSideProps } from "next"
import Link from 'next/link'
import { useRouter } from "next/router"
import { Document } from 'prismic-javascript/types/documents'
import Prismic from 'prismic-javascript'
import PrismicDOM from 'prismic-dom'
import { client } from "@/lib/prismic"

interface SearchProps {
    searchResults: Document[]
}

export default function Search({ searchResults }: SearchProps) {
    const [search, setSearch] = useState('')
    const router = useRouter()
    
    function handleSearch(e: FormEvent) {
        e.preventDefault()

        // Quando a navegação não é pelo Link, ou seja, quando é programática
        // (imperativa), usamos o router.push.
        router.push(`/search?q=${encodeURIComponent(search)}`)
        
        setSearch('')
    }

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input
                    type="text" 
                    value={ search }
                    onChange={e => setSearch(e.target.value)} 
                />
                <button type="submit">Buscar</button>
            </form>
            <ul>
                {searchResults.map(prod => (
                  <li key={prod.id}>
                    <Link href={`/products/${ prod.uid }`}>
                        <a>
                        {PrismicDOM.RichText.asText(prod.data.title)}
                        </a>
                    </Link>
                  </li>
                ))}
            </ul>            
        </div>
    )
}

export const getServerSideProps: GetServerSideProps<SearchProps> = async (context) => {
    const { q } = context.query;

    if (!q) {
        return { 
            props: { searchResults: [] }
        }
    }

    const searchResults = await client().query([
        Prismic.Predicates.at('document.type', 'product'),
        Prismic.Predicates.fulltext('my.product.title', String(q))
    ])

    return {
        props: { 
            searchResults: searchResults.results
        }
    }
}
