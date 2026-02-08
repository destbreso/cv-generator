declare module "pdf-parse" {
  interface PDFInfo {
    PDFFormatVersion?: string;
    IsAcroFormPresent?: boolean;
    IsXFAPresent?: boolean;
    Title?: string;
    Author?: string;
    Subject?: string;
    Creator?: string;
    Producer?: string;
    CreationDate?: string;
    ModDate?: string;
    [key: string]: unknown;
  }

  interface PDFMetadata {
    _metadata?: unknown;
    [key: string]: unknown;
  }

  interface PDFData {
    /** Number of pages */
    numpages: number;
    /** Number of rendered pages */
    numrender: number;
    /** PDF info object */
    info: PDFInfo;
    /** PDF metadata */
    metadata: PDFMetadata | null;
    /** Extracted text content */
    text: string;
    /** PDF version */
    version: string;
  }

  interface PDFOptions {
    pagerender?: (pageData: unknown) => Promise<string>;
    max?: number;
    version?: string;
  }

  function pdfParse(
    dataBuffer: Buffer,
    options?: PDFOptions,
  ): Promise<PDFData>;

  export default pdfParse;
}

declare module "pdf-parse/lib/pdf-parse" {
  import pdfParse from "pdf-parse";
  export default pdfParse;
}
