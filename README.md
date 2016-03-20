
#README

`fcc-dict.js` was created to assist the internationalization effort at [freecodecamp.com](FreeCodeCamp). It solves two common problems in collective translation efforts:
1. There rarely is a unique translation for each English term you find on the challenges. Regional differences make it difficult to achieve an agreement (for example, Spaniards translate `array` as `vector`, while many Latin Americans translate it as `arreglo`. None of them is wrong, but we can only choose one. `fcc-dict.js` allows all translators to propose their suggestions for a given term, and runs a permanent poll that can be responded by other translators and users. This brings democracy to your translation.
2. Organizing the data employed for the translation effort is a **chore**, and all teams have to go through it. `fcc-dict` puts all this information into an API and provides an easy-to-use interface, all in one place. This API is a nice by-product of the translation effort and can be useful for other projects (for example, for the translators working on the [https://developer.mozilla.org](MDN documentation)).

To run it, clone the repository, run `npm install` to install the dependencies, `mongod --smallfiles` to start the database and `node server.js` to run the server.

#LICENSE

Copyright (c) 2016, Juan Nelson Martínez Dahbura <jnelsonm64@gmail.com>

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.