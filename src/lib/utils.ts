// Utility file to restore 'cn' for UI imports
// This is a minimal implementation for classnames merging
export function cn(...args: any[]): string {
  return args.filter(Boolean).join(' ');
}
