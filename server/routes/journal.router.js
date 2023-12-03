const express = require("express");
const pool = require("../modules/pool");
const router = express.Router();

router.get("/", (req, res) => {
  // write a get route that gets all the journals from the database

  // console.log("in journal router GET");
  const queryText = `SELECT * FROM "journal" ORDER BY "id" ASC;`;

  pool
    .query(queryText)
    .then((result) => {
      // console.log(result.rows);
      res.send(result.rows);
    })
    .catch((error) => {
      console.log("error in journal router GET", error);
      res.sendStatus(500);
    });
});

// POST route to create a new journal entry
router.post('/', (req, res) => {
  const { prompt_id, user_id, date, detail } = req.body;
  const queryText = 'INSERT INTO journal (prompt_id, user_id, date, detail) VALUES ($1, $2, $3, $4) RETURNING id;';
  pool.query(queryText, [prompt_id, user_id, date, detail])
      .then(result => res.send(result.rows[0]))
      .catch(error => {
          console.error('Error in POST /journal:', error);
          res.sendStatus(500);
      });
});

// PUT route to update a journal entry
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { detail } = req.body;
  const queryText = 'UPDATE journal SET detail = $1 WHERE id = $2;';
  pool.query(queryText, [detail, id])
      .then(() => res.sendStatus(200))
      .catch(error => {
          console.error('Error in PUT /journal:', error);
          res.sendStatus(500);
      });
});

// DELETE route to delete a journal entry
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const queryText = 'DELETE FROM journal WHERE id = $1;';
  pool.query(queryText, [id])
      .then(() => res.sendStatus(200))
      .catch(error => {
          console.error('Error in DELETE /journal:', error);
          res.sendStatus(500);
      });
});


module.exports = router;
