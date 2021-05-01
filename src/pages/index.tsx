import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { Title } from '@/styles/Home' //'../styles/Home'
import SEO from '@/components/SEO'
import { client } from '@/lib/prismic'
import Prismic from 'prismic-javascript'
import PrismicDOM from 'prismic-dom'
import { Document } from 'prismic-javascript/types/documents'

type HomeProps = {
  products: Document[]
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
      <SEO 
        title='DevCommerce' 
        description='A melhor loja de roupas para Devs' 
        includeSufix={false} 
        image='nextjs-reactjs.png'
      />

      <section>
        <Title>Products</Title>
        <ul>
          {products.map(prod => (
            <li key={prod.id}>
              <Link href={`/products/${ prod.uid }`}>
                <a>
                  {PrismicDOM.RichText.asText(prod.data.title)}
                </a>
              </Link>
            </li>
          )
        )}
        </ul>
      </section>
    </div>
  )
}

// Estratégia SSR - Server Side Rendering. 
// No caso, na camada intermediária do Next
export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {

// Buscando os dados da API fake
// const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recommended`)
// const prods = await response.json()

// Buscando os dados do Prismic
  const prods = await client().query([
    Prismic.Predicates.at('document.type', 'product') // todos os documentos do tipo product
  ])
  
  return {
    props: { products: prods.results }
  }
}
