// 开发
// const baseDomain = "localhost";
// const baseProtocol = "http";
// const basePort = 8000;

// 外网
const baseDomain = "47.93.116.221";
const baseProtocol = "http";
const basePort = 8000;

//内网
// const baseDomain = '192.168.100.1'
// const baseProtocol = 'http'
// const basePort = 8000

export const REST_API =
  process.env.NODE_ENV === "production" ?
  "" :
  `${baseProtocol}://${baseDomain}:${basePort}`;
export const WS_BASE =
  "ws://ec2-161-189-9-142.cn-northwest-1.compute.amazonaws.com.cn:10030/cloudy-edge/websocket";
// export const REST_API = ''

//export const REST_API = process.env.NODE_ENV === 'production' ? `${proProtocol}://${proDomain}:${proPort}` : `${baseProtocol}://${baseDomain}:${basePort}`

const {
  hostname,
  port,
  protocol
} = window.location;
console.log(">>> url", protocol, hostname, port);
const wsPrefix = protocol === "http:" ? "ws:" : "wss:";
export const BROADCAST_WEB_SOCKET =
  process.env.NODE_ENV === "production" ?
  `${wsPrefix}//${hostname}:${port - 1}/ws` :
  `wss://${baseDomain}:${basePort - 1}/ws`;
