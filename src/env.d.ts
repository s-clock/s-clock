declare module '*.less' {}

declare module '*.module.less' {
  const r: Record<string, string>;
  export default r;
}
