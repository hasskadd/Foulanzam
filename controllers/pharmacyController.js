const Pharmacy = require('../models/pharmacyModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.aliasTopPharmacy = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllPharmacies = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Pharmacy.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const pharmacies = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: pharmacies.length,
    data: {
      pharmacies,
    },
  });
});

exports.getPharmacy = catchAsync(async (req, res, next) => {
  const pharmacy = await Pharmacy.findById(req.params.id);

  if (!pharmacy) {
    return next(new AppError('No pharmacy found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      pharmacy,
    },
  });
});

exports.createPharmacy = catchAsync(async (req, res, next) => {
  const newPharmacy = await Pharmacy.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newPharmacy,
    },
  });
});

exports.updatePharmacy = catchAsync(async (req, res, next) => {
  const pharmacy = await Pharmacy.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!pharmacy) {
    return next(new AppError('No phamacy found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      pharmacy,
    },
  });
});

exports.deletePharmacy = catchAsync(async (req, res, next) => {
  const pharmacy = await Pharmacy.findByIdAndDelete(req.params.id);

  if (!pharmacy) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getPharmacyStats = catchAsync(async (req, res, next) => {
  const stats = await Pharmacy.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  // A modifier.....
});
