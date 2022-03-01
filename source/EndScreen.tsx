import React, { FC } from "react";
import { Box, Newline, Text } from "ink";
import BigText from "ink-big-text";
import { renderEmojiGuessRow } from "./helpers";

interface EndScreenProps {
	correctWord: string;
	guessedWords: string[];
	wordNumber: number;
}
export const EndScreen: FC<EndScreenProps> = ({
	correctWord,
	guessedWords,
	wordNumber,
}) => {
	const isWinner = guessedWords.includes(correctWord);

	return (
		<Box>
			{isWinner && (
				<Box flexDirection="column" paddingBottom={2}>
					<BigText text="You did it!" />
					<Text>
						Wordleee #{wordNumber} {guessedWords.length} / 6
						<Newline />
					</Text>
					{guessedWords.map((guess, i) => (
						<Text key={i}>{renderEmojiGuessRow(guess, correctWord)}</Text>
					))}
				</Box>
			)}
			{!isWinner && (
				<Box flexDirection="column" paddingBottom={2}>
					<BigText text="Too bad!" />
					<Text>
						Wordleee #{wordNumber}
						<Newline /> <Newline />
						The word was: {correctWord.toUpperCase()}
						<Newline />
					</Text>
					{guessedWords.map((guess, i) => (
						<Text key={i}>{renderEmojiGuessRow(guess, correctWord)}</Text>
					))}
				</Box>
			)}
		</Box>
	);
};
