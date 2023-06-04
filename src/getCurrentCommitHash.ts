import { gitPath } from "./getProjectTopLevel.ts";

export function getCurrentCommitHashSync(): string | Error {
  const headFile = Deno.readTextFileSync(`${gitPath}/HEAD`);
  const refMatch = headFile.match(/^ref: (.*)$/m);

  if (refMatch) {
    const refFile = Deno.readTextFileSync(`${gitPath}/${refMatch[1]}`);
    const commitHashMatch = refFile.match(/^(\w{40})$/m);

    if (commitHashMatch) {
      return commitHashMatch[1];
    }
  }

  return new Error("Unable to get current commit hash");
}
