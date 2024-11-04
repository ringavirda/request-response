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
