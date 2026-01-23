#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const PLUGIN_NAME = 'fivem-dev';

// Determine Claude plugins directory
function getClaudePluginsDir() {
  const homeDir = os.homedir();
  return path.join(homeDir, '.claude', 'plugins', 'marketplaces', PLUGIN_NAME);
}

// Copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.name === 'node_modules' || entry.name === '.git') {
      continue; // Skip these directories
    }

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function install() {
  const packageDir = path.resolve(__dirname, '..');
  const targetDir = getClaudePluginsDir();

  console.log(`\n🎮 Installing FiveM Dev Plugin for Claude Code...\n`);
  console.log(`   Source: ${packageDir}`);
  console.log(`   Target: ${targetDir}\n`);

  try {
    // Create target directory
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Copy plugin files
    copyDir(packageDir, targetDir);

    console.log(`✅ FiveM Dev Plugin installed successfully!\n`);
    console.log(`📚 Usage:`);
    console.log(`   - Ask FiveM questions naturally`);
    console.log(`   - Use /fivem-dev command for direct queries\n`);
    console.log(`🔗 Documentation: https://github.com/melihbozkurt10/fivem-dev-plugin\n`);

  } catch (error) {
    console.error(`❌ Installation failed: ${error.message}`);
    console.error(`\nManual installation:`);
    console.error(`   Copy contents to: ${targetDir}`);
    process.exit(1);
  }
}

install();
