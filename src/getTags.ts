import { gitPath } from "./getProjectTopLevel.ts";

export function getTagsSync(): string[] | Error {
    try {
        const packedRefs = Deno.readTextFileSync(`${gitPath}/packed-refs`);
        const tags = extractTagsFromPackedRef(packedRefs);
        return tags;
    } catch(e) {
        try {
            const tagFileNames = await Deno.readDirSync(`${gitPath}/refs/tags`);
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
}

function extractTagsFromPackedRef(packedRefs: string): string[] {
    const lines = packedRefs.split('\n');
    const tags = [];

    for (const line of lines) {
        if (line.includes('refs/tags/')) {
            const tagRef = line.split(' ')[1];
            const tagName = tagRef.replace('refs/tags/', '');
            tags.push(tagName);
        }
    }
    return tags;
}