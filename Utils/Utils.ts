export default class Utils {
  public static removeHyphens(texto: string): string {
    const regex = /-/g
    return texto.replace(regex, '')
  }

  public static generateRandomPassword(): string {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}|;:,.<>?'
    const passwordLength = 16

    let randomPassword = ''
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      randomPassword += charset[randomIndex]
    }

    return randomPassword
  }
}
