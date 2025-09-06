# use-base64

React hook and helpers to encode strings to Base64 (RFC 4648), browser/Node/SSR-safe.

## Features

- **Universal**: Works in browsers, Node.js, and SSR environments
- **RFC 4648 compliant**: Standard and URL-safe Base64 variants
- **React hook**: Optimized with memoization for React components
- **TypeScript**: Full type safety with comprehensive type definitions
- **Zero dependencies**: No external runtime dependencies
- **Lightweight**: Small bundle size with tree-shaking support
- **Flexible**: Configurable padding, line wrapping, and Unicode normalization

## Install

```bash
npm install use-base64
```

## Quick Start

```tsx
import { useBase64 } from "use-base64"

function MyComponent() {
  // Basic usage with default options
  const encoded = useBase64("Hello, world!")
  return <div>{encoded}</div> // "SGVsbG8sIHdvcmxkIQ=="
}
```

## API Reference

### `useBase64(input: string, options?) -> string`

React hook that encodes a string to Base64 with automatic memoization.

**Parameters:**
- `input: string` - The string to encode
- `options?: Options` - Encoding options (optional)

**Returns:** Base64 encoded string

### `encodeBase64(input: string, options?) -> string`

Encodes a string to Base64.

### `encodeBase64FromBytes(bytes: Uint8Array, options?) -> string`

Encodes a byte array to Base64.

### Options

```typescript
type Options = {
  /** Base64 variant: "standard" (+/) or "url" (-_). Default: "standard" */
  variant?: "standard" | "url"
  
  /** Padding behavior: "preserve" or "strip". Default: "preserve" */
  padding?: "preserve" | "strip"
  
  /** Line wrapping: false for no wrap, number for wrap width. Default: false */
  wrap?: false | number
  
  /** Unicode normalization form. Default: no normalization */
  normalize?: "NFC" | "NFD" | "NFKC" | "NFKD"
}
```

## Usage Examples

### React Hook Examples

#### Basic Usage (Default Options)

```tsx
import { useBase64 } from "use-base64"

function BasicExample() {
  // Uses standard variant with padding preserved
  const encoded = useBase64("Hello, world!")
  return <code>{encoded}</code> // "SGVsbG8sIHdvcmxkIQ=="
}
```

#### URL-Safe Encoding

```tsx
function UrlSafeExample() {
  const safeUrl = useBase64("Hello/World+Test", { variant: "url" })
  return <code>{safeUrl}</code> // "SGVsbG8vV29ybGQrVGVzdA=="
}
```

#### Stripped Padding

```tsx
function NoPaddingExample() {
  const noPadding = useBase64("Hello", { padding: "strip" })
  return <code>{noPadding}</code> // "SGVsbG8" (no trailing =)
}
```

#### URL-Safe with No Padding

```tsx
function UrlSafeNoPaddingExample() {
  const result = useBase64("Hello/World+", { 
    variant: "url", 
    padding: "strip" 
  })
  return <code>{result}</code> // "SGVsbG8vV29ybGQr" -> "SGVsbG8_V29ybGQr"
}
```

#### Line Wrapping for MIME

```tsx
function MimeExample() {
  const longText = "This is a very long string that will be wrapped at 64 characters per line for MIME compatibility"
  const wrapped = useBase64(longText, { wrap: 64 })
  return <pre>{wrapped}</pre>
  // Output:
  // VGhpcyBpcyBhIHZlcnkgbG9uZyBzdHJpbmcgdGhhdCB3aWxsIGJlIHdyYXBwZWQg
  // YXQgNjQgY2hhcmFjdGVycyBwZXIgbGluZSBmb3IgTUlNRSBjb21wYXRpYmlsaXR5
}
```

#### Unicode Normalization

```tsx
function UnicodeExample() {
  const cafe1 = useBase64("café", { normalize: "NFC" }) // Composed form
  const cafe2 = useBase64("café", { normalize: "NFD" }) // Decomposed form
  
  return (
    <div>
      <div>NFC: {cafe1}</div>
      <div>NFD: {cafe2}</div>
    </div>
  )
}
```

#### All Options Combined

```tsx
function AdvancedExample() {
  const encoded = useBase64("Hello/World+Test", {
    variant: "url",      // Use URL-safe characters
    padding: "strip",    // Remove padding
    wrap: 32,           // Wrap at 32 characters
    normalize: "NFC"     // Normalize Unicode
  })
  return <pre>{encoded}</pre>
}
```

#### Dynamic Options

```tsx
function DynamicExample() {
  const [text, setText] = useState("Hello, world!")
  const [urlSafe, setUrlSafe] = useState(false)
  const [stripPadding, setStripPadding] = useState(false)
  
  const encoded = useBase64(text, {
    variant: urlSafe ? "url" : "standard",
    padding: stripPadding ? "strip" : "preserve"
  })
  
  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <label>
        <input type="checkbox" checked={urlSafe} onChange={e => setUrlSafe(e.target.checked)} />
        URL-safe
      </label>
      <label>
        <input type="checkbox" checked={stripPadding} onChange={e => setStripPadding(e.target.checked)} />
        Strip padding
      </label>
      <code>{encoded}</code>
    </div>
  )
}
```

