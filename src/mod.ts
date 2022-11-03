export async function getCurrentCommitHash() {
    const r = Deno.run({
        cmd: ['git', 'rev-parse', 'HEAD'],
        stdout: 'piped'
    });
    const output = await r.output();
    return new TextDecoder().decode(output);
}

console.log('testing branch')

const result = await getCurrentCommitHash();

console.log(result);