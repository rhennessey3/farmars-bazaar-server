const VendorsService = {
  getAllVendors(db) {
    return db.from('vendors').select('*');
  },
  getVendorsById(db, vendors_id) {
    console.log('vendors_id', vendors_id);
    return db.from('vendors').select('*').where({
      id: vendors_id,
    });
    // .first()
  },
  insertVendors(db, newVendor) {
    return db
      .insert(newVendor)
      .into('vendors')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  deleteVendorById(db, vendors_id) {
    return db('vendors')
      .where({
        id: vendors_id,
      })
      .delete();
  },

  updateVendorById(db, vendors_id, newVendor) {
    console.log(vendors_id, newVendor, 'hi');
    return db('vendors')
      .update(newVendor, (returning = true))
      .where({
        id: vendors_id,
      })
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
};
module.exports = VendorsService;