import "dotenv/config";
import http from "http";
import TelegramBot from "node-telegram-bot-api";
import { ImageFX, Prompt, AspectRatio, Model } from "./index.js";

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

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Telegram ImageFX bot is running\n");
});

server.listen(PORT, () => {
    console.log("HTTP server listening on port", PORT);
});

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const fx = new ImageFX(GOOGLE_COOKIE);

function parsePrompt(text) {
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

    if (!msg.text) {
        await bot.sendMessage(
            chatId,
            "Hãy gửi cho mình một câu mô tả (text prompt) nhé."
        );
        return;
    }

    let rawText = (msg.text || "")
        .replace(/\n+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const { prompt, ratio } = parsePrompt(rawText);

    if (!prompt || prompt.length < 5) {
        await bot.sendMessage(
            chatId,
            "❗ Prompt quá ngắn. Vui lòng mô tả hình ảnh chi tiết hơn."
        );
        return;
    }

    const ratioLabel =
        ratio === AspectRatio.SQUARE
            ? "Square"
            : ratio === AspectRatio.PORTRAIT
                ? "Portrait"
                : "Landscape";

    await bot.sendMessage(
        chatId,
        `⏳ Đang tạo ảnh bằng Google ImageFX...\n• Tỷ lệ: ${ratioLabel}`
    );

    try {
        const p = new Prompt({
            prompt,
            numberOfImages: 1,
            aspectRatio: ratio,
            generationModel: Model.IMAGEN_3_5,
            seed: 0,
        });

        const imgs = await fx.generateImage(p, 1);

        if (!imgs || imgs.length === 0) {
            await bot.sendMessage(
                chatId,
                "❌ Không nhận được ảnh nào từ ImageFX."
            );
            return;
        }

        const savedPath = imgs[0].save("./outputs");
        await bot.sendPhoto(chatId, savedPath);
    } catch (err) {
        console.error("ImageFX error:", err);
        const msgErr = err?.message || String(err);
        await bot.sendMessage(chatId, "❌ Lỗi ImageFX:\n" + msgErr);
    }
});

console.log("Telegram bot is running");
