export type AddressMapping = Record<
  string,
  {
    level1_aliases: string[];
    level2s: Record<string, string>;
  }
>;
