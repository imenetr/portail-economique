import { mongooseAdapter } from '@payloadcms/db-mongodb'
import path from 'path'
import { buildConfig, type PayloadRequest } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { defaultLexical } from '@/fields/defaultLexical'

import { Answers } from './collections/Answers'
import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { QuestionnaireEvents } from './collections/QuestionnaireEvents'
import { Questions } from './collections/Questions'
import { Recommendations } from './collections/Recommendations'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  endpoints: [
    {
      path: '/powerbi/questionnaire-events',
      method: 'get',
      handler: async (req) => {
        const hostname = new URL(req.url).hostname

        if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
          return Response.json(
            { error: 'This endpoint is available locally only.' },
            { status: 403 },
          )
        }

        const result = await req.payload.find({
          collection: 'questionnaire-events',
          depth: 1,
          limit: 10000,
          pagination: false,
          sort: 'createdAt',
          overrideAccess: true,
        })

        const docs = result.docs.map((event) => {
          const question =
            typeof event.question === 'object' && event.question
              ? event.question
              : null

          const answer =
            typeof event.answer === 'object' && event.answer
              ? event.answer
              : null

          const recommendation =
            typeof event.recommendation === 'object' &&
            event.recommendation
              ? event.recommendation
              : null

          return {
            id: event.id,
            sessionId: event.sessionId,
            eventType: event.eventType,
            sequence: event.sequence,
            createdAt: event.createdAt,

            questionId:
              typeof event.question === 'string'
                ? event.question
                : question?.id ?? null,

            question:
              question && 'title' in question
                ? question.title
                : null,

            answerId:
              typeof event.answer === 'string'
                ? event.answer
                : answer?.id ?? null,

            answer:
              answer && 'text' in answer
                ? answer.text
                : null,

            recommendationId:
              typeof event.recommendation === 'string'
                ? event.recommendation
                : recommendation?.id ?? null,

            recommendation:
              recommendation && 'title' in recommendation
                ? recommendation.title
                : null,
          }
        })

        return Response.json({
          docs,
          totalDocs: docs.length,
        })
      },
    },
  ],
  admin: {
  components: {
    beforeLogin: ['@/components/BeforeLogin'],
    beforeDashboard: ['@/components/BeforeDashboard'],
  },
  dashboard: {
  defaultLayout: () => [
    {
      widgetSlug: 'questionnaire-analytics',
      width: 'full',
    },
    {
      widgetSlug: 'collections',
      width: 'full',
    },
  ],
  widgets: [
    {
      slug: 'questionnaire-analytics',
      Component: '@/components/QuestionnaireAnalytics',
      minWidth: 'medium',
      maxWidth: 'full',
    },
  ],
},
  importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  collections: [Answers, Recommendations, QuestionnaireEvents, Questions, Pages, Posts, Media, Categories, Users],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
