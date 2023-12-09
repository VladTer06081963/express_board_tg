import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import http from "http";
// import socketIo from "socket.io";
import { Telegraf } from "telegraf";
import fetch from "node-fetch";
import config from "config";
import express from "express";
// Токен Telegram бота
const token = config.get("TELEGRAM_KEY");

// Создаем бота
const bot = new Telegraf(token);

// Инициализируем Express
const app = express();
const server = createServer(app);
const io = new SocketIOServer(server);
app.use(express.json());
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", { data: [] }); // Предполагая, что у вас есть файл index.ejs в папке views
});

// Обработчик сообщений Telegram
bot.command("start", (ctx) => {
  ctx.reply("Добро пожаловать в бота.");
});

bot.on("text", (ctx) => {
  ctx.reply("Привет, я ваш бот!");
  io.emit("bot message", ctx.message.text); // Отправляем сообщение всем подключенным клиентам
});

// Запуск бота
bot.launch();

// Маршрут для фронтенда
app.post("/send-message", async (req, res) => {
  const chatId = req.body.chatId;
  const message = req.body.message;

  try {
    await bot.telegram.sendMessage(chatId, message);
    res.status(200).send({ status: "success" });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
