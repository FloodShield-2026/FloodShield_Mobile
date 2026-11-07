import { Alert, Platform } from 'react-native';

type Button = {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
};

export function showAlert(title: string, message?: string, buttons?: Button[]) {
  if (Platform.OS === 'web') {
    const text = message ? `${title}\n\n${message}` : title;
    const actions = buttons?.filter((b) => b.style !== 'cancel') ?? [];
    const cancel = buttons?.find((b) => b.style === 'cancel');

    if (actions.length === 1 && cancel) {
      const ok = window.confirm(text);
      if (ok) actions[0]?.onPress?.();
      else cancel.onPress?.();
      return;
    }

    window.alert(text);
    buttons?.find((b) => b.style !== 'cancel')?.onPress?.();
    return;
  }

  Alert.alert(title, message, buttons);
}
