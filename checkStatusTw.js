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
      const remaining = result.resources['statuses']['/statuses/show/:id']['remaining'];
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

async function checkStatusTW() {
  try {
    const twInstance = await getInstance();
    if (!twInstance) {
      console.log('instance limit');
      return;
    }
    const roClient = twInstance.readOnly;
    const listUser = await knex('acc').select()
      .where('check_tele', 1)
      .andWhere('check_tw', 1)
      .andWhere('check_wallet', 1)
      .andWhere('check_stt', null)
    const list = JSON.parse(JSON.stringify(listUser));
    list.forEach(async (user) => {
      try {
        const idPostCheck = '1398610980163112962';
        const idPost = user.link.split("/")[5].split("?")[0]
        const status = await roClient.v1.get('/statuses/show.json', { id: idPost });
        if (status.quoted_status && +status.quoted_status.id_str === +idPostCheck) {
          await knex('acc')
            .where('id', user.id)
            .update({ check_stt: 1 })
          console.log('oke', user.id, user.link);
        }
      } catch (error) {
        console.log('false', user.id, user.link);
        console.log(error.message);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
}
checkStatusTW();