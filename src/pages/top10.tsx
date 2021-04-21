import { GetStaticProps } from 'next'
import { Title } from '../styles/Home'

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
                    <li key={prod.id}>
                    {prod.title}
                    </li>
                    )
                )}
            </ul>
        </div>
    )
}

export const getStaticProps: GetStaticProps<Top10Props> = async (ctx) => {
    const response = await fetch('http://localhost:3333/products')
    const products = await response.json()

    return {
        props: { products },
        revalidate: 60 * 60  /* atualiza a cada 1 hora */
    }
}