import { gitPath } from "./getProjectTopLevel.ts";

export function getTagsSync(): string[] | Error {
    try {
        const tagFileNames = Deno.readDirSync(`${gitPath}/refs/tags`);
        const tags = [];

        for (const tagFileName of tagFileNames) {
            if(tagFileName.isFile) {
                const tagName = tagFileName.name;
                tags.push(tagName);
            }
        }
        return tags;
    } catch(e) {
        return new Error('Unable to get git tags: ' + e.message);
    }
}