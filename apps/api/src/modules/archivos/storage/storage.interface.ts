export interface StorageFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export interface IStorageService {
  save(file: StorageFile, folder: string): Promise<string>;
  delete(path: string): Promise<void>;
  getUrl(path: string): string;
}
