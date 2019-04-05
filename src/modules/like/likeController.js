import Like from './likeModel.js'
import HTTPStatus from 'http-status'
// eslint-disable-next-line no-unused-vars
import * as util from './likeUtil'

/**
 * @group likes - Operations about likes
 *
 */

export async function getLikesStats(req, res, next) {
	try {
		res.likesStats = {
			count: await Like.estimatedDocumentCount()
		}

		next()
	} catch (e) {
		return res.status(HTTPStatus.BAD_REQUEST).json(e)
	}
}

export async function getLikes(req, res, next) {
	try {
		let { docs, ...likesMeta } = await Like.paginate({}, req.parsedParams)

		res.likes = docs
		res.likesMeta = likesMeta

		next()
	} catch (e) {
		return res.status(HTTPStatus.BAD_REQUEST).json(e)
	}
}

export async function getLikeById(req, res, next) {
	try {
		res.like = await Like.findById(req.params.id)

		next()
	} catch (e) {
		return res.status(HTTPStatus.BAD_REQUEST).json(e)
	}
}

export async function createLike(req, res, next) {
	try {
		res.like = await Like.create(req.body)

		next()
	} catch (e) {
		return res.status(HTTPStatus.BAD_REQUEST).json(e)
	}
}

export async function updateLike(req, res, next) {
	try {
		let like = await Like.findById(req.params.id)

		Object.keys(req.body).forEach(key => {
			like[key] = req.body[key]
		})
		await like.save()
		res.like = like

		next()
	} catch (e) {
		return res.status(HTTPStatus.BAD_REQUEST).json(e)
	}
}

export async function deleteLike(req, res, next) {
	try {
		const like = await Like.findById(req.params.id)

		await like.remove()

		next()
	} catch (e) {
		return res.status(HTTPStatus.BAD_REQUEST).json(e)
	}
}