### Standalone Function Examples

#### Basic String Encoding

```typescript
import { encodeBase64 } from "use-base64"

// Default: standard Base64 with padding
const basic = encodeBase64("Hello, world!")
// "SGVsbG8sIHdvcmxkIQ=="

const empty = encodeBase64("")
// ""

const unicode = encodeBase64("Hello 🌍")
// "SGVsbG8g8J+MjQ=="
```

#### Variant Options

```typescript
// Standard Base64 (RFC 4648 Section 4)
const standard = encodeBase64("Hello/World+", { variant: "standard" })
// "SGVsbG8vV29ybGQr"

// URL-safe Base64 (RFC 4648 Section 5)
const urlSafe = encodeBase64("Hello/World+", { variant: "url" })
// "SGVsbG8_V29ybGQr" (/ becomes _, + becomes -)
```

#### Padding Options

```typescript
// Preserve padding (default)
const withPadding = encodeBase64("Hello", { padding: "preserve" })
// "SGVsbG8="

// Strip padding
const noPadding = encodeBase64("Hello", { padding: "strip" })
// "SGVsbG8"

// Different padding scenarios
const onePad = encodeBase64("Hi", { padding: "strip" })    // "SGk" (was "SGk=")
const twoPad = encodeBase64("H", { padding: "strip" })     // "SA" (was "SA==")
const noPad = encodeBase64("Hello!", { padding: "strip" }) // "SGVsbG8h" (no change)
```

#### Line Wrapping

```typescript
// No wrapping (default)
const noWrap = encodeBase64("A very long string...")
// Single line output

// MIME-style wrapping at 76 characters
const mime = encodeBase64("A".repeat(100), { wrap: 76 })
// Output wrapped at 76 chars per line

// Custom wrapping
const custom = encodeBase64("A".repeat(50), { wrap: 20 })
// Output wrapped at 20 chars per line

// Disable wrapping explicitly
const explicit = encodeBase64("test", { wrap: false })
// "dGVzdA=="
```

#### Unicode Normalization

```typescript
// No normalization (default)
const raw = encodeBase64("café")

// Canonical composition (NFC)
const nfc = encodeBase64("café", { normalize: "NFC" })

// Canonical decomposition (NFD) 
const nfd = encodeBase64("café", { normalize: "NFD" })

// Compatibility composition (NFKC)
const nfkc = encodeBase64("²", { normalize: "NFKC" })

// Compatibility decomposition (NFKD)
const nfkd = encodeBase64("²", { normalize: "NFKD" })
```

#### Byte Array Encoding

```typescript
import { encodeBase64FromBytes } from "use-base64"

// From TextEncoder
const bytes1 = new TextEncoder().encode("Hello")
const encoded1 = encodeBase64FromBytes(bytes1)
// "SGVsbG8="

// From array
const bytes2 = new Uint8Array([72, 101, 108, 108, 111])
const encoded2 = encodeBase64FromBytes(bytes2)
// "SGVsbG8="

// With options
const bytes3 = new Uint8Array([255, 254, 253])
const encoded3 = encodeBase64FromBytes(bytes3, { 
  variant: "url", 
  padding: "strip" 
})
// "____" -> "___-" (URL-safe, no padding)
```

#### Comprehensive Example

```typescript
// All options demonstrated
const comprehensive = encodeBase64("Hello/World+Data", {
  variant: "url",        // Use - and _ instead of + and /
  padding: "strip",      // Remove trailing = characters
  wrap: 16,             // Insert newline every 16 characters
  normalize: "NFC"       // Normalize Unicode to composed form
})

console.log(comprehensive)
// SGVsbG8vV29ybGQr
// RGF0YQ
```

## Common Use Cases

### JWT Token Generation

```tsx
function JWTHeader() {
  const header = JSON.stringify({ alg: "HS256", typ: "JWT" })
  const encoded = useBase64(header, { variant: "url", padding: "strip" })
  return <code>{encoded}</code>
}
```

### Data URLs

```tsx
function DataURL() {
  const svg = '<svg><text>Hello</text></svg>'
  const encoded = useBase64(svg)
  return <img src={`data:image/svg+xml;base64,${encoded}`} />
}
```

### HTTP Basic Auth

```tsx
function BasicAuth() {
  const credentials = useBase64("username:password")
  // Use in Authorization header: `Basic ${credentials}`
  return <code>Authorization: Basic {credentials}</code>
}
```

## Browser Compatibility

Works in all modern browsers and Node.js environments:

- **Modern Browsers**: Uses `TextEncoder` (Chrome 38+, Firefox 19+, Safari 10.1+)
- **Node.js**: Falls back to `Buffer` when available
- **SSR**: Works in server-side rendering environments
- **Legacy**: Throws descriptive error if neither `TextEncoder` nor `Buffer` available

## Performance

- **Chunked processing**: Handles large strings efficiently by processing in 32KB chunks
- **Memoization**: React hook automatically memoizes results to prevent unnecessary re-computation
- **Zero dependencies**: No external libraries reduce bundle size
- **Tree-shakable**: Import only what you need

## License

MIT