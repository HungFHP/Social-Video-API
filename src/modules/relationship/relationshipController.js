import Relationship from './relationshipModel.js'
import HTTPStatus from 'http-status'
// eslint-disable-next-line no-unused-vars
import * as util from './relationshipUtil'
import { log } from '../../utils/helper'

/**
 * @group relationships - Operations about relationships
 *
 */

export async function createRequest(req, res, next) {
	try {
		let own = {
			_id: req.body.target
		}
		res.relationship = await Relationship.createRequest(own, req.user)

		next()
	} catch (e) {
		log(JSON.stringify(e), 'error-response.log')
		return res.status(HTTPStatus.BAD_REQUEST).json(e)
	}
}

export async function acceptRequest(req, res, next) {
	try {
		let request = {
			_id: req.body.target
		}
		res.relationship = await Relationship.acceptRequest(
			req.user, // user
			request
		)

		next()
	} catch (e) {
		log(JSON.stringify(e), 'error-response.log')
		return res.status(HTTPStatus.BAD_REQUEST).json(e)
	}
}

export async function rejectRequest(req, res, next) {
	try {
		let request = {
			_id: req.body.target
		}
		res.relationship = await Relationship.rejectRequest(
			req.user, // user
			request
		)

		next()
	} catch (e) {
		log(JSON.stringify(e), 'error-response.log')
		return res.status(HTTPStatus.BAD_REQUEST).json(e)
	}
}

export async function removeFriend(req, res, next) {
	try {
		let target = {
			_id: req.params.targetId
		}
		res.relationship = await Relationship.removeFriend(
			req.user, // user
			target
		)

		next()
	} catch (e) {
		log(JSON.stringify(e), 'error-response.log')
		return res.status(HTTPStatus.BAD_REQUEST).json(e)
	}
}

export async function checkStatus(req, res, next) {
	try {
		let target = {
			_id: req.params.targetId
		}
		res.relationshipStatus = {
			isRequester: await Relationship.isRequest(req.user, target),
			isFriend: await Relationship.isFriend(req.user, target),
			isRequested: await Relationship.isRequest(target, req.user)
		}

		next()
	} catch (e) {
		log(JSON.stringify(e), 'error-response.log')
		return res.status(HTTPStatus.BAD_REQUEST).json(e)
	}
}

export async function getRequestsByUserId(req, res, next) {
	try {
		let rs = await Relationship.findOne({
			user: req.params.id
		}).populate({
			path: 'requests',
			options: req.parsedParams
		})
		res.requests = rs.requests
		res.pagination = {
			...req.parsedParams,
			page: 'null. Please use limit argument for load more',
			total: rs.requestsCount
		}

		next()
	} catch (e) {
		log(JSON.stringify(e), 'error-response.log')
		return res.status(HTTPStatus.BAD_REQUEST).json(e)
	}
}

export async function getFriendsByUserId(req, res, next) {
	try {
		let rs = await Relationship.findOne({
			user: req.params.id
		}).populate({
			path: 'friends',
			options: req.parsedParams
		})
		res.friends = rs.friends
		res.pagination = {
			...req.parsedParams,
			page: 'null. Please use limit argument for load more',
			total: rs.friendsCount
		}

		next()
	} catch (e) {
		log(JSON.stringify(e), 'error-response.log')
		return res.status(HTTPStatus.BAD_REQUEST).json(e)
	}
}

export async function getRelationshipsStats(req, res, next) {
	try {
		res.relationshipsStats = {
			count: await Relationship.estimatedDocumentCount()
		}

		next()
	} catch (e) {
		log(JSON.stringify(e), 'error-response.log')
		return res.status(HTTPStatus.BAD_REQUEST).json(e)
	}
}

export async function getRelationships(req, res, next) {
	try {
		let { docs, ...pagination } = await Relationship.paginate(
			{ ...req.parsedParams.filters },
			req.parsedParams
		)

		res.relationships = docs
		res.pagination = pagination

		next()
	} catch (e) {
		log(JSON.stringify(e), 'error-response.log')
		return res.status(HTTPStatus.BAD_REQUEST).json(e)
	}
}

export async function getRelationshipById(req, res, next) {
	try {
		res.relationship = await Relationship.findById(req.params.id)

		next()
	} catch (e) {
		log(JSON.stringify(e), 'error-response.log')
		return res.status(HTTPStatus.BAD_REQUEST).json(e)
	}
}

export async function createRelationship(req, res, next) {
	try {
		res.relationship = await Relationship.create(req.body)

		next()
	} catch (e) {
		log(JSON.stringify(e), 'error-response.log')
		return res.status(HTTPStatus.BAD_REQUEST).json(e)
	}
}

export async function updateRelationship(req, res, next) {
	try {
		let relationship = await Relationship.findById(req.params.id)

		Object.keys(req.body).forEach(key => {
			relationship[key] = req.body[key]
		})
		await relationship.save()
		res.relationship = relationship

		next()
	} catch (e) {
		log(JSON.stringify(e), 'error-response.log')
		return res.status(HTTPStatus.BAD_REQUEST).json(e)
	}
}

export async function deleteRelationship(req, res, next) {
	try {
		const relationship = await Relationship.findById(req.params.id)

		await relationship.remove()

		next()
	} catch (e) {
		log(JSON.stringify(e), 'error-response.log')
		return res.status(HTTPStatus.BAD_REQUEST).json(e)
	}
}
