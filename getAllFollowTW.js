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
      const remaining = result.resources['followers']['/followers/ids']['remaining'];
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
      console.log('instance limit');
      return;
    }
    const roClient = twInstance.readOnly;
    try {
      const listFollows = await roClient.v1.get('/followers/ids.json', { screen_name: 'Bytenextio' });
      const user = listFollows.ids.map((id) => ({'id_user': id}))
      await knex('member_tw').insert(user)
      console.log(listFollows);
    } catch (error) {
      console.log(error.message);
    }
  } catch (error) {
    console.log(error);
  }
}
setIdForUser();