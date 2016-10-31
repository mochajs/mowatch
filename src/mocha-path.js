// finds mocha executable
import {sync as resolve} from 'resolve';
import {join, resolve as pathResolve} from 'path';
import npmPaths from 'npm-paths';

function executablePath (forceModulePath = modulePath()) {
  return join(forceModulePath, 'bin', '_mocha');
}

function modulePath (moduleName = 'mocha') {
  if (moduleName !== 'mocha') {
    return resolve(pathResolve(process.cwd(), moduleName));
  }
  try {
    return resolve(moduleName, {
      baseDir: process.cwd(),
      paths: npmPaths()
    });
  } catch (ignored) {
    // ignored
  }
}

export {modulePath, executablePath};


