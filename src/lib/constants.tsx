import React from 'react';
import { UserCircle, Menu, Smartphone, Download, FileJson, CheckCircle2 } from 'lucide-react';

export const GITHUB_REPO_URL = 'https://github.com';

export interface StepInfo {
  title: string;
  description: string;
  icon: React.ReactNode;
  helperText?: string;
}

export const STEPS_BY_PLATFORM: Record<string, StepInfo[]> = {
  iphone: [
    { title: 'Open your profile', description: 'Open the Instagram app and navigate to your profile page.', icon: <UserCircle className="w-16 h-16 text-fuchsia-500" /> },
    { title: 'Open Menu', description: 'Tap the menu icon in the top right corner.', icon: <Menu className="w-16 h-16 text-fuchsia-500" /> },
    { title: 'Accounts Center', description: "Tap 'Accounts Center' at the top of the menu.", icon: <Smartphone className="w-16 h-16 text-fuchsia-500" /> },
    { title: 'Your information', description: "Go to 'Your information and permissions' and tap 'Download your information'.", icon: <Download className="w-16 h-16 text-fuchsia-500" /> },
    { title: 'Select JSON format', description: "Choose 'Some of your information', select 'Followers and Following', and make sure to choose JSON format (not HTML).", icon: <FileJson className="w-16 h-16 text-fuchsia-500" /> },
    { title: 'Download ZIP', description: "Request the download. Instagram will email you a ZIP file when it's ready.", icon: <CheckCircle2 className="w-16 h-16 text-emerald-500" /> },
  ],
  android: [
    { title: 'Open your profile', description: 'Open the Instagram app and navigate to your profile page.', icon: <UserCircle className="w-16 h-16 text-fuchsia-500" /> },
    { title: 'Open Menu', description: 'Tap the menu icon in the top right corner.', icon: <Menu className="w-16 h-16 text-fuchsia-500" /> },
    { title: 'Accounts Center', description: "Tap 'Accounts Center' at the top of the menu.", icon: <Smartphone className="w-16 h-16 text-fuchsia-500" /> },
    { title: 'Your information', description: "Go to 'Your information and permissions' and tap 'Download your information'.", icon: <Download className="w-16 h-16 text-fuchsia-500" /> },
    { title: 'Select JSON format', description: "Choose 'Some of your information', select 'Followers and Following', and make sure to choose JSON format (not HTML).", icon: <FileJson className="w-16 h-16 text-fuchsia-500" /> },
    { title: 'Download ZIP', description: "Request the download. Instagram will email you a ZIP file when it's ready.", icon: <CheckCircle2 className="w-16 h-16 text-emerald-500" /> },
  ],
  web: [
    { title: 'Open Instagram on your computer', description: 'Open Instagram in your browser and log into your account.', icon: <UserCircle className="w-16 h-16 text-fuchsia-500" /> },
    { title: 'Open Settings', description: 'Click More in the bottom-left or sidebar and choose Settings.', icon: <Menu className="w-16 h-16 text-fuchsia-500" /> },
    { title: 'Go to Accounts Center', description: 'Inside Settings, open Accounts Center.', icon: <Smartphone className="w-16 h-16 text-fuchsia-500" /> },
    { title: 'Download your information', description: 'Go to "Your information and permissions" and click "Download your information."', icon: <Download className="w-16 h-16 text-fuchsia-500" /> },
    { title: 'Select Followers & Following', description: 'Choose "Some of your information," then under Connections select "Followers and Following."', icon: <FileJson className="w-16 h-16 text-fuchsia-500" /> },
    { title: 'Choose JSON and download ZIP', description: 'Select JSON (not HTML), submit the request, and download the ZIP file when it is ready.', helperText: 'Instagram may prepare your file in the background and send you an email when it is ready.', icon: <CheckCircle2 className="w-16 h-16 text-emerald-500" /> },
  ],
};

export const TROUBLESHOOTING_ITEMS = [
  { question: 'Downloaded HTML instead of JSON', answer: 'Make sure the format is set to JSON before requesting the download. If it keeps giving you HTML, double check the format dropdown.' },
  { question: 'ZIP missing files', answer: "Ensure you selected 'Followers and Following' under Connections when requesting the data." },
  { question: 'Email notification delay', answer: "It can take a few minutes for Instagram to prepare your file. Check your spam folder if you don't see it." },
  { question: 'Privacy reassurance', answer: 'No password required. We process your ZIP file locally in memory and never store your data.' },
  { question: "I can't find Accounts Center on web", answer: 'Menus may move slightly. Try searching Settings for "Accounts Center" or "Download your information."' },
];
