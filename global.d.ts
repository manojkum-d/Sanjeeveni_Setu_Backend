// In a file like global.d.ts
declare module "bcrypt" {
  export function hash(
    data: string | Buffer,
    saltOrRounds: string | number
  ): Promise<string>;

  export function compare(
    data: string | Buffer,
    encrypted: string
  ): Promise<boolean>;

  // Add other methods as needed
}
