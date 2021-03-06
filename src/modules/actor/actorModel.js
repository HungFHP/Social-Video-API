/* eslint-disable no-unused-vars */
import validator from 'validator'
import mongoose, { Schema } from 'mongoose'
const ObjectId = mongoose.Schema.Types.ObjectId
import mongoosePaginate from 'mongoose-paginate'
import autopopulate from 'mongoose-autopopulate'
import uniqueValidator from 'mongoose-unique-validator'

import * as pluginService from '../../services/pluginService'
import * as myValid from './actorValidation'
let actorSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, 'Actor name is required!'],
			trim: true
		},
		slug: {
			type: String,
			required: [true, 'Actor slug is required!'],
			trim: true
		},
		url: {
			type: String,
			required: [true, 'Actor url is required!'],
			trim: true,
			unique: true
		},
		info: {
			type: String,
			trim: true
		},
		avatarUrl: {
			type: String,
			default: 'https://png.pngtree.com/svg/20161212/f93e57629c.svg',
			trim: true
		}
	},
	{
		timestamps: true
	}
)

actorSchema.plugin(uniqueValidator, {
	message: '{VALUE} already taken!'
})
actorSchema.plugin(mongoosePaginate)
actorSchema.plugin(autopopulate)
actorSchema.plugin(pluginService.logPost, { schemaName: 'Actor' })
actorSchema.plugin(pluginService.setSlugUrl, { schemaName: 'Actor' })

export default mongoose.model('Actor', actorSchema)
