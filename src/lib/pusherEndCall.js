import Pusher from "pusher-js";
import Echo from "laravel-echo";

export const echo = new Echo({
    broadcaster: "pusher",
    key: '45072ffcfd6578f7f41d',
    cluster: 'ap1',
    forceTLS: true,
    encrypted: true,
});

Pusher.logToConsole = true;