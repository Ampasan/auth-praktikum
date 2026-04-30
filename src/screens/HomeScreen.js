import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";

const AppButton = ({ title, onPress, type = "primary", loading = false }) => (
  <TouchableOpacity
    style={[
      buttonStyles.button,
      type === "outline" ? buttonStyles.buttonOutline : buttonStyles.buttonPrimary,
    ]}
    onPress={onPress}
    disabled={loading}
  >
    <Text
      style={[
        buttonStyles.buttonText,
        type === "outline" ? buttonStyles.buttonTextOutline : buttonStyles.buttonTextPrimary,
      ]}
    >
      {loading ? "Loading..." : title}
    </Text>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Halo,</Text>
          <Text style={styles.username}>{user?.email?.split("@")[0] || "User"}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Informasi Akun</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status Verifikasi</Text>
            <Text
              style={[
                styles.infoValue,
                { color: user?.emailVerified ? "#10b981" : "#f59e0b" },
              ]}
            >
              {user?.emailVerified ? "Terverifikasi" : "Belum Verifikasi"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>UID</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {user?.uid}
            </Text>
          </View>
        </View>

        {!user?.emailVerified && (
          <View style={styles.warningCard}>
            <Text style={styles.warningText}>
              Email Anda belum diverifikasi. Silakan cek inbox Anda untuk mengaktifkan semua fitur.
            </Text>
          </View>
        )}

        <View style={{ flex: 1 }} />

        <AppButton title="Keluar" onPress={logout} type="outline" />
      </View>
    </SafeAreaView>
  );
}

const buttonStyles = StyleSheet.create({
  button: { borderRadius: 12, padding: 16, alignItems: "center", justifyContent: "center", width: "100%", marginVertical: 8 },
  buttonPrimary: { backgroundColor: "#6366f1" },
  buttonOutline: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#6366f1" },
  buttonText: { fontSize: 16, fontWeight: "700" },
  buttonTextPrimary: { color: "#fff" },
  buttonTextOutline: { color: "#6366f1" },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 32,
    marginTop: 20,
  },
  greeting: {
    fontSize: 18,
    color: "#6b7280",
  },
  username: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1f2937",
    textTransform: "capitalize",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  infoLabel: {
    color: "#6b7280",
    fontSize: 14,
  },
  infoValue: {
    color: "#1f2937",
    fontSize: 14,
    fontWeight: "600",
    maxWidth: "60%",
  },
  warningCard: {
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: "#fde68a",
    borderRadius: 12,
    padding: 16,
  },
  warningText: {
    color: "#92400e",
    fontSize: 14,
    lineHeight: 20,
  },
});