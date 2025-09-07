import { useState, useCallback, useMemo } from "react"
import {
  imageFileToBase64,
  fileToBase64,
  urlToBase64,
} from "./image"
import {
  FileToBase64Options,
  ImageToBase64Options,
  UseBase64State,
  UseImageToBase64Return,
  UseImageToBase64State
} from './types';

/**
 * React hook for converting images to Base64
 */
export function useImageToBase64(): UseImageToBase64Return {
  const [state, setState] = useState<UseImageToBase64State>({
    data: null,
    loading: false,
    error: null
  })

  const convertFile = useCallback(async (
    file: File,
    options?: ImageToBase64Options
  ) => {
    setState({ data: null, loading: true, error: null })

    try {
      const result = await imageFileToBase64(file, options)
      setState({ data: result, loading: false, error: null })
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : "Conversion failed"
      })
    }
  }, [])

  const convertUrl = useCallback(async (
    url: string,
    options?: ImageToBase64Options
  ) => {
    setState({ data: null, loading: true, error: null })

    try {
      const result = await urlToBase64(url, options)
      setState({ data: result, loading: false, error: null })
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : "Conversion failed"
      })
    }
  }, [])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    convertFile,
    convertUrl,
    reset
  }
}

/**
 * React hook for converting any file to Base64 (not just images)
 */
export function useFileToBase64(): {
  data: string | null
  loading: boolean
  error: string | null
  convertFile: (file: File, options?: FileToBase64Options) => Promise<void>
  reset: () => void
} {
  const [state, setState] = useState<{
    data: string | null
    loading: boolean
    error: string | null
  }>({
    data: null,
    loading: false,
    error: null
  })

  const convertFile = useCallback(async (
    file: File,
    options?: FileToBase64Options
  ) => {
    setState({ data: null, loading: true, error: null })

    try {
      const result = await fileToBase64(file, options)
      setState({ data: result, loading: false, error: null })
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : "Conversion failed"
      })
    }
  }, [])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    convertFile,
    reset
  }
}

/**
 * Hook for multiple file conversions
 */
export function useMultiFileToBase64(): {
  files: Array<{ file: File; data: string | null; error: string | null }>
  loading: boolean
  convertFiles: (files: FileList | File[], options?: FileToBase64Options) => Promise<void>
  reset: () => void
} {
  const [files, setFiles] = useState<Array<{
    file: File
    data: string | null
    error: string | null
  }>>([])
  const [loading, setLoading] = useState(false)

  const convertFiles = useCallback(async (
    fileList: FileList | File[],
    options?: FileToBase64Options
  ) => {
    setLoading(true)
    const fileArray = Array.from(fileList)

    // Initialize files state
    setFiles(fileArray.map(file => ({ file, data: null, error: null })))

    // Convert each file
    const results = await Promise.allSettled(
      fileArray.map(file => fileToBase64(file, options))
    )

    // Update state with results
    setFiles(fileArray.map((file, index) => {
      const result = results[index]
      return {
        file,
        data: result.status === "fulfilled" ? result.value : null,
        error: result.status === "rejected"
          ? (result.reason instanceof Error ? result.reason.message : "Conversion failed")
          : null
      }
    }))

    setLoading(false)
  }, [])

  const reset = useCallback(() => {
    setFiles([])
    setLoading(false)
  }, [])

  return {
    files,
    loading,
    convertFiles,
    reset
  }
}

/**
 * Hook that automatically converts files when they change
 */
export function useAutoFileToBase64(
  file: File | null,
  options?: FileToBase64Options
): UseBase64State {
  const [state, setState] = useState<UseBase64State>({
    data: null,
    loading: false,
    error: null
  })

  // Memoize the conversion to avoid unnecessary re-runs
  useMemo(() => {
    if (!file) {
      setState({ data: null, loading: false, error: null })
      return
    }

    setState({ data: null, loading: true, error: null })

    fileToBase64(file, options)
      .then(result => {
        setState({ data: result, loading: false, error: null })
      })
      .catch(error => {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : "Conversion failed"
        })
      })
  }, [file, options?.format])

  return state
}