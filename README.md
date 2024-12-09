# rainfall

This is a monorepo for Holistic Systems' website and
the development of future programs.

For the meaning of the name, please read the memorial.

## Usage

In the beginning was the the word, and the word was with God, and the word was God.

And then God said, let there be light.

We in the light of God are trying to build the tools that will improve the lives of people in as many ways as possible.

Encryption as a non-intrusive default. Modular software and a seamless integration. A foundation for testing the craziest ideas.

### Usage

The primary language is Bun (Javascript), which you can install from [bun.sh](https://bun.sh). However, we also like Python, ZSH, Ruby, Crystal, Rust, Go, etc. and some of these modules will be written in those languages.

Please keep Cargo files, Gemfiles, etc in your module's directory.

### Workspaces

Workspaces are built in subfolders of cosmos. There are (too many) kinds:

* `cosmos/web/...` - Websites, likely React, for Holistic Systems and its projects.

* `cosmos/libs/...` - Libraries that are used by other modules.
Remember, to share across workspaces in bun, the package.json must include a dependency `"@rainfall/libs": "file:../libs"`.
This is because the package.json is copied to the build directory, and the symlink is not.

* `cosmos/apps/...` - Applications that are standalone, but not websites. React Native, Neutralino, Rust, etc. These are 'workspaces', in the node sense, so build anything here.

* `cosmos/utils/...` - Software utility source code. Script partials, utility libraries, binary source code, etc.

* `cosmos/ext/...` - Extensions to other software. For example, a browser extension, a VSCode extension, etc.

* `cosmos/bin/...` - Tools that are used by developers, but not end-users. CLI, GUI, etc. They should have a bin folder with +x executable files; the .envrc should include the bin folder in the PATH, assuming you install `direnv`.

* `cosmos/pkg/...` - Modules meant for distribution. These are the modules that are published to npm, rubygems, etc. They should have a package.json with a version number, and a README.md with usage instructions.

* `cosmos/svc/...` - Services, deployable, which provide functionality to the ecosystem of the monorepo's SOA. As we are distributist and anticloud, these services are meant to be run on your own servers, or on a server you trust. They may be dockerized.

* `cosmos/sys/...` - Systems and infrastructure; crazy things that work together; application plumbing. Build things like CI/CD, monitoring, deployment, pentesting, weird things that make your grand project work, etc. The automation delegators would go here.

* `cosmos/mod/...` - Modules that are not meant to be used directly, but are used by other modules. They may have a package.json, but should be imported by other modules. They are different than libraries in that they are *potentially* publishable, but may be opinionated to the point of being unusable outside of the ecosystem.

* `cosmos/ext/...` - Bricks on top of bricks. Lay out your POC and make something here better.

* `cosmos/bots/...` - Worker scripts, delegators, procedurals, agents, and what have you. These are the things that do the work, and they should be in a separate workspace.

* `cosmos/alexandria/...` - Documentation, manuals, guides, and other written works. This is the place for the written word. Use markdown or text; put your vscode copilot instructions here, etc.

* `cosmos/titan/...` - Projects. The really big projects you'll never finish but want to scope out. Start here, and see where it takes you. Ideal for branches.

* `cosmos/etc/...` - Configuration and documentation for other projects. Database connections, etc. Encrypt your secrets please:

Language              |   Cryptographic Library
----------------------|-------------------------
Bun                   |  Bun.encrypt / Bun.decrypt
Python                |  Fernet
Ruby                  |  libsodium (RbNaCl)
Crystal               |  libsodium (Libsodium)
Rust                  |  libsodium (Sodiumoxide)
Go                    |  libsodium (GoSodium)
ZSH                   |  generate pems with a script (will be added)
File Encryption       |  AES-256-GCM via OpenSSL
Whitespace            |  Why?

### Development Philosophy

We're here to make great things and share code without stepping on each other's toes. Here are some guidelines:

1. Use the main branch and your own workspace preferentially. If you touch a lot of workspaces, then start a branch.

2. Ambitious projects go in titan. Websites go in web. Ambitious websites usually go in web. Almost anything else should be very small.

3. APIs are sites. They go in web. When you create a react app, use `bun create react-app myapp` from the web folder. When you create anything else, just make a folder and `bun init` or whatever.

4. TSConfig is going to be nosy but not very strict at root. Override it in your workspace, especially for absolute imports.

### Opinions

* imports are generally better than requires.
* Install the vscode extension that lets you add `project://` links to other files.
* Put a readme everywhere.
* Logs go into a file in the root log directory named after the workspace. You should pass loggers to shared libraries. For instance, project "metrix" would log to `logs/metrix.YYMMDD.log`.
* Environment variables in .envrc use Rainfall__VarName as a default. Library functions for zsh sharing are written as __fn() or __rainfall_fn(). Zsh is preferential because of how it shares libraries.
* Prefer bun to node; prefer postgres or sqlite to mysql; prefer rust to c++; use either ruby or python; use rust or crystal for compiled; use go if you can; use zsh for scripting (except install scripts for docker, where you should use sh and shellcheck).
* Please use homebrew on your mac.
* Prefer encrypted JSON for configuration files. Reason: Javascript, Ruby, Python, and Crystal have stdlib support. Ruby can use YAML internally. Rust can and should prefer toml. If you need to convert, use yq for it. For example, xml to json is `cat my.xml | yq -px -oj . > my.json`.
* Debian systems use 'ruby-full' on apt. Macs use ruby-build and chruby.
* This is *Holistic Systems*. Everything works with everything else.
* Symlink bins to the cosmos/bins/shared folder; this is the folder that is added to the path in the .envrc. If you need to install a binary, put it in the bins workspace or the bin folder of your workspace.
* If you need to add more environment variables, you can nest .envrc files. If necessary, we can add a folder to config with profiles which .envrc will source.