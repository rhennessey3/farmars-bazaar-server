const path = require('path');
const express = require('express');
const xss = require('xss');
const VendorInventoryService = require('./vendor-inventory-service');

const authMiddleware = require('../middlerware/auth-middleware')
const vendorInventoryRouter = express.Router();
const jsonParser = express.json();


const serializevendorinventory = ([inventory]) => {
    return {
        id: inventory.id,
        item_name: inventory.item_name,
        item_description: inventory.item_description,
        item_count: inventory.item_count,
        item_price: inventory.item_price,
        item_img: inventory.item_img,
        vendor_id: inventory.vendor_id,
        date_created: inventory.date_created,
    }
};

vendorInventoryRouter
    .route('/')
    .get((req, res, next) => {
        VendorInventoryService
            .getVendorItems(req.app.get('db'))
            .then(vendors => {
                res.json(vendors);
            })
            .catch(next);
    })
    .post(jsonParser, authMiddleware, (req, res, next) => {

        const {
            name,
            img,
            description,
            itemCount,
            itemPrice
        } = req.body;

        const newVendorItem = {
            item_name: name,
            item_description: description,
            item_count: itemCount,
            item_price: itemPrice,
            item_img: img,
            vendor_id: req.user_id
        };

        for (const [key, value] of Object.entries(newVendorItem))
            if (value == null)
                return res.status(400).json({
                    error: {
                        message: `Missing '${key}' in request body`,
                    },
                });

        console.log(newVendorItem);

        VendorInventoryService.insertVendorItem(req.app.get('db'), newVendorItem)
            .then(vendor => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${vendor.id}`))
                    .json(vendor);
            })
            .catch(next);
    });

vendorInventoryRouter
    .route('/:vendor_id')
    .all((req, res, next) => {
        VendorInventoryService.getVendorItemById(
            req.app.get('db'),
            req.params.vendor_id
        )
            .then(vendors => {
                if (!vendors) {
                    return res.status(404).json({
                        error: { message: `Vendor doesn't exist` },
                    });
                }

                res.vendors = vendors; // save the vendor for the next middleware
                next(); // don't forget to call next so the next middleware happens!
            })
            .catch(next);
    })
    .get((req, res, next) => {
        res.json(serializevendorinventory(res.vendors));
    })

    .delete((req, res, next) => {
        VendorInventoryService.deleteVendorItem(
            req.app.get('db'),
            req.params.vendor_id
        )
            .then(vendorRows => {
                res.status(204).json(vendorRows).end();
            })
            .catch(next);
    })

    .patch(jsonParser, (req, res, next) => {
        const {
            id,
            item_name,
            item_description,
            item_count,
            item_price,
            item_img,
            vendor_id,
            date_created,
        } = req.body;

        const vendorInventoryToUpdate = {
            id,
            item_name,
            item_description,
            item_count,
            item_price,
            item_img,
            vendor_id,
            date_created,
        };
        console.log(vendorInventoryToUpdate, 'hello');

        const numberOfValues = Object.values(vendorInventoryToUpdate).filter(
            Boolean
        ).length;
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Missing "id", "item_name", "item_description", "item_count", "item_price", "item_img", "vendor_id", "date_created"'`,
                },
            });
        }
        VendorInventoryService.updateVendorItem(
            req.app.get('db'),
            req.params.vendor_id,
            vendorInventoryToUpdate
        )
            .then(vendorInventoryToUpdate => {
                res.status(200).json(serializevendorinventory(vendorInventoryToUpdate));
            })
            .catch(next);
    });

module.exports = vendorInventoryRouter;