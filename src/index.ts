import "./styles.scss";

import { ApiService } from "./apiService";
import { ViewModel } from "./viewModel";

// Load and render Keqing, Chiori and Ayaka using legacy api.
const displayDefaults = () => {
  // XML request.
  apiService.rawXMLHttpRequest("keqing", (error, char) => {
    if (error == "" && char != null) {
      viewModel.displayCharacter(char);
    } else {
      viewModel.displayError(error);
    }
  });
  // Promise wrapper for the XML request.
  apiService
    .promiseXMLHttpRequest("chiori")
    .then((char) => viewModel.displayCharacter(char))
    .catch((error) => viewModel.displayError(error));
  // Fetch API.
  apiService
    .fetchHttpRequest("ayaka")
    .then((char) => viewModel.displayCharacter(char))
    .catch((error) => viewModel.displayError(error));
};

// Model and repository instances.
const viewModel = new ViewModel("render");
const apiService = new ApiService();

// Load and display list of known waifus.
let waifuList: Array<string> = null!;
const waifuListElement = document.querySelector<HTMLDivElement>(".waifu-list");
if (waifuListElement !== null) {
  apiService.fetchWaifuList().then((list) => {
    waifuList = list;
    waifuListElement.textContent = waifuList.join(", ");
  });
}

// Extract control elements.
const ctrlInput = document.querySelector<HTMLInputElement>(".ctrl-input");
const ctrlBtnGet = document.querySelector<HTMLButtonElement>(".ctrl-btn-get");
const ctrlBtnRandom =
  document.querySelector<HTMLButtonElement>(".ctrl-btn-rnd");

// Register waifu fetching logic.
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

// Helper function to parse string into unique array of targets.
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

// Register next waifu retrieval logic.
ctrlBtnGet?.addEventListener("click", () => {
  // Drop request if no changes detected.
  const waifus = parseInput(ctrlInput?.value);
  if (compare(waifus, waifuBuffer)) return;
  // Load new waifus.
  waifuBuffer = waifus;
  loadWaifus(waifus);
});

// Register random waifu array retrieval logic.
ctrlBtnRandom?.addEventListener("click", () => {
  // Create unique index array.
  const waifuPos: Array<number> = [];
  while (waifuPos.length < 10) {
    const next = Math.floor(Math.random() * waifuList.length);
    if (waifuPos.indexOf(next) === -1) waifuPos.push(next);
  }
  // Translate using known waifu names.
  const waifus = waifuPos.map((pos) => waifuList[pos]);
  // Load constructed targets.
  loadWaifus(waifus);
  // Update placeholder with loaded names.
  if (ctrlInput !== null) ctrlInput.placeholder = waifus.join(", ");
});

// Display Keqing, Chiori and Ayaka as default waifus.
displayDefaults();
