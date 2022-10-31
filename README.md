# MPToolkit

MPToolkit is my attempt to build a Deno-based toolkit for working with data of Medical Professionals in the Netherlands.

It can do a couple of things:

- Search for a Medical Professional by name or register number in the BIG-register ([https://www.bigregister.nl/](https://www.bigregister.nl/))
- Search for a BIG-registration in Transparantieregister ([https://www.transparantieregister.nl/home](https://www.transparantieregister.nl/home))

## Why?

I am building this because of a recent report of Nieuwsuur, that talked about a lack of transparency. Namely that it is hard for anyone to see whether or not a Medical Professional has gotten any outside payments. This should be registered in the Transparantieregister, but it is not always the case, plus you cannot search for people. So... we need to plug a few systems into one. This is my attempt (there will be a follow-up) to do just that.

## Technical details

### BIG

The BIG-register can be accessed over SOAP, which is implemented here in a function. More info [here](https://www.bigregister.nl/zoek-zorgverlener/zoeken-eigen-systeem) (Dutch only)

### Transparantieregister

This one is a bit more complicated. They don't provide a REST-API, so I am accessing the underlying iframe and search with a GET request. The resulting HTML is then scraped for the data.

## License

MIT License

Copyright (c) 2022 Jelte Lagendijk

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
