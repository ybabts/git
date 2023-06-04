export function getCurrentCommitHashSync(): string {
  const headFile = Deno.readTextFileSync("./.git/HEAD");
  const refMatch = headFile.match(/^ref: (.*)$/m);

  if (refMatch) {
    const refFile = Deno.readTextFileSync(`./.git/${refMatch[1]}`);
    const commitHashMatch = refFile.match(/^(\w{40})$/m);

    if (commitHashMatch) {
      return commitHashMatch[1];
    }
  }

  throw new Error("Unable to get current commit hash");
}