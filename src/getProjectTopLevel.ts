export const gitPath = `${getProjectTopLevelSync()}/.git`;

export function getProjectTopLevelSync(): string | Error {
  let currentDir = Deno.cwd();

  while (currentDir !== "/") {
    try {
      const fileInfo = Deno.statSync(`${currentDir}/.git`);
      if (fileInfo.isDirectory) {
        return currentDir;
      }
    } catch (_e) {
      // Directory not found, continue traversing up
    }

    currentDir = `${currentDir}/..`;
  }
  return new Error("Failed to find the top level of project directory");
}
