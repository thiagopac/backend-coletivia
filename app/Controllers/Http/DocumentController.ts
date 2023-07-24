import AiDocument from 'App/Models/AiDocument'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import fs from 'fs/promises'
import parse from 'pdf-parse'
import mammoth from 'mammoth'

export default class DocumentController {
  /**
   * @description Cria um documento
   * @param auth - O contrato de contexto HTTP
   * @param request - A requisição HTTP
   * @param response - A resposta HTTP
   * @returns O documento criado
   */
  public async createDocument({ auth, request, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user!
      const { extension } = request.body()

      const document = await AiDocument.createDocument(user, extension)
      if ('error' in document) {
        throw new Error(document.error)
      }

      return document
    } catch (error) {
      throw new Error(error)
      // return response.status(500).send({
      //   error: {
      //     message: error.message,
      //     stack: error.stack,
      //   },
      // })
    }
  }

  /**
   * @description Envia um arquivo de documento para processamento
   * @param auth - O contrato de contexto HTTP
   * @param request - A requisição HTTP
   * @param response - A resposta HTTP
   * @returns O documento processado
   */
  public async sendDocumentFile({ auth, request, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user
      const document = request.input('document')
      const file = request.file('file', { extnames: ['pdf', 'doc', 'docx'] })

      const aiDocument = await AiDocument.query()
        .where('user_id', user!.id)
        .andWhere('uuid', document)
        .first()

      if (!aiDocument) {
        return response.status(404).send({
          error: 'Documento não encontrado',
        })
      }

      const filename = file!.clientName
      const extension = filename.substring(filename.lastIndexOf('.') + 1)
      aiDocument.title = filename
      aiDocument.extension = extension

      const extracted = await this.handleFileExtraction(extension, file!.tmpPath!)
      if ('error' in extracted) {
        throw new Error(extracted.error)
      }

      aiDocument.content = JSON.stringify({ raw: extracted[0] }) as any
      await aiDocument.save()

      return aiDocument
    } catch (error) {
      throw new Error(error)
      // return response.status(500).send({
      //   error: {
      //     message: error.message,
      //     stack: error.stack,
      //   },
      // })
    }
  }

  /**
   * @description Manipula a extração de conteúdo de um arquivo
   * @param extension - A extensão do arquivo
   * @param filePath - O caminho do arquivo
   * @returns O conteúdo extraído do arquivo
   */
  private async handleFileExtraction(
    extension: string,
    filePath: string
  ): Promise<string[] | { error: string }> {
    let raw: string[] = []
    try {
      const buffer = await fs.readFile(filePath)
      if (extension === 'pdf') {
        const data = await parse(buffer)
        raw = [data.text]
      } else if (extension === 'doc' || extension === 'docx') {
        const value = await mammoth.extractRawText({ buffer: buffer })
        raw = [value.value]
      } else {
        return {
          error: 'Tipo de documento inválido',
        }
      }
    } catch (err) {
      return {
        error: 'Falha ao extrair o conteúdo do arquivo',
      }
    }
    return raw
  }

  /**
   * @description Lista documentos para um usuário
   * @param auth - O contrato de contexto HTTP
   * @param params - Os parâmetros da rota HTTP
   * @param response - A resposta HTTP
   * @returns Os documentos listados
   */
  public async list({ auth, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user
      const documents = await AiDocument.query()
        .select(['uuid', 'title', 'extension', 'created_at', 'updated_at'])
        .where('user_id', user!.id)
        .orderBy('id', 'desc')

      return documents
    } catch (error) {
      throw new Error(error)
      // return response.status(500).send({
      //   error: {
      //     message: error.message,
      //     stack: error.stack,
      //   },
      // })
    }
  }

  /**
   * @description Recupera um documento pelo UUID
   * @param auth - O contrato de contexto HTTP
   * @param params - Os parâmetros da rota HTTP
   * @param response - A resposta HTTP
   * @returns O documento recuperado
   */
  public async retrieveDocument({ auth, params, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user
      const document = await AiDocument.query()
        .select(['uuid', 'title', 'extension', 'content', 'created_at', 'updated_at'])
        .where('user_id', user!.id)
        .andWhere('uuid', params.uuid)
        .first()

      if (!document) {
        return { error: 'Documento não encontrado' }
      }

      const contentRaw = document.content['raw'] as string
      const charCount = contentRaw.length
      const wordCount = contentRaw.split(' ').length

      const modifiedDocument = {
        ...document.toJSON(),
        content: {
          charCount,
          wordCount,
        },
      }

      return modifiedDocument
    } catch (error) {
      throw new Error(error)
      // return response.status(500).send({
      //   error: {
      //     message: error.message,
      //     stack: error.stack,
      //   },
      // })
    }
  }

  /**
   * @description Exclui um documento pelo UUID
   * @param auth - O contrato de contexto HTTP
   * @param params - Os parâmetros da rota HTTP
   * @param response - A resposta HTTP
   * @returns A resposta de exclusão bem-sucedida
   */
  public async deleteDocument({ auth, params, response }: HttpContextContract) {
    try {
      const user = auth.use('user').user
      const document = await AiDocument.query()
        .where('user_id', user!.id)
        .andWhere('uuid', params.uuid)
        .first()

      if (!document) {
        return { error: 'Documento não encontrado' }
      }

      await document.delete()
      return response.noContent()
    } catch (error) {
      throw new Error(error)
      // return response.status(500).send({
      //   error: {
      //     message: error.message,
      //     stack: error.stack,
      //   },
      // })
    }
  }
}
