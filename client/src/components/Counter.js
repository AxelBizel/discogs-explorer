import React, { useState, useRef } from "react";
import elementInViewport from "../helpers";

function Counter({ number }) {
  const [go, setGo] = useState(false);
  const [counter, setCounter] = useState(false);
  const element = useRef(null);
  const timer = 10000;
  const range = number / timer;

  if (counter < number && go) {
    setTimeout(() => {
      setCounter(Math.ceil(counter + range));
    }, 1);
  }

  if (!go && element && element.current) {
    if (elementInViewport(element.current)) {
      setGo(true);
    }

    // // window.addEventListener("scroll", () => {
    // //     if (elementInViewport(element.current) === false) {
    // //         setNumber(true);
    // //       }

    // });
  }

  return <span ref={element}>{counter}</span>;
}

export default Counter;
