import React, { FC } from "react";
import { Box } from "ink";
import BigText from "ink-big-text";
import { LETTER_BOX_SETTINGS, FONT } from "./constants";

interface InputRowProps {
	word: string;
	invalid: boolean;
}
export const InputRow: FC<InputRowProps> = ({ word, invalid }) => {
	return (
		<>
			<Box>
				{Array.from({ length: 5 }).map((_n, i) => {
					const letter = word[i] || " ";

					return (
						<Box
							key={i}
							{...LETTER_BOX_SETTINGS}
							borderStyle="bold"
							borderColor={invalid ? "red" : "system"}
						>
							{letter && <BigText font={FONT} text={letter} />}
						</Box>
					);
				})}
			</Box>
		</>
	);
};
