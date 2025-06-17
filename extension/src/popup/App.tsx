import React from 'react';
import { DetectCompanyButton } from './DetectCompanyButton';
import { TemplateEditor } from './TemplateEditor';
import { SendButton } from './SendButton';

export function App() {
  return (
    <div className="w-[300px] h-[500px] p-2 flex flex-col gap-2 text-sm">
      <DetectCompanyButton />
      <TemplateEditor />
      <SendButton />
    </div>
  );
}
