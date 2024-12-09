# Code Reviews

Code review style is a little different depending on idiom, user, and language:

## Ruby

- Namespaced modules and classes are used to organize code.
- We tend to reinitialize the module if we're building a nested constant within.

## JavaScript
- For function libraries, we like to tack functions onto an object. Example:
```javascript
const _ = Object.create(null);
const O = _();
O.fn = _();
O.fn.curry = (f,...a) => (...b) => f(...a,...b);
O.fn.toFn = (f) => (typeof f === 'function') ? f : () => f;

```javascript
O.add = (k) => ({to: (obj) => {
  const dp = O.fn.curry(Object.defineProperty, obj, key);
  return ({
    get: (v) => dp({ get: O.fn.toFn(v) }),
    set: (fn) => dp({ set:  fn }),
    value: (v) => dp({ value: v }),
    method: (fn) => dp({ value: O.fn.toFn(fn) }),
  });
})
O.add('obj').to(O.fn).get(_)
```

For JS Classes, we like both assignment of classes to variables and the use of `export { exportable objects }` at the end of the file.
We don't particularly like to modify *base* prototypes, but we may add conversion/coercion methods to convert to an extended class.

Example:
```javascript
const BetterString = class extends String {
  constructor(str){ super(str); }
  chunk(size=2) { return this.match(new RegExp(`.{1,${size}}`, 'g')); }
  toCharCodes() { return this.split('').map(c => c.charCodeAt(0)); }
  get encrypted() { return Bun.encrypt(this); }
  get decrypted() { return Bun.decrypt(this); }
}
O.add('upgrade').to(String.prototype).method(() => new BetterString(this));
```

For JSX, we prefer simple jsx for smaller components without much
intricacy. Generally, styles go in a single SASS/SCSS file, though
tailwind or styled-components are acceptable.

```jsx
import React from 'react';
import logo from '@/assets/logo.svg';
import '@/styles/App.scss';
const App = async ({children}) => {
  return (
    <div className="app">
      <header className="header">
        <CornerLogo image={logo}/>
        <h1>Welcome to the App</h1>
      </header>
      <main className="main">
        {children}
      </main>
    </div>
  );
}
export { App }
```

- We also like to have a single index.js file in containing folders that export all the components in that folder, or in subfolders.

## Python

I'm not strongly opinionated about Python. I prefer line comprehensions and longer lines, using imports at the top with aliases for common terms, and using `__all__` to define what is exported. Annotations are ideal, but not required.

```python
from typing import List, Dict, Any
from functools import reduce
from operator import add
from . import _ as _

__all__ = ['add', 'reduce', 'List', 'Dict', 'Any']
```

## Rust

I like the main/lib dichotomy, and to have my modules folders clearly defined. I like to have a `lib.rs` file in each module folder that exports the modules in that folder. I like to have a `main.rs` file in the root of the project that imports the modules and runs the program. When lib gets too big, I like to use a module
to load the modules in the lib folder.
Struct/mod/pub patterns are good, but know when to break up a file;
you can quickly get into demeter's law territory.

```rust

Struct EZCipher {
  key: String,
  iv: String,
  cipher: Cipher,
  encryptor: Encryptor,
  decryptor: Decryptor,
}
mod cipher {
  pub struct Cipher {
    key: String,
    iv: String,
    algo: Algo,
  }
  impl Cipher {
    pub fn new(key: String, iv: String) -> Self {
      let algo = Algo::new();
      Self { key, iv, algo }
    }
  }
}
mod encryptor {
  pub struct Encryptor {
    cipher: Cipher,
  }
  impl Encryptor {
    pub fn new(cipher: Cipher) -> Self {
      Self { cipher }
    }
  }
}

```

etc.

## Crystal

I like to keep my Crystal ruby-like. That does mean encapsulated methods, when short:

```crystal

module EZCipher
  class Cipher
    def initialize(@key : String, @iv : String); @algo = Algo.new; end
  end
  class Encryptor; def initialize(@cipher : Cipher); end; end
end
```

### ZSH

Use function exports.
Use functions for everything.
Create scripts to test system configuration.
Use things like the following:

```zsh

__safequit(){
  local message="${1:-"Exiting"}"
  echo $message
  exit 0
}

__ragequit(){
  local message="${1:-"Exiting"}"
  echo $message
  exit 1
}

[[ -z "$ZSH" ]] && __ragequit "ZSH not found. Exiting."

```

## Typescript

It's very hard to make generic types. While I prefer `unknown`, I do
make complex types when I am rendering a complex component, like a
valid JSON parseable:

```typescript
type json1 = string | number | boolean | null
type json2 = json1 | { [key: string]: json2 } | json1[]
type jsonType = json2|json1|json2[]

interface MyComponentProps extends PropsWithChildren {
  config: jsonType
}
const MyComponent = ({config, children}: MyComponentProps) => {
  return <div>
    <pre>{JSON.stringify(config, null, 2)}<</pre>>
    {children}
    </div>
}
```