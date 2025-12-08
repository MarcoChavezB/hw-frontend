self.addEventListener("push", event => {
  const data = event.data?.json() ?? {};

  event.waitUntil(
    self.registration.showNotification(data.title || "Notificación", {
      body: data.body || "",
      icon: "assets/icons/icon-192x192.png",
      data: { url: data.url ?? "/" }
    })
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
