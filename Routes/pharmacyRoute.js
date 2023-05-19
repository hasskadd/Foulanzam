const express = require('express');
const pharmacyController = require('../controllers/pharmacyController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/top-5-cheap')
  .get(
    pharmacyController.aliasTopPharmacy,
    pharmacyController.getAllPharmacies
  );

router.route('pharmacie-stats').get(pharmacyController.getPharmacyStats);

router
  .route('/')
  .get(authController.protect, pharmacyController.getAllPharmacies)
  .post(pharmacyController.createPharmacy);

router
  .route('/:id')
  .get(pharmacyController.getPharmacy)
  .patch(pharmacyController.updatePharmacy)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    pharmacyController.deletePharmacy
  );

module.exports = router;
