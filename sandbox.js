let raceResults = [
  { position: "1", laps: 57, time: 5664258, speed: 213.25 },
  { position: "2", laps: 57, time: 5668044, speed: 212.95 },
  { position: "3", laps: 57, time: 5672487, speed: 212.25 },
  { position: "4", laps: 57, time: 5674896, speed: 212.19 },
  { position: "5", laps: 57, time: 5682840, speed: 211.32 },
  { position: "6", laps: 57, time: 5685626, speed: 209.62 },
  { position: "7", laps: 57, time: 5689331, speed: 209.08 },
  { position: "8", laps: 57, time: 5692644, speed: 209.13 },
  { position: "9", laps: 57, time: 5696623, speed: 208.49 },
  { position: "10", laps: 57, time: 5701284, speed: 208.76 },
  { position: "11", laps: 57, time: 5701386, speed: 208.75 },
  { position: "12", laps: 57, time: 5704404, speed: 209.41 },
  { position: "13", laps: 57, time: 5705160, speed: 208.9 },
  { position: "14", laps: 57, time: 5714194, speed: 206.89 },
  { position: "15", laps: 57, time: 5737563, speed: 210.56 },
  { position: "16", laps: 56, time: 0, speed: 208.35 },
  { position: "17", laps: 50, time: 0, speed: 208.43 },
  { position: "18", laps: 38, time: 0, speed: 206.19 },
  { position: "19", laps: 37, time: 0, speed: 208.57 },
  { position: "20", laps: 4, time: 0, speed: 203.52 },
];

let timers = [];

function pulseSpeed(driver) {
  let speed = driver.speed + (Math.random() - 0.5) * 2;
  console.log(`Speed: ${driver.position} -  ${speed}`);
  //   let msg = { payload: rando.toFixed(2) };
}

function pulseLap(driver) {
  let lap = driver.time / driver.laps / 3 + (Math.random() - 0.5) * 2;
  console.log(`Lap Time: ${driver.position} -  ${lap}`);
  //   let msg = { payload: rando.toFixed(2) };
}

raceResults.map((driver) => {
  let tSpeed = setInterval(pulseSpeed, 2000, driver);
  let tLap = setInterval(pulseLap, 6000, driver);
});
