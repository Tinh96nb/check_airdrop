const knex = require('knex')(exportConfig());
function exportConfig() {
  return require('./knexfile')
}
const main = async () => {
    const listMember = await knex.raw("SELECT * FROM acc where check_tele = 1 and check_tw = 1");
    const realData = JSON.parse(JSON.stringify(listMember))
    const listOk = realData[0].filter((data) => {
        return (/^(0x){1}[0-9a-fA-F]{40}$/i.test(data.address))
      })
    const listId = listOk.map(data => data.id)
    const result = await knex('acc')
    .whereIn('id', listId)
    .update({check_wallet: 1})
    console.log(result);
}
main()