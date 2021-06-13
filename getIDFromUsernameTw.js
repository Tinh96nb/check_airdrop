require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');
const knex = require('knex')(exportConfig());
function exportConfig() {
  return require('./knexfile')
}
async function getInstance() {
  const amountKey = 16; 
  const listIntance = Array.from(Array(amountKey).keys()).map(index => {
    return new TwitterApi(process.env[`TW_BEARER_TOKEN${index}`])
  })
  let temp = null;
  const genedNum = [];
  while (genedNum.length != listIntance.length) {
    const random = Math.floor(Math.random() * listIntance.length);
    if (genedNum.includes(random)) continue;
    genedNum.push(random);
    try {
      const result = await listIntance[random].v1.get(`application/rate_limit_status.json`)
      const remaining = result.resources['users']['/users/:id']['remaining'];
      if (+remaining > 1) {
        temp = random;
        break;
      }
    } catch (error) {
      continue;
    }
  }
  return temp !== null ? listIntance[temp] : false;
}

async function setIdForUser() {
  try {
    const twInstance = await getInstance();
    if (!twInstance) {
      console.log('limit');
      return;
    }
    const roClient = twInstance.readOnly;
    const listUser = await knex('acc2').select()
    .where('check_tele', 1)
    .andWhere('id_tw', null)
    const list = JSON.parse(JSON.stringify(listUser));
    list.forEach(async (user) => {
      try {
        const userTele = await roClient.v1.get('/users/show.json', { screen_name: user.tw });
        if (userTele && userTele.id) {
          await knex('acc2')
            .where('id', user.id)
            .update({id_tw: userTele.id})
          console.log(user.id);
        }
      } catch (error) {
        console.log(error.message);
      }
    });
  } catch (error) {
  }
}
setIdForUser();