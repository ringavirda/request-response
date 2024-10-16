import "./styles.scss";

import { ApiService } from "./apiService";
import { Character } from "./models/character";
import { ViewModel } from "./viewModel";

const displayDefaults = () => {
  apiService.XMLHttpRequest("keqing", (error: string, char: Character) => {
    if (error == null) {
      viewModel.displayCharacter(char);
    } else {
      viewModel.displayError(error);
    }
  });

  apiService
    .promiseXMLHttpRequest("chiori")
    .then((char) => viewModel.displayCharacter(char))
    .catch((error) => viewModel.displayError(error));

  apiService
    .fetchHttpRequest("ayaka")
    .then((char) => viewModel.displayCharacter(char))
    .catch((error) => viewModel.displayError(error));
};

const viewModel = new ViewModel("render");
const apiService = new ApiService();

let waifuList: Array<string> = null!;
const waifuListElement = document.querySelector<HTMLDivElement>(".waifu-list");
if (waifuListElement !== null) {
  apiService.fetchWaifuList().then((list) => {
    waifuList = list;
    waifuListElement.textContent = waifuList.join(", ");
  });
}

const ctrlInput = document.querySelector<HTMLInputElement>(".ctrl-input");
const ctrlBtnGet = document.querySelector<HTMLButtonElement>(".ctrl-btn-get");
const ctrlBtnRandom =
  document.querySelector<HTMLButtonElement>(".ctrl-btn-rnd");

let waifuBuffer: string[] = [];
const compare = (a: string[], b: string[]) =>
  a.length === b.length && a.every((element, index) => element === b[index]);

const loadWaifus = (waifus: Array<string>) => {
  viewModel.clear();
  if (waifus.length === 0) displayDefaults();
  else {
    waifus.forEach((waifu) =>
      apiService
        .fetchHttpRequest(waifu)
        .then((char) => viewModel.displayCharacter(char))
        .catch((error) => viewModel.displayError(error)),
    );
  }
};

const parseInput = (raw: string | null | undefined) => {
  if (raw == "" || raw == undefined) return [];
  const rawUnfiltered = raw
    .split(",")
    .map((w) => w.trim().toLowerCase())
    .filter((w) => w != "");
  return rawUnfiltered.filter(
    (waifu, index) => rawUnfiltered.indexOf(waifu) === index,
  );
};

ctrlBtnGet?.addEventListener("click", () => {
  const waifus = parseInput(ctrlInput?.value);
  if (compare(waifus, waifuBuffer)) return;

  waifuBuffer = waifus;
  loadWaifus(waifus);
});

ctrlBtnRandom?.addEventListener("click", () => {
  const waifuPos: Array<number> = [];
  while (waifuPos.length < 10) {
    const next = Math.floor(Math.random() * waifuList.length);
    if (waifuPos.indexOf(next) === -1) waifuPos.push(next);
  }

  const waifus = waifuPos.map((pos) => waifuList[pos]);
  loadWaifus(waifus);
  if (ctrlInput !== null) ctrlInput.placeholder = waifus.join(", ");
});

displayDefaults();
