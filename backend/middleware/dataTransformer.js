// middleware/dataTransformer.js

/**
 * Middleware to ensure numeric fields are properly typed in the response
 */
const transformEsopData = (req, res, next) => {
  const originalJson = res.json;
  
  res.json = function(data) {
    // Only transform ESOP data responses
    if (data && data.status === 'success' && Array.isArray(data.data)) {
      console.log(`Transforming ${data.data.length} ESOP records`);
      
      // Transform string numbers to actual numbers
      data.data = data.data.map(record => {
        if (typeof record.toObject === 'function') {
          record = record.toObject();
        }
        
        return {
          ...record,
          totalGrants: Number(record.totalGrants || 0),
          vested: Number(record.vested || 0),
          unvested: Number(record.unvested || 0),
          exercised: Number(record.exercised || 0),
          exercisePrice: Number(record.exercisePrice || 0),
          // Add any computed fields if needed
        };
      });
      
      console.log('Data transformation complete');
    }
    
    return originalJson.call(this, data);
  };
  
  next();
};

module.exports = { transformEsopData };
