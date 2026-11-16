import { createRoot } from 'react-dom/client';
import React from 'react';
import ClockWrapper from './ClockWrapper';

Module.register('MMM-MirrorClock', {
  renderedReact: false,
  getStyles() {
    return ['MMM-MirrorClock'];
  }, // On first DOM render, this will be true
  getDom() {
    const rootDiv = document.createElement('div');
    const root_id = `${this.name}-react-root`;

    rootDiv.id = root_id;
    if (!this.renderedReact) {
      this.renderedReact = true;
      const root = createRoot(rootDiv);
      root.render(React.createElement(ClockWrapper));
    }

    return rootDiv;
  },
  notificationReceived(notification, payload, sender) {},
  socketNotificationReceived(notification, payload) {},
});
