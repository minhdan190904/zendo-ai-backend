import { join } from "path";
import { existsSync, mkdirSync, writeFileSync, } from "fs";
export class ImageError extends Error {
    constructor(message) {
        super(message);
        this.name = "ImageError";
    }
}
/**
 * Represents a generated image.
 */
export class Image {
    /**
     * Represents seed value used for this image generation.
     * Seed is a specific number that serves as the starting point
     * for the random process used to create the image.
     */
    seed;
    /**
    * Model used to generate this imge.
    *
    * Note: `"IMAGEN_3_5"` is probably `IMAGEN_4`
    *
    * Available models:
    * - `"IMAGEN_3"`
    * - `"IMAGEN_3_1"`
    * - `"IMAGEN_3_5"`
    */
    model; // modelNameType
    /**
     * Textual description used to generate this image
     */
    prompt;
    /**
     * Aspect ratio of this image
     */
    aspectRatio;
    /**
     * Unique id assigned to each generated image.
     *
     * `mediaId` can be used as identifier to download the image.
     */
    mediaId; // mediaGenerationId
    /**
     * Generated `png` image encoded into base64.
     */
    encodedImage;
    /**
     * Project id is what i can guess
     */
    workflowId;
    /**
     * IDK what this is bro
     */
    fingerprintId; // fingerprintLogRecordId
    constructor(args) {
        if (!args.encodedImage?.trim()) {
            throw new ImageError("Encoded image data is required");
        }
        this.seed = args.seed;
        this.prompt = args.prompt;
        this.model = args.modelNameType;
        this.aspectRatio = args.aspectRatio;
        // Unrequired stuffs below :|
        this.workflowId = args.workflowId;
        this.encodedImage = args.encodedImage;
        this.mediaId = args.mediaGenerationId;
        this.fingerprintId = args.fingerprintLogRecordId;
    }
    /**
     * Saves image to specified path with timestamp as name.
     * Default path is current directory.
     *
     * @param filePath Directory for the image to be saved
     */
    save(filePath = ".") {
        const imageName = `image-${Date.now()}.png`;
        if (!existsSync(filePath)) {
            console.log("[*] Creating destination dir:", filePath);
            try {
                mkdirSync(filePath, { recursive: true });
            }
            catch (err) {
                throw new ImageError(`Failed to create directory ${filePath}: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
        }
        try {
            filePath = join(filePath, imageName);
            writeFileSync(filePath, this.encodedImage, "base64");
            return filePath;
        }
        catch (error) {
            throw new ImageError("Failed to save image: " + (error instanceof Error ? error.message : "UNKNOWN ERROR"));
        }
    }
}
