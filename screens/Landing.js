import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const featureItems = [
  {
    icon: '⚡',
    title: 'Fast expense tracking',
    text: 'Capture spending in seconds and keep the whole month visible.',
  },
  {
    icon: '📊',
    title: 'Budget clarity',
    text: 'See what is left before overspending sneaks up on you.',
  },
  {
    icon: '🔒',
    title: 'Private by default',
    text: 'Your data stays tied to your account and is ready when you sign in.',
  },
];

const stats = [
  { value: '24/7', label: 'budget visibility' },
  { value: '3 taps', label: 'to log an expense' },
  { value: '1 place', label: 'for every category' },
];

const Landing = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWide = width >= 760;

  return (
    <View style={styles.screen}>
      <View style={styles.bgOrbOne} />
      <View style={styles.bgOrbTwo} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 28 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <View style={styles.brandPill}>
            <Text style={styles.brandDot}>●</Text>
            <Text style={styles.brandText}>ExpenseTracker</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.topLink}>
            <Text style={styles.topLinkText}>Sign in</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.hero, isWide && styles.heroWide]}>
          <View style={[styles.heroCopy, isWide && styles.heroCopyWide]}>
            <Text style={styles.kicker}>Track spending with less friction</Text>
            <Text style={styles.title}>Money control that feels calm, not cluttered.</Text>
            <Text style={styles.subtitle}>
              Monitor expenses, watch your budget, and get back to the numbers that actually matter.
            </Text>

            <View style={styles.ctaRow}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => navigation.navigate('Login', { mode: 'register' })}
              >
                <Text style={styles.primaryButtonText}>Get started</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.secondaryButtonText}>Log in</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.previewCard, isWide && styles.previewCardWide]}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewLabel}>Monthly snapshot</Text>
              <Text style={styles.previewChip}>Live</Text>
            </View>

            <View style={styles.previewAmountWrap}>
              <Text style={styles.previewAmount}>$1,280</Text>
              <Text style={styles.previewCaption}>spent this month</Text>
            </View>

            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>

            <View style={styles.previewList}>
              <View style={styles.previewRow}>
                <Text style={styles.previewIcon}>🍔</Text>
                <View style={styles.previewMeta}>
                  <Text style={styles.previewName}>Food & Dining</Text>
                  <Text style={styles.previewNote}>Lunch and groceries</Text>
                </View>
                <Text style={styles.previewValue}>-$42</Text>
              </View>
              <View style={styles.previewRow}>
                <Text style={styles.previewIcon}>🚕</Text>
                <View style={styles.previewMeta}>
                  <Text style={styles.previewName}>Transport</Text>
                  <Text style={styles.previewNote}>Ride to work</Text>
                </View>
                <Text style={styles.previewValue}>-$18</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.statsGrid}>
          {stats.map((item) => (
            <View key={item.label} style={styles.statCard}>
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Why it works</Text>
          <Text style={styles.sectionBadge}>Simple by design</Text>
        </View>

        <View style={styles.featureList}>
          {featureItems.map((item) => (
            <View key={item.title} style={styles.featureCard}>
              <View style={styles.featureIconWrap}>
                <Text style={styles.featureIcon}>{item.icon}</Text>
              </View>
              <View style={styles.featureCopy}>
                <Text style={styles.featureTitle}>{item.title}</Text>
                <Text style={styles.featureText}>{item.text}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#071607',
  },
  bgOrbOne: {
    position: 'absolute',
    top: -120,
    right: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(74, 222, 128, 0.16)',
  },
  bgOrbTwo: {
    position: 'absolute',
    bottom: 80,
    left: -100,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(106, 173, 106, 0.14)',
  },
  content: {
    paddingHorizontal: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  brandPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(18, 32, 18, 0.9)',
    borderWidth: 1,
    borderColor: '#1E3A1E',
  },
  brandDot: {
    color: '#4ADE80',
    fontSize: 12,
    marginRight: 8,
  },
  brandText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  topLink: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  topLinkText: {
    color: '#6AAD6A',
    fontSize: 14,
    fontWeight: '700',
  },
  hero: {
    gap: 16,
    marginBottom: 22,
  },
  heroWide: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  heroCopy: {
    flex: 1,
    gap: 14,
  },
  heroCopyWide: {
    paddingRight: 14,
  },
  kicker: {
    color: '#4ADE80',
    textTransform: 'uppercase',
    letterSpacing: 1.6,
    fontSize: 12,
    fontWeight: '800',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 42,
    lineHeight: 48,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  subtitle: {
    color: '#A8CDA8',
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 560,
  },
  ctaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 6,
  },
  primaryButton: {
    backgroundColor: '#4ADE80',
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#4ADE80',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },
  primaryButtonText: {
    color: '#071607',
    fontSize: 16,
    fontWeight: '900',
  },
  secondaryButton: {
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(18, 32, 18, 0.85)',
    borderWidth: 1,
    borderColor: '#294729',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  previewCard: {
    backgroundColor: '#0E1B0E',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1E3A1E',
    gap: 16,
    minHeight: 280,
  },
  previewCardWide: {
    flex: 0.95,
    alignSelf: 'stretch',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previewLabel: {
    color: '#6AAD6A',
    fontSize: 13,
    fontWeight: '700',
  },
  previewChip: {
    color: '#071607',
    backgroundColor: '#4ADE80',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: '900',
    overflow: 'hidden',
  },
  previewAmountWrap: {
    gap: 4,
  },
  previewAmount: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  previewCaption: {
    color: '#A8CDA8',
    fontSize: 14,
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#1A331A',
    overflow: 'hidden',
  },
  progressFill: {
    width: '72%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#4ADE80',
  },
  previewList: {
    gap: 12,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  previewIcon: {
    fontSize: 22,
  },
  previewMeta: {
    flex: 1,
  },
  previewName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  previewNote: {
    color: '#6AAD6A',
    fontSize: 12,
  },
  previewValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 18,
  },
  statCard: {
    flexGrow: 1,
    flexBasis: 120,
    backgroundColor: 'rgba(18, 32, 18, 0.88)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E3A1E',
    padding: 16,
  },
  statValue: {
    color: '#4ADE80',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 6,
  },
  statLabel: {
    color: '#A8CDA8',
    fontSize: 13,
    lineHeight: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  sectionBadge: {
    color: '#4ADE80',
    fontSize: 13,
    fontWeight: '700',
  },
  featureList: {
    gap: 12,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    padding: 18,
    borderRadius: 22,
    backgroundColor: 'rgba(12, 24, 12, 0.92)',
    borderWidth: 1,
    borderColor: '#1E3A1E',
  },
  featureIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#173417',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureIcon: {
    fontSize: 20,
  },
  featureCopy: {
    flex: 1,
  },
  featureTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  featureText: {
    color: '#A8CDA8',
    fontSize: 14,
    lineHeight: 21,
  },
});

export default Landing;