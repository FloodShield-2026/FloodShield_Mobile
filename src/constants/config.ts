import Constants from 'expo-constants';

const extra = (Constants.expoConfig?.extra ?? {}) as {
  javaApiUrl?: string;
  dotnetApiUrl?: string;
  gitCommit?: string;
};

/** API Java (domínio: ocorrências, abrigos, plano). */
export const JAVA_API_URL =
  process.env.EXPO_PUBLIC_JAVA_API_URL ?? extra.javaApiUrl ?? '';

/** API .NET (check-in e pedido de ajuda com idempotência). */
export const DOTNET_API_URL =
  process.env.EXPO_PUBLIC_DOTNET_API_URL ?? extra.dotnetApiUrl ?? '';

/** Sem URL configurada, o app usa armazenamento local com o mesmo contrato. */
export const USE_MOCK_APIS = !JAVA_API_URL;

export const APP_COMMIT_HASH =
  process.env.EXPO_PUBLIC_GIT_COMMIT ?? extra.gitCommit ?? 'local-dev';

export const TEAM = [
  { name: 'Bruno Vinicius Barbosa', rm: '566366' },
  { name: 'Guilherme de Andrade Martini', rm: '566087' },
  { name: 'Nathan Gonçalves Pereira Mendes', rm: '564666' },
  { name: 'Raphael Gomes Mancera', rm: '562279' },
] as const;
