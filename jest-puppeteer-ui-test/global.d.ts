declare namespace jest {
  interface Matchers<R> {
    toHaveElement(selector:string);
    toBeStartWith(selector:string);
  }
}

