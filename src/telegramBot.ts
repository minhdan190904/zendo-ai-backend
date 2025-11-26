import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";
import { ImageFX, Prompt, AspectRatio } from "./index.js";

const BOT_TOKEN = process.env.BOT_TOKEN || "";
const GOOGLE_COOKIE = process.env.GOOGLE_COOKIE || "";

if (!BOT_TOKEN) {
    console.error("BOT_TOKEN is missing in .env");
    process.exit(1);
}

if (!GOOGLE_COOKIE) {
    console.error("GOOGLE_COOKIE is missing in .env");
    process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const fx = new ImageFX(GOOGLE_COOKIE);

function parsePrompt(text: string) {
    const trimmed = text.trim();

    if (trimmed.startsWith("/square")) {
        const prompt = trimmed.replace("/square", "").trim();
        return { prompt, ratio: AspectRatio.SQUARE };
    }

    if (trimmed.startsWith("/portrait")) {
        const prompt = trimmed.replace("/portrait", "").trim();
        return { prompt, ratio: AspectRatio.PORTRAIT };
    }

    if (trimmed.startsWith("/landscape")) {
        const prompt = trimmed.replace("/landscape", "").trim();
        return { prompt, ratio: AspectRatio.LANDSCAPE };
    }

    return { prompt: trimmed, ratio: AspectRatio.LANDSCAPE };
}

bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = (msg.text || "").trim();

    if (!text || text.startsWith("/start") || text.startsWith("/help")) {
        await bot.sendMessage(
            chatId,
            [
                "Xin chào, mình là bot ImageFX.",
                "",
                "Gửi prompt để tạo ảnh.",
                "Ví dụ:",
                "`a cute cat in cyberpunk city`",
                "",
                "Chọn tỉ lệ khung hình:",
                "/square anime girl with headphones",
                "/portrait anime boy holding a sword",
                "/landscape fantasy castle on the hill",
            ].join("\n"),
            { parse_mode: "Markdown" }
        );
        return;
    }

    const { prompt, ratio } = parsePrompt(text);

    if (!prompt) {
        await bot.sendMessage(chatId, "Prompt trống, gửi lại nhé.");
        return;
    }

    const waiting = await bot.sendMessage(chatId, "Đang tạo ảnh...");

    try {
        const p = new Prompt({
            prompt,
            numberOfImages: 1,
            aspectRatio: ratio,
        });

        const images = await fx.generateImage(p, 1);
        const img = images[0];
        const savedPath = img.save("./tg-images");

        await bot.sendPhoto(chatId, savedPath, {
            caption:
                `Prompt: ${prompt}\n` +
                `Aspect: ${ratio.replace("IMAGE_ASPECT_RATIO_", "")}`,
        });

        const waitingMessageId = waiting.message_id;
        try {
            await bot.deleteMessage(chatId, waitingMessageId);
        } catch (e) { }
    } catch (err) {
        console.error("Error generating image:", err);
        await bot.sendMessage(
            chatId,
            "Lỗi khi gọi ImageFX. Có thể GOOGLE_COOKIE hết hạn."
        );
    }
});

console.log("Telegram bot is running");
