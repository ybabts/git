import { gitPath } from "./getProjectTopLevel.ts";
import { Tag } from "./Tag.ts";

export function getTagsSync(): Tag[] | Error {
  try {
    const tagFiles = Deno.readDirSync(`${gitPath}/refs/tags`);
    const tags: Tag[] = [];

    for (const tagFile of tagFiles) {
      if (tagFile.isFile) {
        tags.push(readTagFile(tagFile));
      }
    }
    return tags;
  } catch (e) {
    return new Error("Unable to get git tags: " + e.message);
  }
}

function readTagFile(tagFile: Deno.DirEntry): Tag {
  return {
    name: tagFile.name,
    commitHash: Deno.readTextFileSync(`${gitPath}/refs/tags/${tagFile.name}`)
      .trim(),
  };
}
