import { FastifyInstance } from 'fastify'

import prisma from '../db/db_client'
import { serializer } from './middleware/pre_serializer'
import {
  queryData,
  initialQueryData,
  updatedQueryData,
} from './schemas/queryData.interface'
import { ApiError } from '../errors'

async function queryRoutes(app: FastifyInstance) {
  app.setReplySerializer(serializer)

  const log = app.log.child({ component: 'queryRoutes' })

  // ENDPOINT 2: Create a new query.

  app.post<{
    Body: initialQueryData
    Reply: queryData
  }>('', {
    async handler(req, reply) {
      log.debug('create new query')
      try {
        const { title, description, formDataId } = req.body
        const queryData = await prisma.query.create({
          data: {
            title,
            formDataId,
            description,
          },
        })
        reply.send(queryData)
      } catch (err: any) {
        log.error({ err }, err.message)
        throw new ApiError('failed to create new query', 400)
      }
    },
  })

  // ENDPOINT 3: Update an existing query by ID.
  // will include ability to change status as well as the description

  app.patch<{
    Body: updatedQueryData
    Reply: queryData
  }>('/update', {
    async handler(req, reply) {
      log.debug('Update a query')
      try {
        const { formDataId, description, status } = req.body
        const updateData: any = {}
        if (description !== undefined) updateData.description = description
        if (status !== undefined) updateData.status = 'RESOLVED'

        const queryData = await prisma.query.update({
          where: { formDataId },
          data: updateData,
        })
        reply.send(queryData)
      } catch (err: any) {
        log.error({ err }, err.message)
        throw new ApiError('failed to update query', 400)
      }
    },
  })
}

export default queryRoutes
