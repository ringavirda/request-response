import sharp from "sharp";

interface ProcessorBufferItem {
  blob: Blob;
  optimized: Buffer;
}

export class ImageProcessor {
  private _processedBuffer: Array<ProcessorBufferItem> = [];

  public async processBlob(
    blob: Blob,
    resizeHeight?: number,
    resizeWidth?: number,
  ): Promise<Buffer> {
    const buffered = this._processedBuffer.find((e) => e.blob === blob);
    if (buffered !== undefined) return buffered.optimized;

    const buffer = Buffer.from(await blob.arrayBuffer());
    const optimized = await sharp(buffer)
      .resize({ height: resizeHeight, width: resizeWidth, fit: "cover" })
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .png()
      .toBuffer();

    return optimized;
  }

  public async blobToBuffer(blob: Blob): Promise<Buffer> {
    const buffered = this._processedBuffer.find((e) => e.blob === blob);
    if (buffered !== undefined) return buffered.optimized;

    const buffer = Buffer.from(await blob.arrayBuffer());

    return buffer;
  }
}