import React from 'react';
import { addons, types } from '@storybook/manager-api';
import { AddonPanel } from '@storybook/components';
import { CodeTabsPanel } from './CodeTabsPanel';

const ADDON_ID = 'dx-code-tabs';
const PANEL_ID = `${ADDON_ID}/panel`;

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Code',
    render: ({ active }) =>
      React.createElement(AddonPanel, { active: active ?? false },
        React.createElement(CodeTabsPanel, { active: active ?? false })
      ),
  });
});
