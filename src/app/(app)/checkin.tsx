import { useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import * as checkInService from '@/services/checkInService';
import { colors, spacing } from '@/theme/colors';

function createIdempotencyKey() {
  return `chk-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export default function CheckInScreen() {
  const keyRef = useRef(createIdempotencyKey());
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<string>('');

  async function send(status: 'SEGURO' | 'PRECISO_AJUDA') {
    try {
      setLoading(true);
      const result = await checkInService.submitCheckIn({
        status,
        message: message.trim() || undefined,
        idempotencyKey: keyRef.current,
      });
      setLastResult(
        result.duplicated
          ? `Pedido já registrado (${result.id}). Idempotência evitou duplicar.`
          : `Registrado ${result.status} · ${result.id}`,
      );
      if (!result.duplicated) {
        keyRef.current = createIdempotencyKey();
      }
      Alert.alert(
        result.duplicated ? 'Já enviado' : 'Check-in ok',
        result.duplicated
          ? 'A mesma chave de idempotência não criou outro pedido.'
          : 'Seu status foi enviado à API .NET (ou mock local).',
      );
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Falha no check-in.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen
      title="Check-in"
      subtitle="API .NET: estou seguro ou preciso de ajuda, com Idempotency-Key."
      scroll
    >
      <View style={styles.form}>
        <TextField
          label="Mensagem (opcional)"
          value={message}
          onChangeText={setMessage}
          placeholder="Ex.: Estou no 2º andar, água na garagem"
        />
        <Text style={styles.key}>Chave atual: {keyRef.current}</Text>
        <PrimaryButton
          label="Estou seguro"
          loading={loading}
          onPress={() => send('SEGURO')}
        />
        <PrimaryButton
          label="Preciso de ajuda"
          variant="danger"
          loading={loading}
          onPress={() => send('PRECISO_AJUDA')}
        />
        <PrimaryButton
          label="Simular toque repetido (mesma chave)"
          variant="ghost"
          loading={loading}
          onPress={async () => {
            const fixed = keyRef.current;
            await checkInService.submitCheckIn({
              status: 'PRECISO_AJUDA',
              idempotencyKey: fixed,
            });
            const second = await checkInService.submitCheckIn({
              status: 'PRECISO_AJUDA',
              idempotencyKey: fixed,
            });
            setLastResult(
              second.duplicated
                ? 'Segundo toque bloqueado pela idempotência.'
                : 'Falha: segundo toque criou outro registro.',
            );
          }}
        />
        {lastResult ? <Text style={styles.result}>{lastResult}</Text> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.md,
  },
  key: {
    color: colors.textDim,
    fontSize: 12,
  },
  result: {
    color: colors.primarySoft,
    lineHeight: 20,
  },
});
