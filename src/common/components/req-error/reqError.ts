import "./req_error.scss";
import template from "./req_error.html";

export class RequestError {
  public element: HTMLDivElement;

  constructor(message: string) {
    // Create mounting point.
    const errorElement = document.createElement("div");
    errorElement.innerHTML = template;
    // Set message.
    const messageElement =
      errorElement.querySelector<HTMLDivElement>(".err-message");
    if (messageElement != null) messageElement.textContent = message;
    this.element = errorElement;
  }
}
