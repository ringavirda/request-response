import { container } from "tsyringe";
import { constructor } from "tsyringe/dist/typings/types";

export async function loadComponent<T extends ComponentBase>(
  anchor: HTMLElement | null,
  type: constructor<T>,
  model?: any,
): Promise<T> {
  if (anchor === null)
    throw new Error(`Uninitialized anchor element for: ${type.name}`);

  const component = container.resolve(type);
  component.load(anchor);
  await component.initialize(anchor, model);

  return component;
}

export abstract class ComponentBase {
  private _element: HTMLElement;
  protected _template: string;

  constructor(html: string) {
    const root = document.createElement("div");
    root.innerHTML = html;

    this._element = root;
    this._template = html;
  }

  public abstract initialize(
    anchor?: HTMLElement,
    model?: object,
  ): Promise<void>;

  public load(anchor: HTMLElement): void {
    for (const ch of this._element.childNodes) {
      anchor.append(ch);
    }
  }

  protected getElement<T extends HTMLElement>(selector: string) {
    const element = this._element.querySelector<T>(selector);
    if (element === null)
      throw new Error(`Element wasn't found with the selector ${selector}`);
    return element as T;
  }

  protected validateModel<T>(model?: T) {
    if (model === undefined) throw new Error(`Component model is undefined.`);
    return model as T;
  }
}

export { CharacterCard } from "./chars-page/character-card/characterCard";
export { RequestError } from "./chars-page/req-error/reqError";
