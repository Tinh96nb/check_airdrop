const knex = require('knex')(exportConfig());
function exportConfig() {
  return require('./knexfile')
}
const main = async () => {
    const listMember = await knex.raw("SELECT acc.id FROM acc INNER JOIN member_tele ON acc.tele = member_tele.username");
    const realData = JSON.parse(JSON.stringify(listMember))
    const listId = realData[0].map(data => data.id)
    const result = await knex('acc')
    .whereIn('id', listId)
    .update({check_tele: 1})
    console.log('amount updated:', result);
}
main()