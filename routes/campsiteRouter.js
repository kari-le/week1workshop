const express = require("express");
const Campsite = require("../models/campsite");
const authenticate = require("../authenticate");

const campsiteRouter = express.Router();

campsiteRouter
  .route("/")
  .options((req, res) => res.sendStatus(200))
  .get((req, res, next) => {
    Campsite.find()
      .populate("comments.author")
      .then((campsites) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(campsites);
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Campsite.create(req.body)
      .then((campsite) => {
        console.log("Campsite Created ", campsite);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(campsite);
      })
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /campsites");
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Campsite.deleteMany()
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch((err) => next(err));
    }
  );

campsiteRouter
  .route("/:campsiteId")
  .options((req, res) => res.sendStatus(200))
  .get((req, res, next) => {
    Campsite.findById(req.params.campsiteId)
      .populate("comments.author")
      .then((campsite) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(campsite);
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /campsites/${req.params.campsiteId}`
    );
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Campsite.findByIdAndUpdate(
      req.params.campsiteId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then((campsite) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(campsite);
      })
      .catch((err) => next(err));
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Campsite.findByIdAndDelete(req.params.campsiteId)
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch((err) => next(err));
    }
  );

campsiteRouter
  .route("/:campsiteId/comments")
  .options((req, res) => res.sendStatus(200))
  .get((req, res, next) => {
    Campsite.findById(req.params.campsiteId)
      .populate("comments.author")
      .then((campsite) => {
        if (campsite) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(campsite.comments);
        } else {
          err = new Error(`Campsite ${req.params.campsiteId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
      .then((campsite) => {
        if (campsite) {
          req.body.author = req.user._id;
          campsite.comments.push(req.body);
          campsite
            .save()
            .then((campsite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(campsite);
            })
            .catch((err) => next(err));
        } else {
          err = new Error(`Campsite ${req.params.campsiteId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(
      `PUT operation not supported on /campsites/${req.params.campsiteId}/comments`
    );
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Campsite.findById(req.params.campsiteId)
        .then((campsite) => {
          if (campsite) {
            for (let i = campsite.comments.length - 1; i >= 0; i--) {
              campsite.comments.id(campsite.comments[i]._id).remove();
            }
            campsite
              .save()
              .then((campsite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(campsite);
              })
              .catch((err) => next(err));
          } else {
            err = new Error(`Campsite ${req.params.campsiteId} not found`);
            err.status = 404;
            return next(err);
          }
        })
        .catch((err) => next(err));
    }
  );

campsiteRouter
  .route("/:campsiteId/comments/:commentId")
  .options((req, res) => res.sendStatus(200))
  .get((req, res, next) => {
    Campsite.findById(req.params.campsiteId)
      .populate("comments.author")
      .then((campsite) => {
        if (campsite && campsite.comments.id(req.params.commentId)) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(campsite.comments.id(req.params.commentId));
        } else if (!campsite) {
          err = new Error(`Campsite ${req.params.campsiteId} not found`);
          err.status = 404;
          return next(err);
        } else {
          err = new Error(`Comment ${req.params.commentId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /campsites/${req.params.campsiteId}/comments/${req.params.commentId}`
    );
  })
  .put(
    // Updating/deleting comments: Allow logged-in users to update or delete any comments that they themselves submitted.
    authenticate.verifyUser,
    (req, res) => {
      Campsite.findById(req.params.campsiteId)
        .then(
          // Campsite found, run this function
          (campsite) => {
            // Make sure campsite and campsite comment exists
            if (campsite && campsite.comments.id(req.params.commentId)) {
              // Does the campsite comment user match the comment author ID? If it does do this: . If it doesn't do that.
              if (
                campsite.comments
                  .id(req.params.commentId)
                  .author.equals(req.user._id)
              ) {
                // Has rating been submitted?
                if (req.body.rating) {
                  campsite.comment.id(req.params.commentId).rating =
                    req.body.rating;
                }
                // Has text been submitted for edits?
                if (req.body.text) {
                  campsite.comment.id(req.params.commentId).text =
                    req.body.text;
                }
                campsite
                  .save()
                  .then((campsite) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(campsite);
                  })
                  .catch((err) => next(err));
              }
            } else if (!campsite) {
              const err = new Error("Campsite not found!");
              err.status = 404;
              return next(err);
            } else {
              const err = new Error("Comment not found!");
              err.status = 404;
              return next(err);
            }
          }
        )
        .catch((error) => next(error));
      // Recall that the comment already stores the author's _id field as an ObjectId.
      // When a user attempts to perform a PUT or DELETE operation on the campsites/:campsiteId/comments/:commentId path,
      // check to ensure that the user is that particular comment's author.
      // If so, then allow the operation to proceed.
      // If not, then respond with a 403 status code.
    }
  )
  .delete(authenticate.verifyUser, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
      .then((campsite) => {
        if (campsite && campsite.comments.id(req.params.commentId)) {
          if (
            campsite.comments
              .id(req.params.commentId)
              .author.equals(req.user._id)
          ) {
            campsite.comments.id(req.params.commentId).remove();
            campsite
              .save()
              .then((campsite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(campsite);
              })
              .catch((err) => {
                next(err);
              });
          } else {
            const err = new Error(
              "You're not authorized to delete this comment!"
            );
            err.status = 403;
            return next(err);
          }
        } else if (!campsite) {
          const err = new Error("Campsite not found!");
          err.status = 404;
          return next(err);
        } else {
          const err = new Error("Comment not found!");
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });
// Task 4 comments
// Updating/deleting comments: Allow logged-in users to update or delete any comments that they themselves submitted.
// Recall that the comment already stores the author's _id field as an ObjectId.
// When a user attempts to perform a PUT or DELETE operation on the campsites/:campsiteId/comments/:commentId path,
// check to ensure that the user is that particular comment's author.
// If so, then allow the operation to proceed.
// If not, then respond with a 403 status code.
// Recall that the user's _id field is available from the req.user object. Also ObjectIDs behave like Strings,
// and hence when comparing two ObjectIDs, you should use the id1.equals(id2) syntax (substituting id1 and id2 appropriately).

module.exports = campsiteRouter;
