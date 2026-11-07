import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/Card';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import * as checkInService from '@/services/checkInService';
import { showAlert } from '@/utils/alert';
import { colors, spacing } from '@/theme/colors';

function createIdempotencyKey() {
  return `chk-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export default function CheckInScreen() {
  const [idempotencyKey, setIdempotencyKey] = useState(createIdempotencyKey);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState('');

  async function send(status: 'SEGURO' | 'PRECISO_AJUDA') {
    try {
      setLoading(true);
      const result = await checkInService.submitCheckIn({
        status,
        message: message.trim() || undefined,
        idempotencyKey,
      });
      setLastResult(
        result.duplicated
          ? `Pedido já registrado (${result.id}). Idempotência evitou duplicar.`
          : `Registrado ${result.status} · ${result.id}`,
      );
      if (!result.duplicated) {
        setIdempotencyKey(createIdempotencyKey());
      }
      showAlert(
        result.duplicated ? 'Já enviado' : 'Check-in ok',
        result.duplicated
          ? 'A mesma chave de idempotência não criou outro pedido.'
          : 'Seu status foi registrado com sucesso.',
      );
    } catch (error) {
      showAlert('Erro', error instanceof Error ? error.message : 'Falha no check-in.');
    } finally {
      setLoading(false);
    }
  }

  async function simulateDuplicate() {
    try {
      setLoading(true);
      const fixed = idempotencyKey;
      await checkInService.submitCheckIn({
        status: 'PRECISO_AJUDA',
        idempotencyKey: fixed,
      });
      const second = await checkInService.submitCheckIn({
        status: 'PRECISO_AJUDA',
        idempotencyKey: fixed,
      });
      const text = second.duplicated
        ? 'Segundo toque bloqueado pela idempotência.'
        : 'Falha: segundo toque criou outro registro.';
      setLastResult(text);
      showAlert('Teste de idempotência', text);
    } catch (error) {
      showAlert('Erro', error instanceof Error ? error.message : 'Falha no teste.');
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
        <Card>
          <Text style={styles.keyLabel}>Chave de idempotência</Text>
          <Text selectable style={styles.key}>
            {idempotencyKey}
          </Text>
        </Card>
        <PrimaryButton label="Estou seguro" loading={loading} onPress={() => send('SEGURO')} />
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
          onPress={simulateDuplicate}
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
  keyLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  key: {
    color: colors.primarySoft,
    fontSize: 12,
    fontFamily: 'monospace',
  },
  result: {
    color: colors.primarySoft,
    lineHeight: 20,
  },
});
