import React, { FC, useState } from "react";
import { Box, BoxProps, Newline, Spacer, Text, useApp, useInput } from "ink";
import BigText from "ink-big-text";
import {
	getWordFromDate,
	getWordNumberFromDate,
	validateWord,
} from "./helpers";

const letterBoxSettings: BoxProps = {
	width: 16,
	height: 10,
	justifyContent: "center",
	borderStyle: "round",
};

const font = "block";

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

interface InputRowProps {
	word: string;
	invalid: boolean;
}
const InputRow: FC<InputRowProps> = ({ word, invalid }) => {
	return (
		<>
			<Box>
				{Array.from({ length: 5 }).map((_n, i) => {
					const letter = word[i] || " ";

					return (
						<Box
							key={i}
							{...letterBoxSettings}
							borderStyle="bold"
							borderColor={invalid ? "red" : "system"}
						>
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
	notInWordList: boolean;
}
const Row: FC<RowProps> = ({
	active,
	done,
	inputWord,
	finalWord,
	correctWord,
	notInWordList,
}) => {
	if (active) return <InputRow word={inputWord} invalid={notInWordList} />;
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

const renderEmojiGuessRow = (guess: string, correctWord: string) => {
	return correctWord
		.split("")
		.map((_n, i) => {
			if (guess[i] == correctWord[i]) return "🟩";
			if (correctWord.includes(guess[i] || "_")) return "🟨";
			return "⬛";
		})
		.join("");
};

interface EndScreenProps {
	correctWord: string;
	guessedWords: string[];
}
const EndScreen: FC<EndScreenProps> = ({ correctWord, guessedWords }) => {
	const isWinner = guessedWords.includes(correctWord);
	const wordNumber = getWordNumberFromDate(new Date());

	return (
		<Box>
			{isWinner && (
				<Box flexDirection="column">
					<BigText text="You did it!" />
					<Text>
						Wordleee #{wordNumber} {guessedWords.length} / 6
					</Text>
					<Newline />
					{guessedWords.map((guess, i) => (
						<Text key={i}>{renderEmojiGuessRow(guess, correctWord)}</Text>
					))}
					<Newline />
				</Box>
			)}
			{!isWinner && (
				<Box>
					<Text>Too bad...</Text>
				</Box>
			)}
		</Box>
	);
};

const App: FC = () => {
	const correctWord = getWordFromDate(new Date()) || "";
	const wordNumber = getWordNumberFromDate(new Date());
	const [activeWord, setActiveWord] = useState(0);
	const [guessedWords, setGuessedWords] = useState<string[]>([]);
	const [inputWord, setInputWord] = useState("");
	const [notInWordList, setNotInWordList] = useState("");

	const [playing, setPlaying] = useState(true);

	const { exit } = useApp();

	useInput((input, key) => {
		if (key.backspace || key.delete) {
			setNotInWordList("");
			setInputWord((curr) => {
				const a = curr.split("");
				a.pop();
				return a.join("");
			});

			return;
		}

		if (key.return && inputWord.length === 5) {
			if (!validateWord(inputWord)) {
				setNotInWordList(inputWord);
				return;
			}

			setInputWord("");
			setGuessedWords((curr) => [...curr, inputWord]);
			setActiveWord((curr) => curr + 1);

			if (inputWord === correctWord) {
				setTimeout(() => {
					setPlaying(false);
					exit();
				}, 1000);

				return;
			}

			if (guessedWords.length >= 6) {
				setPlaying(false);
				exit();

				setTimeout(() => {
					setPlaying(false);
					exit();
				}, 1000);
			}
		}

		const trimmed = input.toLowerCase().replace(/[^A-Za-z]/gi, "");

		if (!trimmed) return;

		setInputWord((curr) => (curr + trimmed).slice(0, 5));
	});

	return (
		<>
			{playing && (
				<Box flexDirection="column" alignItems="center">
					<Box flexDirection="column">
						<Box flexDirection="column" alignItems="center" marginBottom={4}>
							<BigText text="WORLDEEE" font="simple3d" />
							<Text>a humble wordle clone, in the terminal</Text>
						</Box>

						<Box>
							<Box flexDirection="column" marginRight={4}>
								{Array.from({ length: 6 }).map((_n, i) => (
									<Row
										key={i}
										active={activeWord === i}
										notInWordList={!!notInWordList}
										finalWord={guessedWords[i] || ""}
										inputWord={inputWord}
										correctWord={correctWord}
										done={activeWord > i}
									/>
								))}

								<Box>
									<Text>Wordleee #{wordNumber}</Text>
									<Spacer />
									<Text>by @etthugo</Text>
								</Box>
							</Box>

							<Box flexDirection="column">
								<Alphabet
									correctWord={correctWord}
									guessedWords={guessedWords}
								/>
								{!!notInWordList && (
									<Box
										marginTop={3}
										borderColor="redBright"
										borderStyle="double"
									>
										<Text color="redBright">
											"{inputWord}" is not in word list
										</Text>
									</Box>
								)}
							</Box>
						</Box>
					</Box>
				</Box>
			)}
			{!playing && (
				<EndScreen correctWord={correctWord} guessedWords={guessedWords} />
			)}
		</>
	);
};

module.exports = App;
export default App;
