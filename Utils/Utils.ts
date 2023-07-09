export default class Utils {
  public static removeHyphens(texto: string): string {
    const regex = /-/g
    return texto.replace(regex, '')
  }
}
