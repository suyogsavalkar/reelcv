import Papa from 'papaparse';
import { generateId } from './helpers';
import yaml from 'js-yaml';

export async function createVersionId() {
  return generateId(12);
}

export async function loadVersionData(versionId) {
  try {
    const response = await fetch(`/api/resume/${versionId}`);
    if (!response.ok) {
      throw new Error('Failed to load resume data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading version data:', error);
    return null;
  }
}

async function loadCSV(filePath) {
  const response = await fetch(filePath);
  const csv = await response.text();
  return new Promise((resolve) => {
    Papa.parse(csv, {
      header: true,
      complete: (results) => resolve(results.data)
    });
  });
}

function filterByVersion(data, versionId) {
  return data.filter(item => item.version_id === versionId);
}