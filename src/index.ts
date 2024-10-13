const render: HTMLElement | null = document.getElementById("render");
const hello: string = "This is a test message.";

if (render != null) {
    render.textContent = hello;
}