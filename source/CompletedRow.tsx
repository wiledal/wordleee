import React, { FC } from "react";
import { Box } from "ink";
import BigText from "ink-big-text";
import { LETTER_BOX_SETTINGS, FONT } from "./constants";

interface CompletedRowProps {
	word: string;
	correctWord: string;
}
export const CompletedRow: FC<CompletedRowProps> = ({ word, correctWord }) => {
	return (
		<Box>
			{Array.from({ length: 5 }).map((_n, i) => {
				const letter = word[i];
				const isCorrect = word[i] == correctWord[i];
				const isInWord = correctWord.includes(letter || "_");

				let borderColor = "system";
				if (isInWord) borderColor = "yellow";
				if (isCorrect) borderColor = "green";

				return (
					<Box key={i} {...LETTER_BOX_SETTINGS} borderColor={borderColor}>
						{letter && (
							<BigText font={FONT} colors={[borderColor]} text={letter} />
						)}
					</Box>
				);
			})}
		</Box>
	);
};
