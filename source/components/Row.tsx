import React, { FC } from "react";
import { EmptyRow } from "./EmptyRow";
import { CompletedRow } from "./CompletedRow";
import { InputRow } from "./InputRow";

interface RowProps {
	active: boolean;
	done: boolean;
	inputWord: string;
	finalWord: string;
	correctWord: string;
	notInWordList: boolean;
}
export const Row: FC<RowProps> = ({
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
