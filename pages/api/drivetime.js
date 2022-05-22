var Ably = require("ably");
import { raceResults } from "lib/raceresults";

const ably = new Ably.Realtime(
  "6mQk9A.VCN3-g:5DXXMKUwGfYXO6ax1jnRZfYTOpA-P3CP_F04jM_oono"
);
ably.connection.on("connected", () => {
  console.log("Connected to Ably!");
});

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

// Array of timers as each call to the API might spool up an additional timer
let timers = [];

export default (req, res) => {
  const {
    query: { action, interval },
    method,
  } = req;

  switch (method) {
    case "POST":
      // Get data from your database
      console.log(req.query);
      res.status(200).json({ data: `${action}` });
      break;
    case "GET":
      // Get data from your database
      console.log(req.query);
      if (action == "stop") {
        // clear the interval and stop polling
        timers.map((timer) => clearInterval(timer));
      } else {
        // clear any prior timers just in case
        timers.map((timer) => clearInterval(timer));
        raceResults.map((driver) => {
          // fetch Ably channel
          let speedchannel = ably.channels.get(`speed-${driver.position}`);
          let lapchannel = ably.channels.get(`lap-${driver.position}`);
          let tSpeed = setInterval(pulseSpeed, interval, speedchannel, driver);
          let tLap = setInterval(pulseLap, 30000, lapchannel, driver);
          timers.push(tSpeed);
          timers.push(tLap);
        });
      }
      res.status(200).json({ data: interval });
      break;
    // case 'PUT':
    //   // Update or create data in your database
    //   res.status(200).json({ id, name: name || `User ${id}` })
    //   break
    default:
      res.setHeader("Allow", ["POST", "GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
