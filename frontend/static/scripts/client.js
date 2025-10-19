import React from "@/frontend/react-runtime.js";
import { hydrateRoot } from "@/frontend/react-runtime.js";
import { pages } from "../../.pages/index.js";

const pathname = window.location.pathname;
const Page = pages[pathname] || pages["/not-found"];

hydrateRoot(document.getElementById("root"), React.createElement(Page));
