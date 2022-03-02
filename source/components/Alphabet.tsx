import React, { FC } from "react";
import { Box, Text } from "ink";
import { LETTER_GROUPS } from "../constants";

export interface AlphabetProps {
	guessedWords: string[];
	correctWord: string;
}

export const Alphabet: FC<AlphabetProps> = ({ guessedWords, correctWord }) => {
	const guessedLetters = guessedWords.join("");

	return (
		<Box flexDirection="column">
			{LETTER_GROUPS.map((group, i) => {
				const groupLetters = group.split("");

				return (
					<Box key={i}>
						{groupLetters.map((letter) => {
							const invalidLetter =
								guessedLetters.includes(letter) &&
								!correctWord.includes(letter);

							return (
								<Box
									key={letter}
									borderColor={invalidLetter ? "red" : "system"}
									borderStyle="single"
									padding={1}
								>
									<Text dimColor={invalidLetter}>{letter.toUpperCase()}</Text>
								</Box>
							);
						})}
					</Box>
				);
			})}
		</Box>
	);
};
