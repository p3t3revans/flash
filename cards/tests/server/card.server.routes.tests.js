'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Card = mongoose.model('Card'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  card;

/**
 * Card routes tests
 */
describe('Card CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new card
    user.save(function () {
      card = {
        title: 'Card Title',
        content: 'Card Content'
      };

      done();
    });
  });

  it('should be able to save an card if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new card
        agent.post('/api/cards')
          .send(card)
          .expect(200)
          .end(function (cardSaveErr, cardSaveRes) {
            // Handle card save error
            if (cardSaveErr) {
              return done(cardSaveErr);
            }

            // Get a list of cards
            agent.get('/api/cards')
              .end(function (cardsGetErr, cardsGetRes) {
                // Handle card save error
                if (cardsGetErr) {
                  return done(cardsGetErr);
                }

                // Get cards list
                var cards = cardsGetRes.body;

                // Set assertions
                (cards[0].user._id).should.equal(userId);
                (cards[0].title).should.match('Card Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an card if not logged in', function (done) {
    agent.post('/api/cards')
      .send(card)
      .expect(403)
      .end(function (cardSaveErr, cardSaveRes) {
        // Call the assertion callback
        done(cardSaveErr);
      });
  });

  it('should not be able to save an card if no title is provided', function (done) {
    // Invalidate title field
    card.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new card
        agent.post('/api/cards')
          .send(card)
          .expect(400)
          .end(function (cardSaveErr, cardSaveRes) {
            // Set message assertion
            (cardSaveRes.body.message).should.match('Title cannot be blank');

            // Handle card save error
            done(cardSaveErr);
          });
      });
  });

  it('should be able to update an card if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new card
        agent.post('/api/cards')
          .send(card)
          .expect(200)
          .end(function (cardSaveErr, cardSaveRes) {
            // Handle card save error
            if (cardSaveErr) {
              return done(cardSaveErr);
            }

            // Update card title
            card.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing card
            agent.put('/api/cards/' + cardSaveRes.body._id)
              .send(card)
              .expect(200)
              .end(function (cardUpdateErr, cardUpdateRes) {
                // Handle card update error
                if (cardUpdateErr) {
                  return done(cardUpdateErr);
                }

                // Set assertions
                (cardUpdateRes.body._id).should.equal(cardSaveRes.body._id);
                (cardUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of cards if not signed in', function (done) {
    // Create new card model instance
    var cardObj = new Card(card);

    // Save the card
    cardObj.save(function () {
      // Request cards
      request(app).get('/api/cards')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single card if not signed in', function (done) {
    // Create new card model instance
    var cardObj = new Card(card);

    // Save the card
    cardObj.save(function () {
      request(app).get('/api/cards/' + cardObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', card.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single card with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/cards/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Card is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single card which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent card
    request(app).get('/api/cards/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No card with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an card if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new card
        agent.post('/api/cards')
          .send(card)
          .expect(200)
          .end(function (cardSaveErr, cardSaveRes) {
            // Handle card save error
            if (cardSaveErr) {
              return done(cardSaveErr);
            }

            // Delete an existing card
            agent.delete('/api/cards/' + cardSaveRes.body._id)
              .send(card)
              .expect(200)
              .end(function (cardDeleteErr, cardDeleteRes) {
                // Handle card error error
                if (cardDeleteErr) {
                  return done(cardDeleteErr);
                }

                // Set assertions
                (cardDeleteRes.body._id).should.equal(cardSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an card if not signed in', function (done) {
    // Set card user
    card.user = user;

    // Create new card model instance
    var cardObj = new Card(card);

    // Save the card
    cardObj.save(function () {
      // Try deleting card
      request(app).delete('/api/cards/' + cardObj._id)
        .expect(403)
        .end(function (cardDeleteErr, cardDeleteRes) {
          // Set message assertion
          (cardDeleteRes.body.message).should.match('User is not authorized');

          // Handle card error error
          done(cardDeleteErr);
        });

    });
  });

  it('should be able to get a single card that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new card
          agent.post('/api/cards')
            .send(card)
            .expect(200)
            .end(function (cardSaveErr, cardSaveRes) {
              // Handle card save error
              if (cardSaveErr) {
                return done(cardSaveErr);
              }

              // Set assertions on new card
              (cardSaveRes.body.title).should.equal(card.title);
              should.exist(cardSaveRes.body.user);
              should.equal(cardSaveRes.body.user._id, orphanId);

              // force the card to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the card
                    agent.get('/api/cards/' + cardSaveRes.body._id)
                      .expect(200)
                      .end(function (cardInfoErr, cardInfoRes) {
                        // Handle card error
                        if (cardInfoErr) {
                          return done(cardInfoErr);
                        }

                        // Set assertions
                        (cardInfoRes.body._id).should.equal(cardSaveRes.body._id);
                        (cardInfoRes.body.title).should.equal(card.title);
                        should.equal(cardInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single card if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new card model instance
    card.user = user;
    var cardObj = new Card(card);

    // Save the card
    cardObj.save(function () {
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = user.id;

          // Save a new card
          agent.post('/api/cards')
            .send(card)
            .expect(200)
            .end(function (cardSaveErr, cardSaveRes) {
              // Handle card save error
              if (cardSaveErr) {
                return done(cardSaveErr);
              }

              // Get the card
              agent.get('/api/cards/' + cardSaveRes.body._id)
                .expect(200)
                .end(function (cardInfoErr, cardInfoRes) {
                  // Handle card error
                  if (cardInfoErr) {
                    return done(cardInfoErr);
                  }

                  // Set assertions
                  (cardInfoRes.body._id).should.equal(cardSaveRes.body._id);
                  (cardInfoRes.body.title).should.equal(card.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (cardInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single card if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new card model instance
    var cardObj = new Card(card);

    // Save the card
    cardObj.save(function () {
      request(app).get('/api/cards/' + cardObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', card.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single card, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      username: 'temp',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create temporary user
    var _user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _user.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Card
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = user._id;

          // Save a new card
          agent.post('/api/cards')
            .send(card)
            .expect(200)
            .end(function (cardSaveErr, cardSaveRes) {
              // Handle card save error
              if (cardSaveErr) {
                return done(cardSaveErr);
              }

              // Set assertions on new card
              (cardSaveRes.body.title).should.equal(card.title);
              should.exist(cardSaveRes.body.user);
              should.equal(cardSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the card
                  agent.get('/api/cards/' + cardSaveRes.body._id)
                    .expect(200)
                    .end(function (cardInfoErr, cardInfoRes) {
                      // Handle card error
                      if (cardInfoErr) {
                        return done(cardInfoErr);
                      }

                      // Set assertions
                      (cardInfoRes.body._id).should.equal(cardSaveRes.body._id);
                      (cardInfoRes.body.title).should.equal(card.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (cardInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Card.remove().exec(done);
    });
  });
});
