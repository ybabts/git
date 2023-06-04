import { gitPath } from "./getProjectTopLevel.ts";
import { Branch } from "./Branch.ts";

export function getBranchesSync(): Branch[] | Error {
  try {
    const packedRefs = Deno.readTextFileSync(`${gitPath}/packed-refs`);
    const branches = extractBranchesfromPackedRef(packedRefs);
    return branches;
  } catch (_e) {
    try {
      const branchFiles = Deno.readDirSync(`${gitPath}/refs/heads`);
      const branches: Branch[] = [];

      for (const branchFile of branchFiles) {
        if (branchFile.isFile) {
          branches.push(readBranchFile(branchFile));
        }
      }
      return branches;
    } catch (e) {
      return new Error("Unable to get git branches: " + e.message);
    }
  }
}

function extractBranchesfromPackedRef(packedRefs: string): Branch[] {
  const lines = packedRefs.split("\n");
  const branches: Branch[] = [];

  for (const line of lines) {
    if (line.includes("refs/")) {
      const branchRef = line.split(" ")[1];
      const branchName = branchRef.replace("refs/remotes/origin/", "");
      branches.push({
        name: branchName,
        commitHash: line.split(" ")[0],
      });
    }
  }
  return branches;
}

function readBranchFile(branchFile: Deno.DirEntry): Branch {
  return {
    name: branchFile.name,
    commitHash: Deno.readTextFileSync(
      `${gitPath}/refs/heads/${branchFile.name}`,
    ).trim(),
  };
}
