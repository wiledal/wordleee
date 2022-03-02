import React, { FC, useState } from "react";
import { Box, Newline, Spacer, Text, useApp, useInput } from "ink";
import BigText from "ink-big-text";
import {
	getWordFromNumber,
	getWordNumberFromDate,
	validateWord,
} from "./helpers";
import { Row } from "./components/Row";
import { Alphabet } from "./components/Alphabet";
import { EndScreen } from "./components/EndScreen";

interface AppProps {
	number?: number;
}

const App: FC<AppProps> = ({ number }) => {
	const wordNumber = number || getWordNumberFromDate(new Date());
	const correctWord = getWordFromNumber(wordNumber);
	const [activeWord, setActiveWord] = useState(0);
	const [guessedWords, setGuessedWords] = useState<string[]>([]);
	const [inputWord, setInputWord] = useState("");
	const [notInWordList, setNotInWordList] = useState("");

	const [playing, setPlaying] = useState(true);

	const { exit } = useApp();

	useInput((input, key) => {
		if (key.escape) {
			exit();
		}

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

					setTimeout(() => {
						exit();
					}, 100);
				}, 1000);

				return;
			}

			if (guessedWords.length >= 5) {
				setTimeout(() => {
					setPlaying(false);

					setTimeout(() => {
						exit();
					}, 100);
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
							<Text>A humble Wordle clone in the terminal</Text>
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
								<Box flexDirection="column" justifyContent="space-between">
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
								<Spacer />
								<Box width={32} paddingBottom={2}>
									<Text>
										Guess the 5-letter word in six tries.
										<Newline />
										Input a word and press ENTER to progress.
										<Newline />
										<Newline />
										Exit with ESCAPE.
									</Text>
								</Box>
							</Box>
						</Box>
					</Box>
				</Box>
			)}
			{!playing && (
				<EndScreen
					correctWord={correctWord}
					guessedWords={guessedWords}
					wordNumber={wordNumber}
				/>
			)}
		</>
	);
};

export default App;
