const path = require('path');
const express = require('express');
const xss = require('xss');
const VendorsService = require('./vendors-service');

const vendorsRouter = express.Router();
const jsonParser = express.json();

const serializevendors = vendors => ({
  id: vendors.id,
  user_id: vendors.user_id,
  name: vendors.name,
  description: vendors.description,
  streetaddress: xss(vendors.streetaddress),
  city: xss(vendors.city),
  state: xss(vendors.state),
  zip: xss(vendors.zip),
  phone: xss(vendors.phone),
  email: xss(vendors.email),
});

vendorsRouter
  .route('/')
  .get((req, res, next) => {
    VendorsService.getAllVendors(req.app.get('db'))
      .then(vendors => {
        res.json(vendors);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const {
      user_id,
      name,
      description,
      streetaddress,
      city,
      state,
      zip,
      phone,
      email,
    } = req.body;

    const newVendor = {
      user_id,
      name,
      description,
      streetaddress,
      city,
      state,
      zip,
      phone,
      email,
    };

    for (const [key, value] of Object.entries(newVendor))
      if (value == null)
        return res.status(400).json({
          error: {
            message: `Missing '${key}' in request body`,
          },
        });

    console.log(newVendor);

    VendorsService.insertVendors(req.app.get('db'), newVendor)
      .then(vendor => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${vendor.id}`))
          .json(vendor);
      })
      .catch(next);
  });

vendorsRouter
  .route('/:vendor_id')
  .all((req, res, next) => {
    VendorsService.getVendorsById(req.app.get('db'), req.params.vendor_id)
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
    res.json(serializevendors(res.vendors));
  })

  .delete((req, res, next) => {
    VendorsService.deleteVendorById(req.app.get('db'), req.params.vendor_id)
      .then(vendorRows => {
        res.status(204).json(vendorRows).end();
      })
      .catch(next);
  })

  .patch(jsonParser, (req, res, next) => {
    const {
      user_id,
      name,
      description,
      streetaddress,
      city,
      state,
      zip,
      phone,
      email,
    } = req.body;

    const vendorToUpdate = {
      user_id,
      name,
      description,
      streetaddress,
      city,
      state,
      zip,
      phone,
      email,
    };
    console.log(vendorToUpdate, 'hello');

    const numberOfValues = Object.values(vendorToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Missing 'name', 'description', 'streetaddress', 'state','zip', 'phone', 'email'`,
        },
      });
    }
    VendorsService.updateVendorById(
      req.app.get('db'),
      req.params.vendor_id,
      vendorToUpdate
    )
      .then(vendorToUpdate => {
        res.status(200).json(serializevendors(vendorToUpdate));
      })
      .catch(next);
  });

module.exports = vendorsRouter;