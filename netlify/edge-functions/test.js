// import { createRequire } from "https://deno.land/std/node/module.ts";
// const require = createRequire(import.meta.url);
// var Ably = require("ably");

import ably from "https://dev.jspm.io/ably";
import { raceResults } from "../../lib/raceresults.js";

const realtime = new ably.Realtime(
  "6mQk9A.VCN3-g:5DXXMKUwGfYXO6ax1jnRZfYTOpA-P3CP_F04jM_oono"
);

// Array of timers as each call to the API might spool up an additional timer
let timers = [];

export default async (req, context) => {
  context.log(req.body);
  let { action, interval } = await req.json();
  context.log(action);

  //   let interval = 2000;

  if (action == "stop") {
    // clear the interval and stop polling
    timers.map((timer) => clearInterval(timer));
  } else {
    // clear any prior timers just in case
    timers.map((timer) => clearInterval(timer));
    raceResults.map((driver) => {
      // fetch Ably channel
      let speedchannel = realtime.channels.get(`speed-${driver.position}`);
      let lapchannel = realtime.channels.get(`lap-${driver.position}`);
      let tSpeed = setInterval(pulseSpeed, interval, speedchannel, driver);
      let tLap = setInterval(pulseLap, 30000, lapchannel, driver);
      timers.push(tSpeed);
      timers.push(tLap);
    });
  }
  return new Response(JSON.stringify({ data: "Polling Endpoint" }));
};

function pulseSpeed(channel, driver) {
  let speed = driver.speed + (Math.random() - 0.5) * 2.5;
  console.log(`Speed: ${driver.position} -  ${speed}`);
  let msg = {
    driverid: driver.driverid,
    position: driver.position,
    livespeed: speed.toFixed(2),
  };
  channel.publish(`speed-${driver.position}`, msg);
}

function pulseLap(channel, driver) {
  if (driver.time != 0) {
    let lap = driver.time / driver.laps / 3 + (Math.random() - 0.5) * 2;
    console.log(`Lap Time: ${driver.position} -  ${lap}`);
    let msg = {
      driverid: driver.driverid,
      position: driver.position,
      livelap: lap.toFixed(0),
    };
    channel.publish(`lap-${driver.position}`, msg);
  }
}
