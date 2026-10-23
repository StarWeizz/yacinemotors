import config from '@payload-config'
import { NotFoundPage } from '@payloadcms/next/views'
import type { Metadata } from 'next'
import { importMap } from '../importMap'

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

export const generateMetadata = (): Promise<Metadata> => Promise.resolve({ title: 'Introuvable' })

const NotFound = ({ params, searchParams }: Args) =>
  NotFoundPage({ config, params, searchParams, importMap })

export default NotFound
