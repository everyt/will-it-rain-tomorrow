'use client';

import { appWindow } from '@tauri-apps/api/window';

export default function ExitView() {
  appWindow.close();
}