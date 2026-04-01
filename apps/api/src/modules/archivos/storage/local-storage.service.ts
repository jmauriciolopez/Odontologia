import { Injectable } from '@nestjs/common';
import { IStorageService, StorageFile } from './storage.interface';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LocalStorageService implements IStorageService {
  private readonly uploadPath = path.join(process.cwd(), 'uploads');

  constructor() {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async save(file: StorageFile, folder: string): Promise<string> {
    const targetFolder = path.join(this.uploadPath, folder);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const fileName = `${uuidv4()}-${file.originalname}`;
    const filePath = path.join(targetFolder, fileName);
    
    fs.writeFileSync(filePath, file.buffer);
    
    return path.join(folder, fileName).replace(/\\/g, '/');
  }

  async delete(filePath: string): Promise<void> {
    const absolutePath = path.join(this.uploadPath, filePath);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }
  }

  getUrl(filePath: string): string {
    // Para desarrollo, asumiendo que exponemos la carpeta uploads como estática
    return `/uploads/${filePath}`;
  }
}
