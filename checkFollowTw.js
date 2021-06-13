const knex = require('knex')(exportConfig());
function exportConfig() {
  return require('./knexfile')
}
const main = async () => {
    const listMember = await knex.raw("SELECT acc.id FROM acc INNER JOIN member_tw ON acc.id_tw = member_tw.id_user");
    const realData = JSON.parse(JSON.stringify(listMember))
    const listId = realData[0].map(data => data.id)
    await knex('acc')
    .whereIn('id', listId)
    .update({check_tw: 1})
    console.log('amount updated:', result);
}
main()