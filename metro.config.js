const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Exclude directories from Metro's file watcher to prevent ENOENT errors
// on Windows when watching non-existent build directories
config.watchFolders = [];

// Configure projectRoot explicitly
config.projectRoot = __dirname;

// Add project root back to watchFolders after setting it to empty
config.watchFolders = [__dirname];

// Exclude problematic directories from being watched
config.resolver.blockList = [
  // Exclude .cxx directory which is created/deleted during Android builds
  /node_modules\/.*\/\.cxx\/.*/,
  // Exclude gradle cache
  /node_modules\/.*\/\.gradle\/.*/,
];

module.exports = config;
