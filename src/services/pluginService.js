/* eslint-disable no-console */
import slugify from 'slugify'

export function logPost(schema, options) {
	schema.post('init', function(doc) {
		// console.log(
		// 	`${options.schemaName || 'Model'}: ${doc.name ||
		// 		doc.title ||
		// 		doc._id} has been initialized`
		// )
	})

	schema.post('validate', function(doc) {
		// console.log(
		// 	`${options.schemaName || 'Model'}: ${doc.name ||
		// 		doc.title ||
		// 		doc._id} has been validated`
		// )
	})

	schema.post('save', function(doc) {
		// console.log(
		// 	`${options.schemaName || 'Model'}: ${doc.name ||
		// 		doc.title ||
		// 		doc._id} has been saved`
		// )
	})

	schema.post('remove', function(doc) {
		// console.log(
		// 	`${options.schemaName || 'Model'}: ${doc.name ||
		// 		doc.title ||
		// 		doc._id} has been removed`
		// )
	})
}

// eslint-disable-next-line no-unused-vars
export function setSlugUrl(schema, options) {
	schema.pre('validate', function(next) {
		if (this.name || this.title) {
			if (schema.paths.slug) {
				this.slug = slugify(this.name || this.title, {
					lower: true
				})
			}
			if (schema.paths.url) {
				this.url = `${slugify(this.name || this.title, {
					lower: true
				})}_${String(this._id).slice(-6)}` // ObjectId.valueOf
			}
    }
    let nameOrigin = this.nameOrigin || ((this.name||this.title)+`_${String(this._id).slice(-6)}`)
			if (schema.paths.slugOrigin) {
				this.slugOrigin = slugify(nameOrigin)
			}
		next()
	})
}
