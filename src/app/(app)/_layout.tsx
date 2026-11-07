import { Redirect, Tabs } from 'expo-router';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabBarButton, type TabIconName } from '@/components/TabBarButton';
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/theme/colors';

type TabMeta = {
  title: string;
  icon: TabIconName;
  iconFocused: TabIconName;
};

const TABS: Record<string, TabMeta> = {
  home: { title: 'Início', icon: 'home-outline', iconFocused: 'home' },
  occurrences: { title: 'Ocorrências', icon: 'warning-outline', iconFocused: 'warning' },
  shelters: { title: 'Abrigos', icon: 'business-outline', iconFocused: 'business' },
  checkin: { title: 'Check-in', icon: 'checkmark-circle-outline', iconFocused: 'checkmark-circle' },
  about: { title: 'Sobre', icon: 'information-circle-outline', iconFocused: 'information-circle' },
};

export default function AppLayout() {
  const { user, loading } = useAuth();
  const insets = useSafeAreaInsets();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  const bottomPad = Math.max(insets.bottom, Platform.OS === 'web' ? 10 : 8);

  return (
    <Tabs
      screenOptions={({ route }) => {
        const meta = TABS[route.name];
        return {
          headerShown: false,
          sceneStyle: { backgroundColor: 'transparent' },
          tabBarShowLabel: false,
          tabBarStyle: {
            position: 'absolute',
            left: 14,
            right: 14,
            bottom: bottomPad > 14 ? bottomPad - 4 : 10,
            height: 68,
            borderRadius: 22,
            backgroundColor: 'rgba(8, 18, 34, 0.96)',
            borderTopWidth: 0,
            borderWidth: 1,
            borderColor: 'rgba(0, 180, 255, 0.28)',
            paddingTop: 6,
            paddingBottom: 6,
            paddingHorizontal: 4,
            elevation: 16,
            shadowColor: '#000',
            shadowOpacity: 0.35,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 8 },
          },
          tabBarItemStyle: {
            paddingVertical: 0,
          },
          tabBarButton: meta
            ? (props) => (
                <TabBarButton
                  label={meta.title}
                  icon={meta.icon}
                  iconFocused={meta.iconFocused}
                  focused={Boolean(props.accessibilityState?.selected)}
                  onPress={props.onPress}
                  onLongPress={props.onLongPress}
                />
              )
            : undefined,
        };
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Início' }} />
      <Tabs.Screen name="occurrences" options={{ title: 'Ocorrências' }} />
      <Tabs.Screen name="shelters" options={{ title: 'Abrigos' }} />
      <Tabs.Screen name="checkin" options={{ title: 'Check-in' }} />
      <Tabs.Screen name="about" options={{ title: 'Sobre' }} />
      <Tabs.Screen name="action-plan" options={{ href: null, title: 'Plano de ação' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
});
