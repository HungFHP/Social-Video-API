/* eslint-disable no-unused-vars */
import { Router } from 'express'
import validate from 'express-validation'
import HTTPStatus from 'http-status'

import * as actorController from './actorController'
import actorValidation from './actorValidation'
import * as authService from '../../services/authService'
import * as paramService from '../../services/paramService'

const router = new Router()

/**
 * GET /items/stats => getActorsStats
 * GET /items => getActors
 * GET /items/:id => getActorById
 * POST /items/ => createActor
 * PATCH/PUT /items/:id => updateActor
 * DELETE /items/:id => deleteActor
 */

// More router
router.get('/init', authService.authJwt, actorController.default, function(
	req,
	res,
	next
) {
	return res.status(HTTPStatus.OK).json({
		data: res.actors
	})
})

// Default Rest router
router
	.get(
		'/stats',
		validate(actorValidation.stats),
		actorController.getActorsStats,
		function(req, res, next) {
			return res.status(HTTPStatus.OK).json({
				data: res.actorsStats
			})
		}
	)
	.get(
		'/',
		paramService.parseParam,
		validate(actorValidation.index),
		actorController.getActors,
		function(req, res, next) {
			return res.status(HTTPStatus.OK).json({
				data: res.actors,
				pagination: res.pagination
			})
		}
	)
	.get(
		'/:id',
		validate(actorValidation.show),
		actorController.getActorById,
		function(req, res, next) {
			return res.status(HTTPStatus.OK).json({
				data: res.actor
			})
		}
	)
	.post(
		'/',
		validate(actorValidation.create),
		actorController.createActor,
		function(req, res, next) {
			return res.status(HTTPStatus.OK).json({
				data: res.actor
			})
		}
	)
	.put(
		'/:id',
		validate(actorValidation.update),
		actorController.updateActor,
		function(req, res, next) {
			return res.status(HTTPStatus.OK).json({
				data: res.actor
			})
		}
	)
	.delete(
		'/:id',
		validate(actorValidation.delete),
		actorController.deleteActor,
		function(req, res, next) {
			return res.sendStatus(HTTPStatus.OK)
		}
	)

export default router
