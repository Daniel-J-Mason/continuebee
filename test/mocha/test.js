import { should } from 'chai';
should();
import sessionless from 'sessionless-node';
import superAgent from 'superagent';

const baseURL = 'http://127.0.0.1:8080/';
//const baseURL = 'https://thirsty-gnu-80.deno.dev/';

const get = async function(path) {
  //console.info("Getting " + path);
  return await superAgent.get(path).set('Content-Type', 'application/json');
};

const put = async function(path, body) {
  //console.info("Putting " + path);
  return await superAgent.put(path).send(body).set('Content-Type', 'application/json');
};

const post = async function(path, body) {
  //console.info("Posting " + path);
  //console.info(body);
  return await superAgent.post(path).send(body).set('Content-Type', 'application/json');
};

let savedUser = {};
let keys = {};

it('should register a user', async () => {
  keys = await sessionless.generateKeys(() => { return keys; }, () => {return keys;});
console.log(keys);
/*  keys = {
    privateKey: 'd6bfebeafa60e27114a40059a4fe82b3e7a1ddb3806cd5102691c3985d7fa591',
    pubKey: '03f60b3bf11552f5a0c7d6b52fcc415973d30b52ab1d74845f1b34ae8568a47b5f'
  };*/
  const payload = {
    timestamp: new Date().getTime() + '',
    pubKey: keys.pubKey,
    hash: 'firstHash'
  };

  payload.signature = await sessionless.sign(payload.timestamp + payload.pubKey + payload.hash);

try {
  const res = await post(`${baseURL}user/create`, payload);
  savedUser = res.body;
  res.body.userUUID.length.should.equal(36);
} catch(err) {
console.warn(err);
}
});

it('should check hash', async () => {
  const timestamp = new Date().getTime() + '';
  const uuid = savedUser.userUUID;
  const hash = 'firstHash';

  const signature = await sessionless.sign(timestamp + uuid + hash);

  const res = await get(`${baseURL}user/${uuid}?timestamp=${timestamp}&hash=${hash}&signature=${signature}`);
console.log(res.status);
  res.status.should.equal(202);
});

it('should save hash', async () => {
  const timestamp = new Date().getTime() + '';
  const userUUID = savedUser.userUUID;
  const hash = 'firstHhash';
  const newHash = 'secondHash';

  const signature = await sessionless.sign(timestamp + userUUID + hash + newHash);
  const payload = {timestamp, userUUID, hash, newHash, signature};

console.log(payload);

  const res = await put(`${baseURL}user/update-hash`, payload);
  res.body.userUUID.length.should.equal(36);
});
