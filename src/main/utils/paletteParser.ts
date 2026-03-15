import bplist from 'bplist-parser';
import plist from 'plist';

export interface Palette {
  id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
  ansi: string[];
}

function decodeNSColor(base64: string): string | null {
  const buffer = Buffer.from(base64, 'base64');
  try {
    const obj = bplist.parseBuffer(buffer);
    if (!obj || !obj[0]) return null;
    
    const root = obj[0];
    const objects = root['$objects'];
    if (!Array.isArray(objects)) return null;

    // Look for a string that looks like "R G B A" or "R G B"
    // Usually it's one of the first strings in the objects list
    for (const item of objects) {
      if (typeof item === 'string') {
        const components = item.trim().split(/\s+/);
        if (components.length === 3 || components.length === 4) {
          const allNumeric = components.every(c => !isNaN(parseFloat(c)));
          if (allNumeric) {
            const r = Math.max(0, Math.min(255, Math.round(parseFloat(components[0]) * 255)));
            const g = Math.max(0, Math.min(255, Math.round(parseFloat(components[1]) * 255)));
            const b = Math.max(0, Math.min(255, Math.round(parseFloat(components[2]) * 255)));
            return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
          }
        }
      }
    }
  } catch (e) {
    // console.error('Failed to decode NSColor', e);
  }
  return null;
}

export function parseTerminalProfile(content: string): Palette | null {
  try {
    const data = plist.parse(content) as any;
    if (!data) return null;

    const palette: Palette = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name || 'Imported Profile',
      backgroundColor: '#000000',
      textColor: '#FFFFFF',
      ansi: new Array(16).fill('#000000')
    };

    const colorMap: Record<string, keyof Palette | string> = {
      'BackgroundColor': 'backgroundColor',
      'TextColor': 'textColor',
      'ANSIBlackColor': 'ansi:0',
      'ANSIRedColor': 'ansi:1',
      'ANSIGreenColor': 'ansi:2',
      'ANSIYellowColor': 'ansi:3',
      'ANSIBlueColor': 'ansi:4',
      'ANSIMagentaColor': 'ansi:5',
      'ANSICyanColor': 'ansi:6',
      'ANSIWhiteColor': 'ansi:7',
      'ANSIBrightBlackColor': 'ansi:8',
      'ANSIBrightRedColor': 'ansi:9',
      'ANSIBrightGreenColor': 'ansi:10',
      'ANSIBrightYellowColor': 'ansi:11',
      'ANSIBrightBlueColor': 'ansi:12',
      'ANSIBrightMagentaColor': 'ansi:13',
      'ANSIBrightCyanColor': 'ansi:14',
      'ANSIBrightWhiteColor': 'ansi:15'
    };

    for (const [key, value] of Object.entries(data)) {
      const mapping = colorMap[key];
      if (mapping && typeof value === 'object' && (value as any).data) {
        const hex = decodeNSColor((value as any).data);
        if (hex) {
          if (typeof mapping === 'string' && mapping.startsWith('ansi:')) {
            const index = parseInt(mapping.split(':')[1]);
            palette.ansi[index] = hex;
          } else {
            (palette as any)[mapping] = hex;
          }
        }
      }
    }

    return palette;
  } catch (e) {
    console.error('Failed to parse terminal profile', e);
    return null;
  }
}
