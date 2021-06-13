const knex = require('knex')(exportConfig());
function exportConfig() {
  return require('./knexfile')
}
const main = async () => {
    const listMember = await knex.raw("SELECT * FROM acc where check_tele = 1 and check_tw = 1 and check_wallet = 1 and check_stt = 1");
    const realData = JSON.parse(JSON.stringify(listMember))
    console.log(realData[0]);
}
main()