function createBaseController(model) {
  return {
    getAll: async (req, res, next) => {
      try {
        const docs = await model.find({ isActive: true });
        res.json(docs);
      } catch (error) {
        return next(new (await import('../utils/appError.js')).default('Error fetching all: ' + error.message, 500));
      }
    },
    getById: async (req, res, next) => {
      try {
        const doc = await model.findOne({ _id: req.params.id, isActive: true });
        if (!doc) return next(new (await import('../utils/appError.js')).default('Not found', 404));
        res.json(doc);
      } catch (error) {
        return next(new (await import('../utils/appError.js')).default('Error fetching by id: ' + error.message, 500));
      }
    },
    delete: async (req, res, next) => {
      try {
        const doc = await model.findByIdAndUpdate(
          req.params.id,
          { 
            isActive: false,
            modifiedOn: new Date()
          },
          { new: true }
        );
        if (!doc) return next(new (await import('../utils/appError.js')).default('Not found', 404));
        res.json({ message: 'Deleted successfully', doc });
      } catch (error) {
        return next(new (await import('../utils/appError.js')).default('Error deleting: ' + error.message, 500));
      }
    }
  };
}

export default createBaseController;
