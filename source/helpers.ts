import data from "./words";

var startDate = new Date(2021, 5, 19, 0, 0, 0, 0);

function getWordNumberBasedOnDates(date1: string | Date, date2: string | Date) {
	var s = new Date(date1),
		t = new Date(date2).setHours(0, 0, 0, 0) - s.setHours(0, 0, 0, 0);
	return Math.round(t / 864e5);
}

export function getWordNumberFromDate(e: string | Date) {
	return getWordNumberBasedOnDates(startDate, e);
}

export const getWordFromDate = (date: string | Date) => {
	var a,
		s = getWordNumberFromDate(date);
	return (a = s % data.words.length), data.words[a];
};

export const validateWord = (word: string) => {
	return data.words.includes(word) || data.possible.includes(word);
};

export const renderEmojiGuessRow = (guess: string, correctWord: string) => {
	return correctWord
		.split("")
		.map((_n, i) => {
			if (guess[i] == correctWord[i]) return "🟩";
			if (correctWord.includes(guess[i] || "_")) return "🟨";
			return "⬛";
		})
		.join("");
};
