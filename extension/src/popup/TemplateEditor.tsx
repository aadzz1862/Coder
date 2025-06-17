import React from 'react';
import { usePopupStore } from './store';

export function TemplateEditor() {
  const templateHTML = usePopupStore((s) => s.templateHTML);
  const companyName = usePopupStore((s) => s.companyName);
  const setTemplateHTML = usePopupStore((s) => s.setTemplateHTML);

  const preview = templateHTML.replace(
    /{{company}}/g,
    companyName || 'Company',
  );

  return (
    <div>
      <textarea
        className="w-full h-32 p-1 border rounded mb-1 text-sm"
        value={templateHTML}
        onChange={(e) => setTemplateHTML(e.target.value)}
      />
      <div
        className="border p-1 text-sm"
        dangerouslySetInnerHTML={{ __html: preview }}
      />
    </div>
  );
}
