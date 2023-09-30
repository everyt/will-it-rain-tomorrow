import { readTextFile, writeTextFile, exists, createDir, BaseDirectory } from '@tauri-apps/api/fs';


export default async function fileSystem() {
  const AppData = BaseDirectory.AppData;
  const Folder = 'wirt';
  const File = 'diary';

  async function writeFile() {
    const Config = 
    `
    이 글을 보고 있을 너에게,
    `;
  
    if (!await exists(Folder, { dir: AppData })) {
      await createDir(Folder, { dir: AppData, recursive: true });
    }
  
    await writeTextFile(File, Config, { dir: BaseDirectory.AppConfig });
  }

  async function readFile() {
    const contents = await readTextFile(File, { dir: BaseDirectory.AppConfig });
  }
    
}
