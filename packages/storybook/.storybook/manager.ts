import { addons } from '@storybook/manager-api';

/**
 * Storybook 첫 진입 시 기본으로 활성화된 하단 패널.
 * 패널의 "절대 위치" 를 바꾸는 공식 API 는 없지만, 기본 선택 탭은 지정 가능.
 * code-tabs 애드온을 기본 탭으로 띄워 사용자가 진입하자마자 4탭 코드를 보도록 한다.
 */
addons.setConfig({
  selectedPanel: 'dx-code-tabs/panel',
});
