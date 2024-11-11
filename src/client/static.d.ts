/**
 * Wrapper for raw html files.
 */
declare module "*.html" {
  const content: string;
  export default content;
}

/**
 * Wrapper for raw image files.
 */
declare module "*.png";
