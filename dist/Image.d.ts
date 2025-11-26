import { AspectRatio, Model } from "./Constants.js";
import { ImageArg } from "./Types.js";
export declare class ImageError extends Error {
    constructor(message: string);
}
/**
 * Represents a generated image.
 */
export declare class Image {
    /**
     * Represents seed value used for this image generation.
     * Seed is a specific number that serves as the starting point
     * for the random process used to create the image.
     */
    readonly seed: number;
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
    readonly model: Model;
    /**
     * Textual description used to generate this image
     */
    readonly prompt: string;
    /**
     * Aspect ratio of this image
     */
    readonly aspectRatio: AspectRatio;
    /**
     * Unique id assigned to each generated image.
     *
     * `mediaId` can be used as identifier to download the image.
     */
    readonly mediaId: string;
    /**
     * Generated `png` image encoded into base64.
     */
    private readonly encodedImage;
    /**
     * Project id is what i can guess
     */
    private readonly workflowId;
    /**
     * IDK what this is bro
     */
    private readonly fingerprintId;
    constructor(args: ImageArg);
    /**
     * Saves image to specified path with timestamp as name.
     * Default path is current directory.
     *
     * @param filePath Directory for the image to be saved
     */
    save(filePath?: string): string;
}
