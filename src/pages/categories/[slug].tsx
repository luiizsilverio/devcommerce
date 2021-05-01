import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Prismic from 'prismic-javascript'
import PrismicDOM from 'prismic-dom'
import { Document } from 'prismic-javascript/types/documents'
import { client } from '@/lib/prismic'

interface CategoryProps {
    category: Document
    products: Document[]
}

export default function Category({ category, products }: CategoryProps) {
    const router = useRouter()

    // A página está sendo gerada? (em processo de renderização estática)
    if (router.isFallback) {  
        return <p>Carregando...</p>
    }

    return (
        <div>
            <h1>
                {PrismicDOM.RichText.asText(category.data.title)}
            </h1>
            <ul>
               {products.map(prod => (
                 <li key={ prod.id }>
                   <Link href={`/products/${ prod.uid }`}>
                      <a>
                        {PrismicDOM.RichText.asText(prod.data.title)}
                      </a>
                   </Link>
                 </li>
                 )
               )}
            </ul>
        </div>
    )
}

// Como a página é dinâmica (recebe o parâmetro [slug]), 
// precisamos exportar o getStaticPaths.
// O yarn build vai criar uma página estática p/ cada categoria
// fallback: true - significa que, se for adicionada alguma
// categoria após o build, o Next vai gerar automaticamente essa
// página estática. Não esquecer de testar o fallback:
// if (router.isFallback) {  Carregando...

// Ao invés de chamar a API, podemos retornar paths: [] e
// deixar que as páginas sejam carregadas conforme sejam
// acessadas. Se a tabela for muito grande, é melhor paths: []

export const getStaticPaths: GetStaticPaths = async () => {
    //const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
    //const categories = await response.json()

    const categories = await client().query([
        Prismic.Predicates.at('document.type', 'category'),        
    ])

    const paths = categories.results.map(category => {
        return {
            params: { slug: category.uid }
        }
    })
    
    return {
        paths,               //paths: [],
        fallback: true
    }
}

export const getStaticProps: GetStaticProps<CategoryProps> = async (context) => {
    const { slug } = context.params

    const category = await client().getByUID('category', String(slug), {})

    const products = await client().query([
        Prismic.Predicates.at('document.type', 'product'),
        Prismic.Predicates.at('my.product.category', category.id)
    ])

    return {
        props: { 
            category, 
            products: products.results 
        },
        revalidate: 60  /* atualiza a cada 1 minuto */
    }
}
