#!/usr/bin/env node
import React from "react";
import { render } from "ink";
import App from "./ui";
import { exit } from "process";

const [, , arg] = process.argv;
let number;

if (arg && typeof parseInt(arg) !== "number") {
	console.log(
		`
wordleee

Usage:
    wordleee            Play today's word!
    wordleee <number>   Play a previous or future word!
`
	);

	exit();
}

number = parseInt(arg || "");
render(<App number={number} />);
