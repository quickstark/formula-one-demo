import React, { useState } from "react";
import propTypes from "prop-types";

import { configureAbly, useChannel } from "@ably-labs/react-hooks";

configureAbly({
  key: "6mQk9A.VCN3-g:5DXXMKUwGfYXO6ax1jnRZfYTOpA-P3CP_F04jM_oono",
  clientId: "dirk",
});

const millisToMinutesAndSeconds = (millis) => {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  //ES6 interpolated literals/template literals
  //If seconds is less than 10 put a zero in front.
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export default function LapCell({ record }) {
  const [lap, setLap] = useState(0);

  console.log(`Lap Cell Position: ${record.position}`);

  useChannel(`[?rewind=1]lap-${record.position}`, (message) => {
    console.log(message.data);
    setLap(message.data.livelap);
  });

  console.log(millisToMinutesAndSeconds(lap));

  return <span className="lapcell">{millisToMinutesAndSeconds(lap)}</span>;
}

LapCell.propTypes = {
  record: propTypes.object,
  position: propTypes.number,
};
