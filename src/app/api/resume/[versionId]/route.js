import { promises as fs } from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export async function GET(request) {
  try {
    const versionId = request.nextUrl.pathname.split('/').pop();
    console.log('Loading version:', versionId);

    // Ensure correct file path
    const filePath = path.join(process.cwd(), 'src', 'app', 'data', 'versions', `${versionId}.yaml`);
    console.log('File path:', filePath);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (e) {
      console.log('File not found:', filePath);
      return Response.json({ error: 'Version not found' }, { status: 404 });
    }

    const yamlText = await fs.readFile(filePath, 'utf8');
    const data = yaml.load(yamlText);

    if (!data) {
      return Response.json({ error: 'Invalid YAML data' }, { status: 400 });
    }

    const responseData = {
      header: data.header || {},
      skills: [...(data.skills?.technical || []), ...(data.skills?.tools || [])],
      projects: data.projects || [],
      experiences: data.experience || [],
      modal_experience: data.modal_experience || [],
      leadership: data.leadership || [],
      hobbies: data.beyondWork || []
    };

    return Response.json(responseData);
  } catch (error) {
    console.error('API Error:', error);
    return Response.json(
      { error: 'Failed to load resume data', details: error.message },
      { status: 500 }
    );
  }
}