import Head from 'next/head'

interface SEOProps {
    title: string
    description?: string
    image?: string
    includeSufix?: boolean    // Inclui o sufixo DevCommerce no título?
    indexPage?: boolean       // A página vai ser inexada pelo Google?
}

// DevCommerce, o melhor lugar para comprar bla bla...
// Contato | DevCommerce
// Catálogo | DevCommerce

export default function SEO({ 
    title, 
    description, 
    image, 
    includeSufix = true,
    indexPage = true
}: SEOProps) {

    //const pageTitle = includeSufix ? `${title} | DevCommerce` : `${title}`
    const pageTitle = `${title} ${includeSufix ? '| DevCommerce' : ''}`
    const pageImage = image ? `${process.env.NEXT_PUBLIC_API_URL}/${image}` : null

    return (
        <Head>
            <title>{ pageTitle }</title>
            { description && <meta name="description" content={description} /> }
            { pageImage && <meta name="image" content={pageImage} /> }
            { !indexPage && <meta name="robots" content="noindex,nofollow" /> }
            <meta name="google" content="notranslate" />
        </Head>
    )
}