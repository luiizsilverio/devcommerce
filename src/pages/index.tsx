import { GetServerSideProps } from 'next'
import Head from 'next/head'
//import { useEffect, useState } from 'react'
import { Title } from '@/styles/Home' //'../styles/Home'

type Product = {
  id: string;
  title: string;
}

type HomeProps = {
  products: Product[]
}

export default function Home({ products }: HomeProps) {

/*
  // Estratégia CSF - Client-Side Fetching, é renderizado no cliente
  const [products, setProducts] = useState<Product[]>([])
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/recommended`)
      .then(res => {
        res.json()
          .then(data => {
            setProducts(data)
          })
      })
  }, [])
*/

  return (
    <div>
      <section>
        <Title>Products</Title>
        <ul>
          {products.map(prod => (
            <li key={prod.id}>
              {prod.title}
            </li>
          )
        )}
        </ul>
      </section>
    </div>
  )
}

// Estratégia SSR - Server Side Rendering. No caso, na camada intermediária do Next
export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recommended`)
  const prods = await response.json()

  return {
    props: { products: prods }
  }
}
