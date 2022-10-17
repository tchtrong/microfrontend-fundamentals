import * as React from "react";
import * as ReactDOM from "react-dom";
import { registerApplication, start } from "single-spa";
import singleSpaReact from "single-spa-react";
import Root from "../02-react-exercise/Root";

const app = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Root,
});

registerApplication({
  name: "02-react-exercise",
  app,
  activeWhen: ["/"],
  customProps: {
    src: "https://images.dog.ceo/breeds/hound-plott/hhh_plott002.JPG",
  },
});

start();
