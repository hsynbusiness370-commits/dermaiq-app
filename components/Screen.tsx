import { PropsWithChildren } from 'react';
import {
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, layout, spacing } from '@/lib/theme';

type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}> &
  Pick<ScrollViewProps, 'showsVerticalScrollIndicator'> &
  Pick<ViewProps, never>;

export function Screen({
  children,
  scroll = true,
  contentContainerStyle,
  style,
  showsVerticalScrollIndicator = false,
}: ScreenProps) {
  if (scroll) {
    return (
      <SafeAreaView style={[styles.safeArea, style]}>
        <ScrollView
          contentContainerStyle={[styles.content, contentContainerStyle]}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        >
          <View style={styles.inner}>{children}</View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, style]}>
      <View style={[styles.content, styles.inner, contentContainerStyle]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: layout.pagePadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  inner: {
    width: '100%',
    maxWidth: layout.maxWidth,
    alignSelf: 'center',
  },
});
