const csv = require('csv-parser');
const fs = require('fs');

const knex = require('knex')(exportConfig());
function exportConfig() {
  return require('./knexfile')
}

const getFile = async () => {
  fs.createReadStream('./file_member.csv')
    .pipe(csv())
    .on('data', async (row) => {
      try {
        const user = {
          id_cmc: Object.values(row)[0].trim(),
          tele: Object.values(row)[2].trim().replace("@", ""),
          tw: Object.values(row)[3].trim().replace("@", ""),
          address: Object.values(row)[1].trim(),
          link: Object.values(row)[4].trim()
        }
        await knex('acc').insert(user)
      } catch (error) {
        console.log(Object.values(row));
      }
      
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
}
getFile();