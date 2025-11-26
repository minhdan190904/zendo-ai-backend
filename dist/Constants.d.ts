export declare const Model: Readonly<{
    readonly IMAGEN_3: "IMAGEN_3";
    readonly IMAGEN_3_1: "IMAGEN_3_1";
    readonly IMAGEN_3_5: "IMAGEN_3_5";
}>;
export declare const AspectRatio: Readonly<{
    readonly SQUARE: "IMAGE_ASPECT_RATIO_SQUARE";
    readonly PORTRAIT: "IMAGE_ASPECT_RATIO_PORTRAIT";
    readonly LANDSCAPE: "IMAGE_ASPECT_RATIO_LANDSCAPE";
    readonly UNSPECIFIED: "IMAGE_ASPECT_RATIO_UNSPECIFIED";
}>;
export declare const DefaultHeader: Headers;
export declare const ImageType: Readonly<{
    readonly JPEG: "jpeg";
    readonly JPG: "jpg";
    readonly JPE: "jpe";
    readonly PNG: "png";
    readonly GIF: "gif";
    readonly WEBP: "webp";
    readonly SVG: "svg";
    readonly BMP: "bmp";
    readonly TIFF: "tiff";
    readonly APNG: "apng";
    readonly AVIF: "avif";
}>;
export type Model = typeof Model[keyof typeof Model];
export type AspectRatio = typeof AspectRatio[keyof typeof AspectRatio];
export type ImageType = typeof ImageType[keyof typeof ImageType];
