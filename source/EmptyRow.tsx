import React from "react";
import { Box } from "ink";
import { LETTER_BOX_SETTINGS } from "./constants";

export const EmptyRow = () => (
	<>
		<Box>
			{Array.from({ length: 5 }).map((_n, i) => (
				<Box key={i} {...LETTER_BOX_SETTINGS} />
			))}
		</Box>
	</>
);
