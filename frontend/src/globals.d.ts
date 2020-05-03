import "@testing-library/jest-dom/extend-expect"

declare module "*.css" {
  const css: any
  export default css
}
