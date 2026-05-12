import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { clientById, matters } from '@/lib/mock';
import { colors, font, radii, space } from '@/lib/tokens';

export function MatterSheet({
  visible,
  selectedId,
  onPick,
  onClose,
}: {
  visible: boolean;
  selectedId: string;
  onPick: (id: string) => void;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + space.xl }]}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <Text style={styles.title}>Select Matter</Text>
          <Pressable onPress={onClose} hitSlop={10} style={styles.close}>
            <Ionicons name="close" size={20} color={colors.textPrimary} />
          </Pressable>
        </View>
        <ScrollView style={{ maxHeight: 460 }} contentContainerStyle={{ paddingBottom: space.lg }}>
          {matters.map((m) => {
            const client = clientById(m.clientId);
            const active = m.id === selectedId;
            return (
              <Pressable
                key={m.id}
                onPress={() => {
                  onPick(m.id);
                  onClose();
                }}
                style={[styles.row, active && styles.rowActive]}>
                <View style={styles.icon}>
                  <Ionicons name="briefcase-outline" size={18} color={colors.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle} numberOfLines={1}>{m.name}</Text>
                  <Text style={styles.rowSub} numberOfLines={1}>
                    {client?.name} · ${m.rate}/hr
                  </Text>
                </View>
                {active && <Ionicons name="checkmark" size={18} color={colors.accent} />}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.bgElevated,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: space.xxl,
    paddingTop: space.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  handle: { alignSelf: 'center', width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, marginBottom: space.md },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: space.md },
  title: { color: colors.textPrimary, fontSize: font.size.lg, fontWeight: '700' },
  close: { width: 32, height: 32, borderRadius: radii.pill, backgroundColor: colors.bgSurface, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.md, paddingHorizontal: space.sm, borderRadius: radii.md },
  rowActive: { backgroundColor: colors.accentSoft },
  icon: { width: 36, height: 36, borderRadius: radii.pill, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  rowTitle: { color: colors.textPrimary, fontSize: font.size.base, fontWeight: '600' },
  rowSub: { color: colors.textSecondary, fontSize: font.size.xs, marginTop: 2 },
});
