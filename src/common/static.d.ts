/**
 * Wrapper for raw html files.
 */
declare module "*.html" {
  const content: string;
  export default content;
}

declare module "*.png";
