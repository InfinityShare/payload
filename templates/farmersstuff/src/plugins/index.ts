import { payloadAiPlugin } from '@ai-stack/payloadcms'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { seoPlugin } from '@payloadcms/plugin-seo'
// import { bulkArticleGalleryPlugin } from 'payload-bulk-article-gallery'
import { payloadBulkimageimport } from 'payload-bulkimageimport'
import { payloadLexwareapi } from 'payload-lexwareapi'
import { Plugin } from 'payload'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { ecommercePlugin } from '@payloadcms/plugin-ecommerce'

import { stripeAdapter } from '@payloadcms/plugin-ecommerce/payments/stripe'

import { Page, Product } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { ProductsCollection } from '@/collections/Products'
import { adminOrPublishedStatus } from '@/access/adminOrPublishedStatus'
import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { customerOnlyFieldAccess } from '@/access/customerOnlyFieldAccess'
import { isAdmin } from '@/access/isAdmin'
import { isDocumentOwner } from '@/access/isDocumentOwner'

const generateTitle: GenerateTitle<Product | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Payload Ecommerce Template` : 'Payload Ecommerce Template'
}

const generateURL: GenerateURL<Product | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formSubmissionOverrides: {
      admin: {
        group: 'Content',
      },
    },
    formOverrides: {
      admin: {
        group: 'Content',
      },
    },
  }),
  ecommercePlugin({
    access: {
      adminOnlyFieldAccess,
      adminOrPublishedStatus,
      customerOnlyFieldAccess,
      isAdmin,
      isDocumentOwner,
    },
    customers: {
      slug: 'users',
    },
    payments: {
      paymentMethods: [
        stripeAdapter({
          secretKey: process.env.STRIPE_SECRET_KEY!,
          publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
          webhookSecret: process.env.STRIPE_WEBHOOKS_SIGNING_SECRET!,
        }),
      ],
    },
    products: {
      productsCollectionOverride: ProductsCollection,
    },
  }),
  // Must run after ecommercePlugin so the "products" collection exists when adding endpoints
  payloadLexwareapi({
    apiUrl: process.env.LEXWARE_API_URL,
    apiKey: process.env.LEXWARE_API_KEY,
    collections: {
      products: true,
    },
  }),
  // Must run after ecommercePlugin so the "products" collection exists.
  // Uncomment when payload-bulk-article-gallery is installed; requires articleNumber on products.
  // bulkArticleGalleryPlugin({
  //   productsCollection: 'products',
  //   mediaCollection: 'media',
  //   productArticleNumberField: 'articleNumber',
  //   productGalleryField: 'gallery',
  // }),
  payloadBulkimageimport({
    collections: {
      media: true,
    },
    productAssignment: {
      productsCollection: 'products',
      productArticleNumberField: 'articleNumber',
      productGalleryField: 'gallery',
      imageFieldInGallery: 'image',
    },
  }),
  // Payload AI Plugin – enable for collections and globals that use RichText
  payloadAiPlugin({
    collections: {
      pages: true,
      media: true,
      products: true,
    },
    globals: {
      header: true,
      footer: true,
      'shop-settings': true,
    },
    uploadCollectionSlug: 'media',
    debugging: false,
  }),
]
