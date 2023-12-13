const express = require("express");
const Promotion = require("../models/promotions");
const authenticate = require("../authenticate");

const promotionRouter = express.Router();

promotionRouter
  .route("/")
  .options((req, res) => res.sendStatus(200))
  .get((req, res, next) => {
    res.end("Will send all the promotions to you");
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.end(`Will add the promotion: ${req.body.name} 
        with description: ${req.body.description} `);
  })
  .put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /promotions");
  })
  .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.end("Deleting all promotions");
  });

promotionRouter
  .route("/:promotionId")
  .options((req, res) => res.sendStatus(200))
  .get((req, res, next) => {
    res.end(
      `Will send details of the promotion: ${req.params.promotionId} to you`
    );
  })
  .post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /promotions/${req.params.promotionId}`
    );
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.write(`Updating the promotion: ${req.params.promotionId}\n`);
    res.end(`Will update the promotion: ${req.body.name} 
        with description: ${req.body.description}`);
  })
  .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.end(`Deleting promotion: ${req.params.promotionId}`);
  });

module.exports = promotionRouter;
