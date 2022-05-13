import { reactive } from "vue";
import { Circit as Circuit } from "./elements";

export const AppState = reactive({
    name: "Heloop",
    circuit: new Circuit(4),
    currentInput: '0010'
})



