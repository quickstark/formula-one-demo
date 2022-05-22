import React, { useState } from "react";
import propTypes from "prop-types";

import { configureAbly, useChannel } from "@ably-labs/react-hooks";

configureAbly({
  key: "6mQk9A.VCN3-g:5DXXMKUwGfYXO6ax1jnRZfYTOpA-P3CP_F04jM_oono",
  clientId: "dirk",
});

export default function SpeedCell({ record }) {
  const [speed, setSpeed] = useState(0);

  console.log(`SpeedCell Props: ${record.position}`);

  useChannel(`[?rewind=1]speed-${record.position}`, (message) => {
    console.log(message.data);
    setSpeed(message.data.livespeed);
  });

  return <span className="speedcell">{speed}</span>;
}

SpeedCell.propTypes = {
  record: propTypes.object,
  position: propTypes.number,
};
