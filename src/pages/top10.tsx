import { GetStaticPaths, GetStaticProps } from 'next'
import { Title } from '@/styles/Home' //../styles/Home

type Product = {
    id: string;
    title: string;
}

type Top10Props = {
    products: Product[];
}

export default function Top10({ products }: Top10Props ) {
    return (
        <div>
            <Title>Top 10</Title>
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

// Como a página não é dinâmica (não recebe parâmetro), 
// não precisamos exportar o getStaticPaths.

export const getStaticProps: GetStaticProps<Top10Props> = async (ctx) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
    const products = await response.json()

    return {
        props: { products },
        revalidate: 60 * 60  /* atualiza a cada 1 hora */
    }
}