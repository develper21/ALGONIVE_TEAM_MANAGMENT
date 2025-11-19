import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

const UPLOAD_ROOT = process.env.TASK_UPLOAD_DIR || path.join(process.cwd(), 'uploads');
const TASK_UPLOAD_ROOT = path.join(UPLOAD_ROOT, 'tasks');

const ensureDirectory = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

ensureDirectory(UPLOAD_ROOT);
ensureDirectory(TASK_UPLOAD_ROOT);

export const ensureTaskUploadDir = (taskId) => {
  const normalizedId = taskId?.toString();
  if (!normalizedId) {
    throw new Error('Invalid task id for attachments');
  }
  const dir = path.join(TASK_UPLOAD_ROOT, normalizedId);
  ensureDirectory(dir);
  return dir;
};

export const getTaskRelativePath = (taskId, storedName) => {
  return path.join('tasks', taskId.toString(), storedName).replace(/\\/g, '/');
};

export const resolveAttachmentPath = (relativePath) => {
  return path.join(UPLOAD_ROOT, relativePath);
};

const codeExtensions = new Set(['.js', '.jsx', '.ts', '.tsx', '.py', '.rb', '.java', '.cs', '.go', '.php', '.html', '.css', '.scss', '.json', '.md', '.yml', '.yaml']);
const documentExtensions = new Set(['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt']);
const pdfExtensions = new Set(['.pdf']);
const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp']);

export const detectFileType = (mimeType = '', originalName = '') => {
  const extension = path.extname(originalName).toLowerCase();
  if (pdfExtensions.has(extension) || mimeType === 'application/pdf') return 'pdf';
  if (codeExtensions.has(extension)) return 'code';
  if (documentExtensions.has(extension)) return 'document';
  if (imageExtensions.has(extension) || mimeType.startsWith('image/')) return 'image';
  return 'other';
};

export const uploadRootPath = UPLOAD_ROOT;
