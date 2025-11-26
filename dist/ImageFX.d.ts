import { Prompt } from "./Prompt.js";
import { Image } from "./Image.js";
import { ImageType } from "./Constants.js";
export declare class ImageFXError extends Error {
    constructor(message: string);
}
/**
 * Consider this the entry/main class
 */
export declare class ImageFX {
    /**
     * Represents user account and contains session info, cookies, etc
     */
    private readonly account;
    constructor(cookie: string);
    /**
     * Generates image from a given prompt
     *
     * @param prompt Description of image
     * @param retries Number of retries
     * @returns List containing generated image(s)
     */
    generateImage(prompt: string | Prompt, retries?: number): Promise<Image[]>;
    /**
     * Gets generated image from its unique media ID (`image.mediaID`)
     * @param id Unique media id for a generated image
     * @returns Returns image identified by its `id`
     */
    getImageFromId(id: string): Promise<Image>;
    /**
     * Generate a detailed caption from an image.
     *
     * @param imagePath Path to the image to be used
     * @param count Number of captions to generate
     * @param imageType Type of image (png, jpeg, yada yada)
     * @returns Array with `count` number of captions (if you are lucky)
     */
    generateCaptionsFromImage(imagePath: string, imageType: ImageType, count?: number): Promise<string[]>;
    /**
     * Fetches generated images from Google ImageFX API
     *
     * @param retry Number of retries
     * @returns Promise containing list of generated images.
     */
    private fetchImages;
}
