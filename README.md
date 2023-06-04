# Git Deno
This is a library built for Deno that allows you to interact with `Git` in your current repository. The library avoids using the [`Deno.Command`](https://deno.land/api@v1.34.1?unstable=&s=Deno.Command) and instead uses [`Deno.CWD`](https://deno.land/api@v1.34.1?unstable=&s=Deno.cwd) and filing traversing instead.

---
## Importing
Git Deno provides ES6 exports so you can import only the functions you'll need to use.
```ts
import * as git from `https://raw.githubusercontent.com/ybabts/git/0.2/src/mod.ts`;
```
It's worth noting that [`getProjectTopLevel`](#function-getprojecttoplevelsync) executes automatically when a function that requires access to the `.git` folder is needed. If you don't have the permission `--allow-read=./` when executing it will ask for permission. Until you use one of those functions, [`getProjectTopLevel`](#function-getprojecttoplevelsync) will not execute.

---
## Error Handling
All functions in this library that can throw an `Error` in this project return the Error as a value instead. This is a convention that forces you to check if the function has returned an `Error` instead of potentially ignoring it. This style of error handling reduces the changes of your program running into a panic. You can handle these errors by using `instanceof` narrowing. You can learn more about that [here](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#instanceof-narrowing). Here's an example of how the type system enforces error handling.
```ts
import { getProjectTopLevelSync } from 'https://raw.githubusercontent.com/ybabts/git/0.2/src/mod.ts';
const topLevelDirectory = getProjectTopLevelSync();
// topLevelDirectory = string | Error;
if(topLevelDirectory instanceof Error) console.log(`Error: ${topLevelDirectory.message}`);
// topLevelDirectory = string;
console.log(topLevelDirectory);
```
Until you narrow the type of the function return, you can only use methods on that type that exist on both `Error` and `String`. If you want to use `topLevelDirectory` as a String, you have to check if the value is an `String` or narrow the type to be a `String` with type guards.

---
## `function` getCurrentCommitHashSync
Gets the current commit hash that the head is on. Reads from `.git/HEAD` to get the current ref, then reads from `.git/refs/heads/${name}` to get the current commit has that head is on.
### returns `string` | `Error`
```ts
import { getCurrentCommitHashSync } from 'https://raw.githubusercontent.com/ybabts/git/0.2/src/mod.ts';

const hash = getCurrentCommitHashSync();
// d0e2addc827782d1d65897fe7655bcaa220002da
```

---
## `function` getProjectTopLevelSync
Gets the top level of a `Git` repository. It does this by checking for the `.git` directory and if it doesn't exist, it will go up a level and check again until it finds the `.git` directory or runs out of files to check. If you execute your program from the root of the directory, it will only need to read the root directory `./`.
### returns `string` | `Error`
```ts
import { getProjectTopLevelSync } from 'https://raw.githubusercontent.com/ybabts/git/0.2/src/mod.ts';

const topLevelDirectory = getProjectTopLevelSync();
// /home/username/Documents/GitHub/repository
```

---
## `function` getBranchesSync
Gets the current repository's existing branches. It does this by looking in the `.git/packed-refs` file and extracting all the branch names along with the current commit hash for those branches. If reading from the `.git/packed-refs` file fails, it will read the branch files from `.git/refs/heads`.
### returns `Branch` | `Error`
```ts
import { getBranchesSync } from 'https://raw.githubusercontent.com/ybabts/git/0.2/src/mod.ts';

const branches = getBranchesSync();
//  [
//      {
//          name: "main",
//          commitHash: "d0e2addc827782d1d65897fe7655bcaa220002da"
//      },
//      {
//          name: "testing",
//          commitHash: "459fb7a94c110686e8ba1a4376d5a5973359962f"
//      }
//  ]
```

---
## `function` getTagsSync
Gets the current repository's existing tags. It does this by looking in the `.git/refs/tags` directory and reads all the files in there.
### returns `Tag` | `Error`
```ts
import { getTagsSync } from 'https://raw.githubusercontent.com/ybabts/git/0.2/src/mod.ts';

const tags = getTagsSync();
// [
//     {
//       name: "0.1",
//       commitHash: "1741545182f5b73ac2b6b4ebe686520e86b92de2"
//     }
// ]
```