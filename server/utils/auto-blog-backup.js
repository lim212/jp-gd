
// Auto Blog Backup System
class AutoBlogBackup {
  constructor() {
    this.backupDir = path.join(process.cwd(), 'backups');
    this.maxBackups = 7; // Keep only 7 days of backups to save disk space (reduced from 30)
  }

  async createBackup() {
    try {
      await fs.mkdir(this.backupDir, { recursive: true });
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupName = `auto-blog-backup-${timestamp}`;
      const backupPath = path.join(this.backupDir, backupName);
      
      await fs.mkdir(backupPath, { recursive: true });
      
      // Backup generated blogs
      const generatedDir = path.join(process.cwd(), 'data/blog/generated');
      const backupGeneratedDir = path.join(backupPath, 'generated');
      
      if (await this.directoryExists(generatedDir)) {
        await this.copyDirectory(generatedDir, backupGeneratedDir);
      }
      
      // Backup configuration files
      const configFiles = [
        'auto-blog-config.json',
        'data/keyword-rotation.json',
        'data/keywords'
      ];
      
      for (const file of configFiles) {
        const sourcePath = path.join(process.cwd(), file);
        const destPath = path.join(backupPath, file);
        
        if (await this.directoryExists(sourcePath)) {
          await this.copyDirectory(sourcePath, destPath);
        } else if (await this.fileExists(sourcePath)) {
          await fs.copyFile(sourcePath, destPath);
        }
      }
      
      console.log(`✅ Backup created: ${backupName}`);
      await this.cleanupOldBackups();
      
    } catch (error) {
      console.error('❌ Backup failed:', error);
    }
  }

  async cleanupOldBackups() {
    try {
      const backups = await fs.readdir(this.backupDir);
      const backupDirs = backups.filter(name => name.startsWith('auto-blog-backup-'));
      
      if (backupDirs.length > this.maxBackups) {
        const sortedBackups = backupDirs.sort();
        const toDelete = sortedBackups.slice(0, backupDirs.length - this.maxBackups);
        
        for (const backup of toDelete) {
          const backupPath = path.join(this.backupDir, backup);
          await fs.rm(backupPath, { recursive: true, force: true });
          console.log(`🗑️ Deleted old backup: ${backup}`);
        }
      }
    } catch (error) {
      console.error('Error cleaning up backups:', error);
    }
  }

  async directoryExists(path) {
    try {
      const stat = await fs.stat(path);
      return stat.isDirectory();
    } catch {
      return false;
    }
  }

  async fileExists(path) {
    try {
      const stat = await fs.stat(path);
      return stat.isFile();
    } catch {
      return false;
    }
  }

  async copyDirectory(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        await this.copyDirectory(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  }
}

export default AutoBlogBackup;
