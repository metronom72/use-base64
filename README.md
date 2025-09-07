# use-base64

[![npm version](https://badge.fury.io/js/use-base64.svg)](https://badge.fury.io/js/use-base64)
[![npm downloads](https://img.shields.io/npm/dm/use-base64.svg)](https://www.npmjs.com/package/use-base64)
[![Playground](https://img.shields.io/badge/Playground-tooling.ninja-informational)](https://www.tooling.ninja/en/base64/javascript)

React hooks and helpers for Base64 (RFC 4648).  
Universal: works in browsers, Node.js, and SSR environments.

---

## ✨ Features

- **Universal**: Works in browsers, Node.js, and SSR environments
- **RFC 4648 compliant**: Standard and URL-safe Base64 variants
- **React hooks**: Encode/decode + file/image utilities
- **TypeScript**: Full type safety
- **Zero dependencies**
- **Lightweight & tree-shakable**
- **Flexible**: Configurable padding, line wrapping, Unicode normalization
- **Memoized**: Hooks are optimized to avoid unnecessary recomputations

---

## Playground

Поиграться и быстро проверить поведение можно здесь:  
👉 [Base64 Playground — tooling.ninja](https://www.tooling.ninja/en/base64/javascript)

---

## 📦 Install

```bash
npm install use-base64
# or
yarn add use-base64
# or
pnpm add use-base64
```

---

## 🚀 Quick Start

```tsx
import { useBase64 } from "use-base64"

function MyComponent() {
  const encoded = useBase64("Hello, world!")
  return <div>{encoded}</div> // "SGVsbG8sIHdvcmxkIQ=="
}
```

---

## 📚 API Reference

### Hooks Overview

| Hook                          | Use Case                                                                                   | Returns                                                                 |
|-------------------------------|--------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|
| **`useBase64`**               | Encode a string to Base64 (memoized).                                                      | `string` (Base64)                                                       |
| **`useBase64Decode`**         | Decode Base64 string to text or bytes.                                                     | `string` or `Uint8Array`                                                |
| **`useBase64DecodeBytes`**    | Decode Base64 string directly into bytes.                                                  | `Uint8Array`                                                            |
| **`useBase64DecodeSafe`**     | Safe decode with built‑in error handling (never throws).                                   | `{ data: string \| Uint8Array \| null, error?: string, isValid: boolean }` |
| **`useFileToBase64`**         | Convert a single `File` to Base64 (Data URL optionally).                                   | `{ base64: string, file: File }`                                        |
| **`useImageToBase64`**        | Convert image `File`/`<img>`/URL to Base64 with optional resize/format.                    | `{ base64: string, width: number, height: number, format: ImageFormat }` |
| **`useMultiFileToBase64`**    | Convert multiple files to Base64 in batch.                                                 | `FileConversionResult[]`                                                |
| **`useAutoFileToBase64`**     | Auto-detect file type (image/text/binary) and convert accordingly.                         | `FileConversionResult[]`                                                |

### Functions Overview

- **`encodeBase64(input, options?) → string`** — Encode string.
- **`encodeBase64FromBytes(bytes, options?) → string`** — Encode bytes.
- **`decodeBase64(input, options?) → string \| Uint8Array`** — Decode string.
- **`decodeBase64ToBytes(input) → Uint8Array`** — Decode to bytes.

---

## 🔠 Options & Types

### Encoding Options

```ts
export type Base64Options = {
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

### Decoding Options

```ts
export type DecodeOptions = {
  /** Output target. Default: "string" */
  output?: "string" | "bytes"
  /** Unicode normalization form for string output */
  normalize?: "NFC" | "NFD" | "NFKC" | "NFKD"
}
```

### File/Image Types

```ts
export type ImageFormat = "png" | "jpeg" | "webp" | "gif" | "bmp" | "svg";
export type FileConversionResult = {
  file: File;
  base64?: string;   // Data URL or raw base64 depending on options
  error?: string;
};
```

---

## 🧩 Usage Examples

### Encode (hook)

```tsx
import { useBase64 } from "use-base64"

function BasicExample() {
  const encoded = useBase64("Hello, world!") 
  return <code>{encoded}</code> // "SGVsbG8sIHdvcmxkIQ=="
}
```

#### URL-safe / no padding / wrapping / normalization

```tsx
const urlSafe = useBase64("Hello/World+Test", { variant: "url" })
const noPad = useBase64("Hello", { padding: "strip" })          // "SGVsbG8"
const wrapped = useBase64("A".repeat(100), { wrap: 64 })        // MIME-like lines
const nfc = useBase64("café", { normalize: "NFC" })
```

### Encode (functions)

```ts
import { encodeBase64, encodeBase64FromBytes } from "use-base64"

const s = encodeBase64("Hello 🌍")                    // "SGVsbG8g8J+MjQ=="
const url = encodeBase64("Hello/World+", { variant: "url" }) // "SGVsbG8_V29ybGQr"
const bytes = new TextEncoder().encode("Hello")
const s2 = encodeBase64FromBytes(bytes)               // "SGVsbG8="
```

---

# Base64 Decode Hooks Examples

## useBase64Decode

React hook for Base64 decoding with automatic memoization.

### Basic String Decoding

```tsx
import { useBase64Decode } from "use-base64"

function BasicDecodeExample() {
  // Decode to string (default)
  const decoded = useBase64Decode("SGVsbG8sIHdvcmxkIQ==")
  return <div>{decoded}</div> // "Hello, world!"
}
```

### Decode to Bytes

```tsx
function BytesDecodeExample() {
  const bytes = useBase64Decode("SGVsbG8=", { output: "bytes" })
  
  return (
    <div>
      <div>Bytes length: {bytes.length}</div>
      <div>First byte: {bytes[0]}</div> {/* 72 (ASCII 'H') */}
    </div>
  )
}
```

### Unicode Normalization

```tsx
function UnicodeDecodeExample() {
  const encoded = "Y2Fmw6k=" // "café" encoded
  
  // Default decoding
  const normal = useBase64Decode(encoded)
  
  // With normalization
  const normalized = useBase64Decode(encoded, { normalize: "NFC" })
  
  return (
    <div>
      <div>Normal: {normal}</div>
      <div>Normalized: {normalized}</div>
    </div>
  )
}
```

### Dynamic Input Example

```tsx
import { useState } from "react"

function DynamicDecodeExample() {
  const [input, setInput] = useState("SGVsbG8sIHdvcmxkIQ==")
  const [outputType, setOutputType] = useState<"string" | "bytes">("string")
  
  const decoded = useBase64Decode(input, { output: outputType })
  
  return (
    <div>
      <input 
        value={input} 
        onChange={e => setInput(e.target.value)}
        placeholder="Enter Base64 string"
      />
      <select 
        value={outputType} 
        onChange={e => setOutputType(e.target.value as "string" | "bytes")}
      >
        <option value="string">String</option>
        <option value="bytes">Bytes</option>
      </select>
      
      <div>
        Result: {
          outputType === "string" 
            ? (decoded as string)
            : `Uint8Array(${(decoded as Uint8Array).length})`
        }
      </div>
    </div>
  )
}
```

## useBase64DecodeBytes

Specialized hook for decoding specifically to bytes.

### File Data Processing

```tsx
function FileDataExample() {
  // Base64 encoded image data
  const imageData = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
  
  const bytes = useBase64DecodeBytes(imageData)
  
  return (
    <div>
      <div>Image data size: {bytes.length} bytes</div>
      <div>PNG signature: {Array.from(bytes.slice(0, 8)).map(b => b.toString(16).padStart(2, '0')).join(' ')}</div>
    </div>
  )
}
```

### Binary Data Analysis

```tsx
import { useState, useMemo } from "react"

function BinaryAnalysisExample() {
  const [base64Input, setBase64Input] = useState("SGVsbG8gV29ybGQ=")
  const bytes = useBase64DecodeBytes(base64Input)
  
  const hexView = useMemo(() => Array.from(bytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join(' ')
    .toUpperCase(), [bytes])
  
  const asciiView = useMemo(() => Array.from(bytes)
    .map(byte => byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : '.')
    .join(''), [bytes])
  
  return (
    <div>
      <input 
        value={base64Input}
        onChange={e => setBase64Input(e.target.value)}
        placeholder="Enter Base64"
      />
      
      <div style={{ fontFamily: 'monospace', marginTop: 10 }}>
        <div>Size: {bytes.length} bytes</div>
        <div>Hex: {hexView}</div>
        <div>ASCII: {asciiView}</div>
      </div>
    </div>
  )
}
```

### Blob Creation

```tsx
function BlobCreationExample() {
  const pdfData = "JVBERi0xLjQKJeLjz9MKM..." // Truncated PDF data
  const bytes = useBase64DecodeBytes(pdfData)
  
  const downloadPdf = () => {
    const blob = new Blob([bytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.pdf'
    a.click()
    URL.revokeObjectURL(url)
  }
  
  return (
    <div>
      <div>PDF size: {bytes.length} bytes</div>
      <button onClick={downloadPdf}>Download PDF</button>
    </div>
  )
}
```

## useBase64DecodeSafe

Hook with built-in error handling for safe decoding.

### Input Validation

```tsx
import { useState } from "react"

function SafeDecodeExample() {
  const [input, setInput] = useState("SGVsbG8=")
  const { data, error, isValid } = useBase64DecodeSafe(input)
  
  return (
    <div>
      <input 
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter Base64 string"
        style={{ 
          borderColor: isValid ? 'green' : 'red',
          backgroundColor: isValid ? '#f0fff0' : '#fff0f0'
        }}
      />
      
      {error && (
        <div style={{ color: 'red', marginTop: 5 }}>
          Error: {error}
        </div>
      )}
      
      {isValid && (
        <div style={{ color: 'green', marginTop: 5 }}>
          Decoded: {data as string}
        </div>
      )}
    </div>
  )
}
```

### Form Validation

```tsx
import { useState, useMemo } from "react"

function FormValidationExample() {
  const [credentials, setCredentials] = useState("")
  const { data, error, isValid } = useBase64DecodeSafe(credentials)
  
  const parsedCreds = useMemo(() => {
    if (!isValid || !data) return null
    const decoded = data as string
    const [username, password] = decoded.split(':')
    return { username, password }
  }, [data, isValid])
  
  return (
    <form>
      <div>
        <label>Basic Auth Credentials (Base64):</label>
        <input 
          value={credentials}
          onChange={e => setCredentials(e.target.value)}
          placeholder="dXNlcm5hbWU6cGFzc3dvcmQ="
        />
      </div>
      
      {error && (
        <div className="error">Invalid Base64: {error}</div>
      )}
      
      {parsedCreds && (
        <div className="success">
          <div>Username: {parsedCreds.username}</div>
          <div>Password: {parsedCreds.password}</div>
        </div>
      )}
      
      <button type="submit" disabled={!isValid}>
        Submit
      </button>
    </form>
  )
}
```

### JWT Token Parser

```tsx
import { useState, useMemo } from "react"

function JWTParserExample() {
  const [token, setToken] = useState("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ")
  
  const parts = token.split('.')
  const headerResult = useBase64DecodeSafe(parts[0] || "")
  const payloadResult = useBase64DecodeSafe(parts[1] || "")
  
  const header = useMemo(() => {
    try {
      return headerResult.isValid ? JSON.parse(headerResult.data as string) : null
    } catch {
      return null
    }
  }, [headerResult])
  
  const payload = useMemo(() => {
    try {
      return payloadResult.isValid ? JSON.parse(payloadResult.data as string) : null
    } catch {
      return null
    }
  }, [payloadResult])
  
  return (
    <div>
      <textarea 
        value={token}
        onChange={e => setToken(e.target.value)}
        placeholder="Paste JWT token here"
        rows={3}
        style={{ width: '100%' }}
      />
      
      <div style={{ display: 'flex', gap: 20, marginTop: 10 }}>
        <div style={{ flex: 1 }}>
          <h3>Header</h3>
          {headerResult.error ? (
            <div style={{ color: 'red' }}>Error: {headerResult.error}</div>
          ) : (
            <pre>{JSON.stringify(header, null, 2)}</pre>
          )}
        </div>
        
        <div style={{ flex: 1 }}>
          <h3>Payload</h3>
          {payloadResult.error ? (
            <div style={{ color: 'red' }}>Error: {payloadResult.error}</div>
          ) : (
            <pre>{JSON.stringify(payload, null, 2)}</pre>
          )}
        </div>
      </div>
    </div>
  )
}
```

### Batch Decoding with Error Handling

```tsx
import { useState } from "react"

function BatchDecodeExample() {
  const [inputs, setInputs] = useState([
    "SGVsbG8=",           // Valid: "Hello"
    "V29ybGQ=",           // Valid: "World"
    "InvalidBase64!!!",   // Invalid
    "VGVzdA==",           // Valid: "Test"
  ])
  
  const results = inputs.map(input => useBase64DecodeSafe(input))
  
  const addInput = () => {
    setInputs([...inputs, ""])
  }
  
  const updateInput = (index: number, value: string) => {
    const newInputs = [...inputs]
    newInputs[index] = value
    setInputs(newInputs)
  }
  
  const removeInput = (index: number) => {
    setInputs(inputs.filter((_, i) => i !== index))
  }
  
  return (
    <div>
      <h3>Batch Base64 Decoder</h3>
      
      {inputs.map((input, index) => {
        const result = results[index]
        return (
          <div key={index} style={{ 
            display: 'flex', 
            gap: 10, 
            marginBottom: 10,
            padding: 10,
            border: `1px solid ${result.isValid ? 'green' : 'red'}`,
            borderRadius: 4
          }}>
            <input 
              value={input}
              onChange={e => updateInput(index, e.target.value)}
              placeholder="Enter Base64"
              style={{ flex: 1 }}
            />
            
            <div style={{ minWidth: 200 }}>
              {result.error ? (
                <span style={{ color: 'red' }}>❌ {result.error}</span>
              ) : (
                <span style={{ color: 'green' }}>✅ "{result.data}"</span>
              )}
            </div>
            
            <button onClick={() => removeInput(index)}>Remove</button>
          </div>
        )
      })}
      
      <button onClick={addInput}>Add Input</button>
      
      <div style={{ marginTop: 20 }}>
        <strong>Summary:</strong>
        <div>Valid: {results.filter(r => r.isValid).length}</div>
        <div>Invalid: {results.filter(r => !r.isValid).length}</div>
      </div>
    </div>
  )
}
```

---

## File and Image Hooks Examples

### useImageToBase64

```tsx
function ImageConverterExample() {
  const { data, loading, error, convertFile, convertUrl, reset } = useImageToBase64()
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      convertFile(file, { 
        format: 'jpeg', 
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 600
      })
    }
  }
  
  const handleUrlConvert = () => {
    convertUrl('https://example.com/image.jpg', {
      format: 'webp',
      quality: 0.9
    })
  }
  
  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUrlConvert}>Convert URL Image</button>
      <button onClick={reset}>Reset</button>
      
      {loading && <div>Converting...</div>}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {data && (
        <div>
          <div>Base64 length: {data.length}</div>
          <img src={data} alt="Converted" style={{ maxWidth: 200 }} />
        </div>
      )}
    </div>
  )
}
```

### useFileToBase64

```tsx
function FileConverterExample() {
  const { data, loading, error, convertFile, reset } = useFileToBase64()
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      convertFile(file, { includePrefix: true })
    }
  }
  
  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={reset}>Reset</button>
      
      {loading && <div>Converting...</div>}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {data && (
        <div>
          <div>Data URL ready for use:</div>
          <textarea value={data} readOnly rows={3} style={{ width: '100%' }} />
        </div>
      )}
    </div>
  )
}
```

### useMultiFileToBase64

```tsx
function MultiFileConverterExample() {
  const { files, loading, convertFiles, reset } = useMultiFileToBase64()
  
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    if (fileList) {
      convertFiles(fileList, { includePrefix: false })
    }
  }
  
  return (
    <div>
      <input type="file" multiple onChange={handleFilesChange} />
      <button onClick={reset}>Reset</button>
      
      {loading && <div>Converting files...</div>}
      
      <div>
        {files.map((fileResult, index) => (
          <div key={index} style={{ 
            margin: 10, 
            padding: 10, 
            border: '1px solid #ccc',
            borderRadius: 4
          }}>
            <div><strong>{fileResult.file.name}</strong></div>
            <div>Size: {fileResult.file.size} bytes</div>
            
            {fileResult.error ? (
              <div style={{ color: 'red' }}>Error: {fileResult.error}</div>
            ) : fileResult.base64 ? (
              <div style={{ color: 'green' }}>
                ✅ Converted ({fileResult.base64.length} chars)
              </div>
            ) : (
              <div>Converting...</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### useAutoFileToBase64

```tsx
import { useState } from "react"

function AutoFileConverterExample() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { data, loading, error } = useAutoFileToBase64(selectedFile, { 
    format: 'dataUrl' 
  })
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] || null)
  }
  
  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      
      {loading && <div>Auto-converting...</div>}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {data && (
        <div>
          <div>✅ Auto-converted successfully!</div>
          {selectedFile?.type.startsWith('image/') && (
            <img src={data} alt="Preview" style={{ maxWidth: 200, marginTop: 10 }} />
          )}
        </div>
      )}
    </div>
  )
}
```

---

## 🔧 Standalone Function Examples

### Basic String Encoding

```ts
import { encodeBase64 } from "use-base64"

// Default: standard Base64 with padding
const basic = encodeBase64("Hello, world!")
// "SGVsbG8sIHdvcmxkIQ=="

const empty = encodeBase64("")
// ""

const unicode = encodeBase64("Hello 🌍")
// "SGVsbG8g8J+MjQ=="
```

### Variant Options

```ts
// Standard Base64 (RFC 4648 Section 4)
const standard = encodeBase64("Hello/World+", { variant: "standard" })
// "SGVsbG8vV29ybGQr"

// URL-safe Base64 (RFC 4648 Section 5)
const urlSafe = encodeBase64("Hello/World+", { variant: "url" })
// "SGVsbG8_V29ybGQr" (/ becomes _, + becomes -)
```

### Padding Options

```ts
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

### Line Wrapping

```ts
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

### Unicode Normalization

```ts
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

### Byte Array Encoding

```ts
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
// URL-safe without padding
```

### Comprehensive Example

```ts
// All options demonstrated
const comprehensive = encodeBase64("Hello/World+Data", {
  variant: "url",        // Use - and _ instead of + and /
  padding: "strip",      // Remove trailing = characters
  wrap: 16,              // Insert newline every 16 characters
  normalize: "NFC"       // Normalize Unicode to composed form
})

console.log(comprehensive)
// SGVsbG8vV29ybGQr
// RGF0YQ
```

---

## 🔐 Common Use Cases

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

---

## 🧰 Exports

```ts
// Main exports for the library
export { useBase64 } from "./hook"
export { encodeBase64, encodeBase64FromBytes } from "./encode"
export { decodeBase64, decodeBase64ToBytes } from "./decode"
export {
  useBase64Decode,
  useBase64DecodeBytes,
  useBase64DecodeSafe
} from "./decode-hook"
export {
  useImageToBase64,
  useFileToBase64,
  useMultiFileToBase64,
  useAutoFileToBase64
} from "./image-hook"
export {
  imageElementToBase64,
  fileToBase64,
  imageFileToBase64,
  canvasToBase64,
  imageDataToBase64,
  urlToBase64
} from "./image"

// Export types
export type { Base64Options as UseBase64Options } from "./types"
export type { DecodeOptions as UseBase64DecodeOptions } from "./types"
export type {
  ImageToBase64Options,
  FileToBase64Options,
  ImageFormat,
  UseBase64State,
  UseBase64DecodeState,
  FileConversionResult
} from "./types"
```

---

## 🖥️ Browser & Node Support

- **Modern Browsers**: Uses `TextEncoder` (Chrome 38+, Firefox 19+, Safari 10.1+)
- **Node.js**: Falls back to `Buffer` when available
- **SSR**: Works in server-side rendering environments
- **Legacy**: Descriptive error if neither `TextEncoder` nor `Buffer` available

## ⚙️ Performance

- **Chunked processing**: Handles large strings efficiently (e.g., 32KB chunks)
- **Memoization**: Hooks memoize results to prevent extra work
- **Zero dependencies**: Minimized bundle impact
- **Tree-shakable**: Import only what you need

---

## ⚖️ License

MIT
