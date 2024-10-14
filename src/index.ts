import "./styles.scss"

import { ApiService } from "./apiService";
import { Character } from "./models/character";
import { ViewModel } from "./viewModel"

const viewModel = new ViewModel("render");
const apiService = new ApiService();

apiService.XMLHttpRequest("keing", (error: string, char: Character) => {
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