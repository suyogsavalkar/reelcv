import { promises as fs } from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export async function GET() {
  try {
    const versionsDir = path.join(process.cwd(), 'src', 'app', 'data', 'versions');
    const files = await fs.readdir(versionsDir);
    const yamlFiles = files.filter(file => file.endsWith('.yaml'));

    const versions = await Promise.all(
      yamlFiles.map(async (file) => {
        const filePath = path.join(versionsDir, file);
        const content = await fs.readFile(filePath, 'utf8');
        const data = yaml.load(content);
        return {
          id: data.version.id,
          name: data.version.name,
          description: data.version.description,
          video: data.version.video,
          messages: data.version.messages
        };
      })
    );

    return Response.json(versions);
  } catch (error) {
    console.error('Error loading versions:', error);
    return Response.json({ error: 'Failed to load versions' }, { status: 500 });
  }
}