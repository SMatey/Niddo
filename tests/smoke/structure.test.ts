import fs from 'fs';
import path from 'path';

describe('Project Structure Smoke Test', () => {
  const rootDir = path.resolve(__dirname, '../../');

  const requiredDirs = [
    'src/features',
    'src/lib',
    'supabase/migrations',
  ];

  test.each(requiredDirs)('directory "%s" should exist', (dir) => {
    const fullPath = path.join(rootDir, dir);
    expect(fs.existsSync(fullPath)).toBe(true);
    expect(fs.lstatSync(fullPath).isDirectory()).toBe(true);
  });

  test('.env should be ignored by git', () => {
    const gitignorePath = path.join(rootDir, '.gitignore');
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    expect(gitignoreContent).toMatch(/\.env/);
  });
});
