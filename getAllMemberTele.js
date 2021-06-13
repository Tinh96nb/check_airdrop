const csv = require('csv-parser');
const fs = require('fs');

const knex = require('knex')(exportConfig());
function exportConfig() {
  return require('./knexfile')
}

const getFile = () => {
  fs.createReadStream('./all_member_tele.csv')
    .pipe(csv())
    .on('data', async (row) => {
      const user = {
        id: Object.values(row)[0].trim(),
        username: Object.values(row)[1].trim(),
      }
      if (user.username)
      await knex('member_tele').insert(user)
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
}
getFile();