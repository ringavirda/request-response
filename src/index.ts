import { ApiService } from "./apiService.js";
import { Character } from "./models/character.js";
import { ViewModel } from "./viewModel.js"

const viewModel = new ViewModel("renderer");
const apiService = new ApiService();

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