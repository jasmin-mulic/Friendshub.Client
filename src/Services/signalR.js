import * as signalR from "@microsoft/signalr"

let connection = null;

export const startSignalR = async () => {
  if (connection) return connection;

  connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:44326/notificationsHub", {
        accessTokenFactory: () => localStorage.getItem("token")
    })
    .withAutomaticReconnect()
    .build();

  await connection.start();

  return connection;
};
