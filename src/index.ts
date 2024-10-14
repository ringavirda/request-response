import "./styles.scss"

import { ApiService } from "./apiService";
import { Character } from "./models/character";
import { ViewModel } from "./viewModel"

const displayDefaults = () => {
    apiService.XMLHttpRequest("keqing", (error: string, char: Character) => {
        if (error == null) {
            viewModel.displayCharacter(char);
        } else {
            viewModel.displayError(error);
        }
    })

    apiService.promiseXMLHttpRequest("chiori")
        .then((char) => viewModel.displayCharacter(char))
        .catch((error) => viewModel.displayError(error));

    apiService.fetchHttpRequest("ayaka")
        .then((char) => viewModel.displayCharacter(char))
        .catch((error) => viewModel.displayError(error));
};

const parseInput = (raw: string | null | undefined) => {
    if (raw == "" || raw == undefined) return [];
    return raw.split(",").map(w => w.trim().toLowerCase());
};

const viewModel = new ViewModel("render");
const apiService = new ApiService();

const ctrlInput = document.querySelector<HTMLInputElement>(".ctrl-input");

ctrlInput?.addEventListener("focusout", () => {
    viewModel.clear();
    const waifus = parseInput(ctrlInput?.value);

    if (waifus.length === 0) displayDefaults();
    else {
        waifus.forEach((waifu) => apiService.fetchHttpRequest(waifu)
            .then((char) => viewModel.displayCharacter(char))
            .catch((error) => viewModel.displayError(error)));

    }
});

displayDefaults()
