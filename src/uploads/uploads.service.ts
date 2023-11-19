// upload.service.ts

import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadsService {
  handleFile(file: any, name?: string) {
    const uploadedFile = file.originalname;
    const uploadPath = path.join(__dirname, '..', '..', 'public', 'files');
    
    // Gere um novo nome de arquivo (você pode usar uma lógica mais avançada, se necessário)
    let newFileName = `${Date.now()}-${uploadedFile}`;

    if (name) {
      newFileName = name;
    }
    
    // Construa o caminho completo do novo arquivo
    const newPath = path.join(uploadPath, newFileName);

    try {
      // Crie o diretório se não existir
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      // Mova o arquivo para o novo caminho
      fs.renameSync(file.path, newPath);

      // Retorne o caminho do arquivo salvo (ou outras informações que você possa precisar)
      return newPath;
    } catch (error) {
      console.error('Erro ao salvar o arquivo:', error.message);
      throw new Error('Erro ao salvar o arquivo');
    }
  }
}
