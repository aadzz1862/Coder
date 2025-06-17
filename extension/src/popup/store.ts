import { create } from 'zustand';

export const DEFAULT_TEMPLATE = `<p>Hello,</p><p>I recently applied to {{company}} and would appreciate a referral if possible.</p><p>Best regards,<br/>Your Name</p>`;

interface PopupState {
  companyName: string;
  templateHTML: string;
  setCompanyName: (name: string) => void;
  setTemplateHTML: (html: string) => void;
}

export const usePopupStore = create<PopupState>((set) => ({
  companyName: '',
  templateHTML: DEFAULT_TEMPLATE,
  setCompanyName: (name) => set({ companyName: name }),
  setTemplateHTML: (html) => set({ templateHTML: html }),
}));
