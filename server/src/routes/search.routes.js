const express = require('express');
const router = express.Router();
const controller = require('../controllers/search.controller');

/**
 * @swagger
 * /search/doctors:
 *   get:
 *     summary: Search for verified doctors
 *     tags: [Search]
 *     responses:
 *       200: { description: List of doctors }
 */
router.get('/doctors', controller.searchDoctors);

module.exports = router;
