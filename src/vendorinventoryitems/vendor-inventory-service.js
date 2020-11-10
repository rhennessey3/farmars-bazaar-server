const VendorInventoryService = {
    getVendorItems(db) {
        return db.from('vendorinventoryitems').select('*');
    },
    getVendorItemById(db, vendors_id) {
        return db.from('vendorinventoryitems').select('*').where({
            id: vendors_id,
        });
        // .first()
    },
    insertVendorItem(db, newVendorItem) {
        return db
            .insert(newVendorItem)
            .into('vendorinventoryitems')
            .returning('*')
            .then(rows => {
                return rows[0];
            });
    },

    deleteVendorItem(db, vendors_id) {
        return db('vendorinventoryitems')
            .where({
                id: vendors_id,
            })
            .delete();
    },

    updateVendorItem(db, vendors_id, newVendorItem) {
        console.log(vendors_id, newVendorItem, 'hi');
        return db('vendorinventoryitems')
            .update(newVendorItem, (returning = true))
            .where({
                id: vendors_id,
            })
            .returning('*')
            .then(rows => {
                return rows[0];
            });
    },
};
module.exports = VendorInventoryService;