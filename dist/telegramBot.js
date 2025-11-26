// telegramBot.js
import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";
import { ImageFX, Prompt, AspectRatio, Model } from "./index.js";

// ====== ENV CHECK ======
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

// ====== INIT BOT + IMAGEFX ======
const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const fx = new ImageFX(GOOGLE_COOKIE);

// ====== HELPERS ======
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

    // default: landscape
    return { prompt: trimmed, ratio: AspectRatio.LANDSCAPE };
}

// ====== MESSAGE HANDLER ======
bot.on("message", async (msg) => {
    const chatId = msg.chat.id;

    if (!msg.text) {
        bot.sendMessage(chatId, "Hãy gửi cho mình một câu mô tả (text prompt) nhé.");
        return;
    }

    // sanitize text
    let rawText = (msg.text || "")
        .replace(/\n+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const { prompt, ratio } = parsePrompt(rawText);

    if (!prompt || prompt.length < 5) {
        bot.sendMessage(
            chatId,
            "❗ Prompt quá ngắn. Vui lòng mô tả hình ảnh chi tiết hơn."
        );
        return;
    }

    bot.sendMessage(
        chatId,
        "⏳ Đang tạo ảnh bằng Google ImageFX...\n" +
        "• Tỷ lệ: " +
        (ratio === AspectRatio.SQUARE
            ? "Square"
            : ratio === AspectRatio.PORTRAIT
                ? "Portrait"
                : "Landscape")
    );

    try {
        const p = new Prompt({
            prompt,
            numberOfImages: 1,
            aspectRatio: ratio,               // dùng ratio từ /square|/portrait|/landscape
            generationModel: Model.IMAGEN_3_5,
            seed: 0,
        });

        const imgs = await fx.generateImage(p, 1);

        if (!imgs || imgs.length === 0) {
            await bot.sendMessage(chatId, "❌ Không nhận được ảnh nào từ ImageFX.");
            return;
        }

        const savedPath = imgs[0].save("./outputs");
        await bot.sendPhoto(chatId, savedPath);
    } catch (err) {
        console.error("ImageFX error:", err);
        const msgErr = err?.message || String(err);
        bot.sendMessage(chatId, "❌ Lỗi ImageFX:\n" + msgErr);
    }
});

console.log("Telegram bot is running");
