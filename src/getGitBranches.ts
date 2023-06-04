import { gitPath } from "./getProjectTopLevel.ts";

export function getGitBranchesSync(): string[] | Error {
    try {
        const packedRefs = Deno.readTextFileSync(`${gitPath}/packed-refs`);
        const branches = extractBranchesfromPackedRef(packedRefs);
        return branches;
    } catch(e) {
        try {
            const branchFileNames = Deno.readDirSync(`${gitPath}/refs/heads`);
            const branches = [];

            for (const branchFileName of branchFileNames) {
                const branchName = branchFileName.name;
                branches.push(branchName);
            }
            return branches;
        } catch(e) {
            return new Error('Unable to get git branches: ' + e.message);
        }
    }
}

function extractBranchesfromPackedRef(packedRefs: string): string[] {
    const lines = packedRefs.split('\n');
    const branches = [];

    for (const line of lines) {
        if (line.includes('refs/')) {
            const branchRef = line.split(' ')[1];
            const branchName = branchRef.replace('refs/remotes/origin/', '');
            branches.push(branchName);
        }
    }
    return branches;
}