# Git Deno
This is a library built for Deno that allows you to interact with `Git` in your current repository.

## Importing
When importing from `raw.githubusercontent.com` you should provide the commit that you are pulling from to use that version of the code. If you do not, you'll recieve the latest version which won't be updated in Deno until you manually refresh it. This can cause problems in deployment.
```ts
import * as git from `https://raw.githubusercontent.com/ybabts/git-deno/${git-hash}/src/mod.ts`;
```