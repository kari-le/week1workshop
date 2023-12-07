const express = require("express");
const partnerRouter = express.Router();

const Partner = require("../models/partner");

// Updates: For both the partnerRouter and promotionRouter, update the response to each defined endpoint using the new Partner and Promotion Models, exactly as you did with the campsiteRouter in the final two exercises this week.

// Test: Use Postman to test each of your updated endpoints and verify that you receive the expected responses. Don't forget your MongoDB server must be running.
// Test GET/POST/PUT/DELETE requests to: /partners and /partners/:partnerId
// For the POST request to /partners, make sure to send a JSON string in the body of the request. Use the sample partner document given in Task 1.
// For the PUT request to /partners/:partnerId, make sure to send the same document, but with at least one field changed so that you can verify an update has been made.
// Repeat the same steps for testing /promotions and /promotions/:promotionId endpoints, using the sample promotion document given in Task 2.

partnerRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    // res.end("Will send all the partners to you");
    Partner.find()
      .then((partners) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partners);
      })
      .catch((e) => {
        console.log(e);
      });
  })
  .post((req, res) => {
    // res.end(
    //   `Will add the partner: ${req.body.name} with description: ${req.body.description}`
    // );
    Partner.create(req.body)
      .then((partner) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partner);
      })
      .catch((e) => {
        console.log(e);
      });
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /partners");
  })
  .delete((req, res) => {
    // res.end("Deleting all partners");
    Partner.deleteMany()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((e) => console.log(e));
  });

partnerRouter
  .route("/:partnerId")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    // res.end(`Will send details of the partner: ${req.params.partnerId} to you`);
    Partner.findById(req.params.partnerId)
      .then((partner) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partner);
      })
      .catch((e) => console.log(e));
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /partners/${req.params.partnerId}`
    );
  })
  .put((req, res) => {
    // res.write(`Updating the partner: ${req.params.partnerId}\n`);
    // res.end(`Will update the partner: ${req.body.name}
    //         with description: ${req.body.description}`);
    Partner.findByIdAndUpdate(
      req.params.partnerId,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    )
      .then((partner) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partner);
      })
      .catch((e) => console.log(e));
  })
  .delete((req, res) => {
    // res.end(`Deleting partner: ${req.params.partnerId}`);
    Partner.findByIdAndDelete(req.params.partnerId)
      .then((partner) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(partner);
      })
      .catch((e) => console.log(e));
  });

module.exports = partnerRouter;
