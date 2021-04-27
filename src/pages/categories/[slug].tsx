import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'

type CategoryProps = {
    products: IProduct[]
}

interface IProduct {
    id: string
    title: string
}

export default function Category({ products }: CategoryProps) {
    const router = useRouter()

    // A página está sendo gerada? (em processo de renderização estática)
    if (router.isFallback) {  
        return <p>Carregando...</p>
    }

    return (
        <div>
            <h1>{ router.query.slug }</h1>
            <ul>
                {products.map(prod => (
                    <li key={ prod.id }>
                        { prod.title }
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
    const categories = await response.json()

    const paths = categories.map(category => {
        return {
            params: { slug: category.id }
        }
    })
    
    return {
        paths,               //paths: [],
        fallback: true
    }
}

export const getStaticProps: GetStaticProps<CategoryProps> = async (context) => {
    const { slug } = context.params

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?category_id=${slug}`) 
    const products = await response.json()

    return {
        props: { products },
        revalidate: 60  /* atualiza a cada 1 minuto */
    }
}
