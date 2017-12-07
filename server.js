/**
 * mock dataes
 */


let data = {
  name: 'Owen',
  age: 21,
  skills: {
    favorite: 'coding',
    hobby: ['listen music', 'ride']
  },

  myFakeName: 'nickName',
  nickName: 'bilibiliou',

  myFriend: [{
    name: '风清扬',
    age: 45
  }, {
    name: 'pony me',
    age: 50
  }, {
    name: 'robin lea',
    age: 60
  }],
  foo: {
    'abc': 123,
    'acc': 456
  }
}

/**  ****  ****  ****  ****  ****  ****  **/

const dgram = require('dgram');
const protobuf = require('protobufjs');
const SEND_PORT = 8081;

// 建立udp连接
let socket = dgram.createSocket({
  type: 'udp4'
});

// 加载protobuf
let serverSchema = protobuf.loadSync('schema.proto');

// 从protobuf 中抽取实例
let um = serverSchema.lookupType('user_message.User');

// verify 为检测，根据schema检测数据是否有错误
let errMsg = um.verify(data);

if (errMsg) {
  throw Error(errMsg);
}

// 将数据编码为二进制
console.log(um.create(data))
let buf = um.encode(um.create(data)).finish();

socket.on('error', err => {
  if (err) {
    throw Error(err);
  }

  socket.close();
});


// 发送二进制数据
socket.send(buf, SEND_PORT, err => {
  if (err) {
    throw Error(err);
  } else {
    socket.close();
    console.log('done');
  }
})