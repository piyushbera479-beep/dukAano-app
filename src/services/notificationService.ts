import { LocalNotifications, Channel } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { Order } from '../types';

// Map order statuses to user-friendly alert titles, bodies, and icons
export interface OrderStatusNotificationContent {
  title: string;
  body: string;
  badge?: number;
}

export const getStatusNotificationContent = (
  orderId: string,
  status: Order['status'],
  earnedCoins?: number
): OrderStatusNotificationContent => {
  switch (status) {
    case 'confirmed':
      return {
        title: `✅ Order Confirmed (#${orderId})`,
        body: 'Merchant has accepted your order and started processing items.',
      };
    case 'preparing':
      return {
        title: `👨‍🍳 Preparing Your Order (#${orderId})`,
        body: 'The shop is freshly preparing and packing your ordered items.',
      };
    case 'ready_for_pickup':
      return {
        title: `📦 Ready for Pickup (#${orderId})`,
        body: 'Your package is sealed and ready for delivery partner pickup.',
      };
    case 'rider_assigned':
      return {
        title: `🛵 Rider Assigned (#${orderId})`,
        body: 'A verified DUKAANO delivery partner has arrived at the store.',
      };
    case 'out_for_delivery':
      return {
        title: `🚀 Out for Delivery (#${orderId})`,
        body: 'Your rider is on the way to your doorstep! Tap to track live GPS.',
      };
    case 'delivered':
      return {
        title: `🎉 Order Delivered (#${orderId})`,
        body: earnedCoins && earnedCoins > 0
          ? `Delivered successfully! +${earnedCoins} D Coins credited to your balance.`
          : 'Your order has been delivered at your doorstep. Enjoy!',
      };
    default:
      return {
        title: `DUKAANO Order Update (#${orderId})`,
        body: `Your order status changed to ${status.replace('_', ' ')}.`,
      };
  }
};

class NotificationService {
  private channelCreated = false;
  private permissionRequested = false;

  /**
   * Initializes notification channels on Android and requests permissions if needed.
   */
  async init(): Promise<void> {
    if (!Capacitor.isPluginAvailable('LocalNotifications')) {
      return;
    }

    try {
      // 1. Create Android Notification Channel (High Importance for Instant Pop-up Heads-up Alert)
      if (!this.channelCreated) {
        const orderChannel: Channel = {
          id: 'order_updates',
          name: 'DUKAANO Order Status',
          description: 'Timely real-time alerts when your grocery or meal order moves through delivery stages',
          importance: 5, // Android NotificationManager.IMPORTANCE_HIGH
          visibility: 1, // VISIBILITY_PUBLIC
          vibration: true,
          lights: true,
          lightColor: '#0F766E',
        };

        await LocalNotifications.createChannel(orderChannel);
        this.channelCreated = true;
      }

      // 2. Check & request permission
      await this.requestPermission();
    } catch (err) {
      console.warn('Could not initialize LocalNotifications channel:', err);
    }
  }

  /**
   * Request notification permission from user
   */
  async requestPermission(): Promise<boolean> {
    if (!Capacitor.isPluginAvailable('LocalNotifications')) {
      // Web Notification API fallback if supported
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'default') {
          const res = await Notification.requestPermission();
          return res === 'granted';
        }
        return Notification.permission === 'granted';
      }
      return false;
    }

    try {
      const check = await LocalNotifications.checkPermissions();
      if (check.display === 'granted') {
        return true;
      }

      const request = await LocalNotifications.requestPermissions();
      this.permissionRequested = true;
      return request.display === 'granted';
    } catch (err) {
      console.warn('Failed to check/request LocalNotifications permissions:', err);
      return false;
    }
  }

  /**
   * Dispatches a local notification when an order status updates.
   * Generates a stable numeric notification ID from the order ID and timestamp.
   */
  async notifyOrderStatus(
    orderId: string,
    status: Order['status'],
    earnedCoins?: number
  ): Promise<void> {
    const content = getStatusNotificationContent(orderId, status, earnedCoins);
    
    // Hash order string into a 32-bit integer for notification ID
    const hash = orderId.split('').reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) | 0, 0);
    const notificationId = Math.abs(hash % 100000) + Math.floor(Math.random() * 900);

    // 1. Try Native Capacitor Local Notifications
    if (Capacitor.isPluginAvailable('LocalNotifications')) {
      try {
        await this.init();

        await LocalNotifications.schedule({
          notifications: [
            {
              id: notificationId,
              title: content.title,
              body: content.body,
              channelId: 'order_updates',
              smallIcon: 'ic_launcher_foreground',
              iconColor: '#0F766E',
              extra: {
                orderId,
                status,
                type: 'order_status_update',
              },
              schedule: {
                at: new Date(Date.now() + 150),
                allowWhileIdle: true,
              },
            },
          ],
        });
        return;
      } catch (err) {
        console.warn('Capacitor LocalNotifications schedule error:', err);
      }
    }

    // 2. Fallback to Web standard Notification if running in desktop / browser environment
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(content.title, {
          body: content.body,
          icon: '/icon.svg',
          badge: '/icon.svg',
          tag: `dukaano-order-${orderId}`,
        });
      } catch (webNotifErr) {
        console.warn('Web Notification error:', webNotifErr);
      }
    }
  }

  /**
   * Listen for user tapping on a notification to open the order
   */
  addActionListener(onAction: (orderId: string) => void): { remove: () => void } {
    if (!Capacitor.isPluginAvailable('LocalNotifications')) {
      return { remove: () => {} };
    }

    let removeListener = () => {};

    LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
      const extra = notification.notification?.extra;
      if (extra && extra.orderId) {
        onAction(extra.orderId);
      }
    }).then((handle) => {
      removeListener = () => handle.remove();
    });

    return {
      remove: () => removeListener(),
    };
  }
}

export const notificationService = new NotificationService();
