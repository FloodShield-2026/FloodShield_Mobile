import { Redirect, Tabs } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/theme/colors';

function TabLabel({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text style={{ color: focused ? colors.primary : colors.textDim, fontSize: 11, fontWeight: '700' }}>
      {label}
    </Text>
  );
}

export default function AppLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.backgroundAlt },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: colors.backgroundAlt,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textDim,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Início',
          tabBarLabel: ({ focused }) => <TabLabel label="Início" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="occurrences/index"
        options={{
          title: 'Ocorrências',
          tabBarLabel: ({ focused }) => <TabLabel label="Ocorrências" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="shelters"
        options={{
          title: 'Abrigos',
          tabBarLabel: ({ focused }) => <TabLabel label="Abrigos" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="checkin"
        options={{
          title: 'Check-in',
          tabBarLabel: ({ focused }) => <TabLabel label="Check-in" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'Sobre',
          tabBarLabel: ({ focused }) => <TabLabel label="Sobre" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="occurrences/new"
        options={{ href: null, title: 'Nova ocorrência' }}
      />
      <Tabs.Screen
        name="occurrences/[id]"
        options={{ href: null, title: 'Detalhe' }}
      />
      <Tabs.Screen
        name="action-plan"
        options={{ href: null, title: 'Plano de ação' }}
      />
    </Tabs>
  );
}
