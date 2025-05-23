"use server"

import {NewResourceParams, insertResourceSchema, resources} from '@/lib/db/schemas/resources'
import {db} from '@/lib/db'

export const createResource = async (input: NewResourceParams) => {
  try{
    const {content} = insertResourceSchema.parse(input)

    const [resource] = await db.insert(resources).values({content}).returning()

    return 'Resource created successfully'
  }catch(e){
    if(e instanceof Error){
      return e.message.length > 0 ? e.message : 'Error, please try again.'
    }
  }
}