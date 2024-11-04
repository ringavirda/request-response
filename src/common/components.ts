import { container } from "tsyringe";
import { constructor } from "tsyringe/dist/typings/types";
import { ComponentBase } from "./components/componentBase";

export async function loadComponent<T extends ComponentBase>(
  anchor: HTMLDivElement | null,
  type: constructor<T>,
  model?: object,
): Promise<T> {
  if (anchor === null)
    throw new Error(`Uninitialized anchor element for: ${type.name}`);
  const component = container.resolve(type);
  await component.initialize(anchor, model);
  component.refresh(anchor);
  return component;
}

export { ComponentBase } from "./components/componentBase";
export { CharacterCard } from "./components/character-card/characterCard";
export { RequestError } from "./components/req-error/reqError";
