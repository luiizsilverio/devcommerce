import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Prismic from 'prismic-javascript'
import PrismicDOM from 'prismic-dom'
import { Document } from 'prismic-javascript/types/documents'
import { client } from '@/lib/prismic'

interface ProductProps {
    product: Document
}

export default function Product({ product }: ProductProps) {
    const router = useRouter()

    if (router.isFallback) {
        return <p>Carregando...</p>
    }

    // dangerouslySetInnerHTML converte o texto em HTML

    console.log(product)
    return (
        <div>
            <h1>
                {PrismicDOM.RichText.asText(product.data.title)}
            </h1>            

            <img src={ product.data.thumbnail.url } 
                alt={ product.data.thumbnail.alt }
                width="300"              
            />

            <div dangerouslySetInnerHTML={{ __html: PrismicDOM.RichText.asHtml(product.data.description) }} />
            <p>Preço: R$ { product.data.price.toFixed(2) }</p>
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
    // como podem existir muitos produtos, não vale a pena
    // buscar no banco os produtos. => paths: []

    return {
        paths: [],
        fallback: true
    }
}

export const getStaticProps: GetStaticProps<ProductProps> = async (context) => {
    const { slug } = context.params

    const product = await client().getByUID('product', String(slug), {})

    return {
        props: { 
            product
        },
        revalidate: 60  /* atualiza a cada 1 minuto */
    }
}
