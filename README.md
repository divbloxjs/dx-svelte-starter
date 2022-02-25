# Divblox + Svelte + tailwindcss + daisyUI + Vite starter project

This project aims to be a starting point for new frontend projects that use divbloxjs as their backend. It contains all the basics such as routing and a solid UI framework. The project will be continuously expanded with new svelte components that we find useful when building frontend solutions on top of divbloxjs.

To use this as a template in a private repo follow these steps:

1. Create your private repository
2. Create a bare clone of this repository. (This is temporary and will be removed so just do it wherever.)
3. Mirror-push your bare clone to your new private repository.
```
cd svelte-frontend-starter.git
git push --mirror https://github.com/your_username>/<your_repo>.git
```
4. Remove the temporary local repository you created in step 1.
```
cd ..
rm -rf svelte-frontend-starter.git
```
5. Clone your new private repository to your local machine
6. Add this repo as upstream to your newly created repo:
```
git remote add upstream https://github.com/divbloxjs/svelte-frontend-starter.git
git remote set-url --push upstream DISABLE
```
7. You can list all your remotes with git remote -v. You should see:
```
origin  https://github.com/<your_username>/<your_repo>.git (fetch)
origin  https://github.com/<your_username>/<your_repo>.git (push)
upstream        https://github.com/divbloxjs/svelte-frontend-starter.git (fetch)
upstream        DISABLE (push)
```
8. Fetch the upstream:
```
git fetch upstream
git rebase upstream/main
```
or
```
git merge upstream/main
```

You should now be able to pull any future changes from this template using the above commands to fetch and rebase or merge.

## Once you have the template fetched on your local machine
To get started run: 

`npm install`

Then: 

`npm run dev`

## Tools used:

**svelte**
https://svelte.dev/

**tailwindcss**
https://tailwindcss.com/

**daisyUI**
https://daisyui.com/

For daisyUI theming: https://themes.ionevolve.com/

**Fontawesome**
https://github.com/Cweili/svelte-fa

# More details and recommendations

This template should help get you started developing with Svelte in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

## Technical considerations

**Why `global.d.ts` instead of `compilerOptions.types` inside `jsconfig.json` or `tsconfig.json`?**

Setting `compilerOptions.types` shuts out all other types not explicitly listed in the configuration. Using triple-slash references keeps the default TypeScript setting of accepting type information from the entire workspace, while also adding `svelte` and `vite/client` type information.

**Why include `.vscode/extensions.json`?**

Other templates indirectly recommend extensions via the README, but this file allows VS Code to prompt the user to install the recommended extension upon opening the project.

**Why enable `checkJs` in the JS template?**

It is likely that most cases of changing variable types in runtime are likely to be accidental, rather than deliberate. This provides advanced typechecking out of the box. Should you like to take advantage of the dynamically-typed nature of JavaScript, it is trivial to change the configuration.

**Why is HMR not preserving my local component state?**

HMR state preservation comes with a number of gotchas! It has been disabled by default in both `svelte-hmr` and `@sveltejs/vite-plugin-svelte` due to its often surprising behavior. You can read the details [here](https://github.com/rixo/svelte-hmr#svelte-hmr).

If you have state that's important to retain within a component, consider creating an external store which would not be replaced by HMR.

```js
// store.js
// An extremely simple external store
import { writable } from 'svelte/store'
export default writable(0)
```
