import React, { FC, useState } from "react";
import { Box, BoxProps, Text, useInput } from "ink";
import BigText from "ink-big-text";

const letterBoxSettings: BoxProps = {
	width: 16,
	height: 10,
	justifyContent: "center",
	borderStyle: "round",
};

const font = "block";

interface InputRowProps {
	word: string;
}

const EmptyRow = () => (
	<>
		<Box>
			{Array.from({ length: 5 }).map((_n, i) => (
				<Box key={i} {...letterBoxSettings} />
			))}
		</Box>
	</>
);

interface CompletedRowProps {
	word: string;
	correctWord: string;
}
const CompletedRow: FC<CompletedRowProps> = ({ word, correctWord }) => {
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
					<Box key={i} {...letterBoxSettings} borderColor={borderColor}>
						{letter && (
							<BigText font={font} colors={[borderColor]} text={letter} />
						)}
					</Box>
				);
			})}
		</Box>
	);
};

const InputRow: FC<InputRowProps> = ({ word }) => {
	return (
		<>
			<Box>
				{Array.from({ length: 5 }).map((_n, i) => {
					const letter = word[i] || " ";

					return (
						<Box key={i} {...letterBoxSettings} borderStyle="bold">
							{letter && <BigText font={font} text={letter} />}
						</Box>
					);
				})}
			</Box>
		</>
	);
};

interface RowProps {
	active: boolean;
	done: boolean;
	inputWord: string;
	finalWord: string;
	correctWord: string;
}
const Row: FC<RowProps> = ({
	active,
	done,
	inputWord,
	finalWord,
	correctWord,
}) => {
	if (active) return <InputRow word={inputWord} />;
	if (done) return <CompletedRow word={finalWord} correctWord={correctWord} />;
	return <EmptyRow />;
};

interface AlphabetProps {
	guessedWords: string[];
	correctWord: string;
}

const letterGroups = "abcdefg hijklmn opqrstu vwxyz".split(" ");

const Alphabet: FC<AlphabetProps> = ({ guessedWords, correctWord }) => {
	const guessedLetters = guessedWords.join("");

	return (
		<Box flexDirection="column">
			{letterGroups.map((group, i) => {
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

const App: FC = () => {
	const correctWord = "potat";
	const [activeWord, setActiveWord] = useState(0);
	const [guessedWords, setGuessedWords] = useState<string[]>([]);
	const [inputWord, setInputWord] = useState("");

	useInput((input, key) => {
		if (key.backspace || key.delete) {
			setInputWord((curr) => {
				const a = curr.split("");
				a.pop();
				return a.join("");
			});

			return;
		}

		if (key.return) {
			setInputWord("");
			setGuessedWords((curr) => [...curr, inputWord]);
			setActiveWord((curr) => curr + 1);
		}

		if (!input.trim()) return;

		setInputWord((curr) => curr + input.trim().toLowerCase());
	});

	return (
		<Box flexDirection="column" alignItems="center">
			<Box flexDirection="column" alignItems="center" marginBottom={2}>
				<BigText text="WORLDEEE" font="simple3d" />
				<Text>a humble wordle clone, in the terminal</Text>
			</Box>

			<Box>
				<Box flexDirection="column" marginRight={4}>
					{Array.from({ length: 5 }).map((_n, i) => (
						<Row
							key={i}
							active={activeWord === i}
							finalWord={guessedWords[i] || ""}
							inputWord={inputWord}
							correctWord={correctWord}
							done={activeWord > i}
						/>
					))}
				</Box>

				<Alphabet correctWord={correctWord} guessedWords={guessedWords} />
			</Box>
		</Box>
	);
};

module.exports = App;
export default App;
