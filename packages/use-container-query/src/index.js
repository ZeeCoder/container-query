import React, { useRef, useEffect } from "react";
import Container from "@zeecoder/container-query";

export default function(meta, options = {}) {
  const ref = useRef();

  useEffect(() => {
    new Container(ref.current, meta, options);
  }, []);

  return ref;
}
