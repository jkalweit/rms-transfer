interface Freezer_Static {
    new<T>(obj: T):IFreezer<T>;
}
interface IFreezer<T> {
  get(): T;
  on(event: string, callback: any): void;
}

declare var freezer: Freezer_Static;

export = freezer;
