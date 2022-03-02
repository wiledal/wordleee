import React, { FC } from "react";
import { Box } from "ink";
import BigText from "ink-big-text";
import { LETTER_BOX_SETTINGS, FONT } from "../constants";

interface CompletedRowProps {
	word: string;
	correctWord: string;
}
export const CompletedRow: FC<CompletedRowProps> = ({ word, correctWord }) => {
	// We go through the word and accummilate the count of all the letters
	// so that we can accurately display the number of times a letter repeats
	// in a word.

	const letterCount = correctWord
		.split("")
		.reduce<Record<string, number>>((agg, current, index) => {
			if (!agg[current]) agg[current] = 0;

			// only add to the count if it's not correct, as correct
			// letters will always be green
			if (word[index] !== correctWord[index]) agg[current]++;

			return agg;
		}, {});

	const wordDisplay = correctWord.split("").map((correctLetter, index) => {
		const guessedLetter = word[index] || "_";
		const isCorrect = guessedLetter === correctLetter;
		const isInWord = word.includes(guessedLetter);

		let color = "system";

		if (isCorrect) {
			color = "green";
		}

		// We check if the letter is in fact in the word, and has not
		// been shown too many times already, then we display the yellow
		if (!isCorrect && isInWord && letterCount[guessedLetter]) {
			color = "yellow";
			letterCount[guessedLetter]--;
		}

		return {
			color,
			letter: guessedLetter,
		};
	});

	return (
		<Box>
			{wordDisplay.map(({ letter, color }, i) => (
				<Box key={i} {...LETTER_BOX_SETTINGS} borderColor={color}>
					{letter && (
						<BigText space={false} font={FONT} colors={[color]} text={letter} />
					)}
				</Box>
			))}
		</Box>
	);
};
