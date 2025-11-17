import * as signalR from "@microsoft/signalr";

let connection = null;

export function startSignalRConnection(token, onNotificationReceived) {
  connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7291/hubs/notifications", {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .build();

  connection.on("ReceiveNotification", onNotificationReceived);

  connection
    .start()
    .catch(err => console.error("SignalR connection failed:", err));
}

export function getConnection() {
  return connection;
}