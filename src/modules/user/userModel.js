import con from '../../config/constants'
import validator from 'validator'
import mongoose, { Schema } from 'mongoose'
const ObjectId = mongoose.Schema.Types.ObjectId
import { hashSync, compareSync } from 'bcrypt-nodejs'
import mongoosePaginate from 'mongoose-paginate'
import autopopulate from 'mongoose-autopopulate'
import uniqueValidator from 'mongoose-unique-validator'
import jwt from 'jsonwebtoken'
import _ from 'lodash'

import * as pluginService from '../../services/pluginService'
import { passwordReg } from '../../config/regex'

/**
 * @typedef users
 * @property {string} _id
 * @property {string} email
 * @property {string} name
 * @property {string} email
 * @property {string} name
 * @property {string} email
 * @property {string} name
 * @property {string} password
 */

let userSchema = new Schema(
	{
		email: {
			type: String,
			unique: true,
			required: [true, 'Email is required!'],
			trim: true,
			validate: {
				validator(email) {
					return validator.isEmail(email)
				},
				message: '{VALUE} is not a valid email!'
			}
		},
		password: {
			type: String,
			trim: true,
			minlength: [6, 'Password need to be longer!']
			// validate: {
			// 	validator(password) {
			// 		return passwordReg.test(password)
			// 	},
			// 	message: '{VALUE} is not a valid password!'
			// }
		},
		name: {
			type: String,
			default: 'User',
			trim: true
		},
		url: {
			type: String,
			unique: true,
			trim: true
		},
		provider: {
			type: String,
			trim: true
		},
		social: {
			type: Object,
			trim: true
		},
		gender: {
			type: Number,
			trim: true,
			default: 0
		},
		role: {
			type: String,
			trim: true,
			enum: ['viewer', 'user', 'contributor', 'editer', 'admin', 'superadmin'],
			default: 'user'
		},
		avatarUrl: {
			type: String,
			trim: true,
			default: 'https://png.pngtree.com/svg/20161027/631929649c.png'
		},
		token: {
			type: String,
			trim: true
		},
		uploadedCount: {
			type: Number,
			default: 0,
			trim: true
		}
	},
	{
		timestamps: true
	}
)

userSchema.set('autoIndex', true)

userSchema.index({
	name: 'text',
	email: 'text',
	gender: 'text'
})

userSchema.plugin(uniqueValidator, {
	message: '{VALUE} already taken!'
})

userSchema.pre('save', function(next) {
	if (this.isModified('password')) {
		this.password = this._hashPassword(this.password)
	}

	return next()
})

userSchema.statics = {
	incUploadedCount(userId) {
		return this.findByIdAndUpdate(userId, { $inc: { uploadedCount: 1 } })
	}
}

userSchema.methods = {
	_hashPassword(password) {
		return hashSync(password)
	},
	authenticateUser(password) {
		return compareSync(password, this.password)
	},
	createToken() {
		this.token =
			'JWT ' +
			jwt.sign(
				{
					_id: this._id,
					salt: Math.random()
				},
				con.JWT_SECRET,
				{
					expiresIn: '60d' // expires in 365 days
				}
			)
		this.save()
	},
	toJSON() {
		return _.pick(this, [
			'_id',
			'email',
			'name',
			'gender',
			'role',
			'avatarUrl',
			'provider',
			'uploadedCount'
		])
	},
	toAuthJSON() {
		this.createToken()
		return {
			...this.toJSON(),
			role: this.role,
			provider: this.provider,
			providerUrl: this.providerUrl,
			token: this.token
			// tokenExpiresAt: this.tokenExpiresAt
			// token: `JWT ${this.createToken()}`
		}
	}
}

userSchema.plugin(uniqueValidator, {
	message: '{VALUE} already taken!'
})

userSchema.plugin(mongoosePaginate)
userSchema.plugin(autopopulate)
userSchema.plugin(pluginService.logPost, { schemaName: 'User' })
userSchema.plugin(pluginService.setSlugUrl, { schemaName: 'User' })

export default mongoose.model('User', userSchema)
