const express = require("express");
const promotionRouter = express.Router();

const Promotion = require("../models/promotion");

// Updates: For both the promotionRouter and promotionRouter, update the response to each defined endpoint using the new promotion and Promotion Models, exactly as you did with the campsiteRouter in the final two exercises this week.

// Test: Use Postman to test each of your updated endpoints and verify that you receive the expected responses. Don't forget your MongoDB server must be running.
// Test GET/POST/PUT/DELETE requests to: /promotions and /promotions/:promotionId
// For the POST request to /promotions, make sure to send a JSON string in the body of the request. Use the sample promotion document given in Task 1.
// For the PUT request to /promotions/:promotionId, make sure to send the same document, but with at least one field changed so that you can verify an update has been made.
// Repeat the same steps for testing /promotions and /promotions/:promotionId endpoints, using the sample promotion document given in Task 2.

promotionRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    // res.end("Will send all the promotions to you");
    Promotion.find()
      .then((promotions) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotions);
      })
      .catch((e) => {
        console.log(e);
      });
  })
  .post((req, res) => {
    // res.end(
    // `Will add the promotion: ${req.body.name} with description: ${req.body.description}`
    // );
    Promotion.create(req.body)
      .then((promotion) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotion);
      })
      .catch((e) => {
        console.log(e);
      });
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /promotions");
  })
  .delete((req, res) => {
    // res.end("Deleting all promotions");
    Promotion.deleteMany()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((e) => console.log(e));
  });

promotionRouter
  .route("/:promotionId")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    // res.end(`Will send details of the promotion: ${req.params.promotionId} to you`);
    Promotion.findById(req.params.promotionId)
      .then((promotion) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotion);
      })
      .catch((e) => console.log(e));
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /promotions/${req.params.promotionId}`
    );
  })
  .put((req, res) => {
    // res.write(`Updating the promotion: ${req.params.promotionId}\n`);
    // res.end(`Will update the promotion: ${req.body.name}
    // with description: ${req.body.description}`);
    Promotion.findByIdAndUpdate(
      req.params.promotionId,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    )
      .then((promotion) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotion);
      })
      .catch((e) => console.log(e));
  })
  .delete((req, res) => {
    // res.end(`Deleting promotion: ${req.params.promotionId}`);
    Promotion.findByIdAndDelete(req.params.promotionId)
      .then((promotion) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotion);
      })
      .catch((e) => console.log(e));
  });

module.exports = promotionRouter;
