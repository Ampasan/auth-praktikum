import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";

const AppInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  autoCapitalize = "none",
  keyboardType = "default",
}) => (
  <View style={inputStyles.container}>
    {label && <Text style={inputStyles.label}>{label}</Text>}
    <TextInput
      style={inputStyles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#999"
      secureTextEntry={secureTextEntry}
      autoCapitalize={autoCapitalize}
      keyboardType={keyboardType}
    />
  </View>
);

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

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Mohon isi semua field.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Password tidak cocok.");
      return;
    }

    setLoading(true);
    try {
      await register(email, password);
      Alert.alert(
        "Sukses",
        "Akun berhasil dibuat. Silakan cek email Anda untuk verifikasi sebelum login.",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }]
      );
    } catch (error) {
      Alert.alert("Registrasi Gagal", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Buat Akun</Text>
          <Text style={styles.subtitle}>Daftar untuk mulai menggunakan aplikasi</Text>
        </View>

        <View style={styles.form}>
          <AppInput
            label="Email"
            placeholder="Masukkan email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <AppInput
            label="Password"
            placeholder="Masukkan password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <AppInput
            label="Konfirmasi Password"
            placeholder="Ulangi password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <View style={{ marginTop: 16 }}>
            <AppButton title="Daftar" onPress={handleRegister} loading={loading} />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Sudah punya akun? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.linkText}>Masuk</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const inputStyles = StyleSheet.create({
  container: { marginBottom: 16, width: "100%" },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 8, marginLeft: 4 },
  input: { backgroundColor: "#f9f9f9", borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 12, padding: 16, fontSize: 16, color: "#333" },
});

const buttonStyles = StyleSheet.create({
  button: { borderRadius: 12, padding: 16, alignItems: "center", justifyContent: "center", width: "100%", marginVertical: 8 },
  buttonPrimary: { backgroundColor: "#6366f1" },
  buttonOutline: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#6366f1" },
  buttonText: { fontSize: 16, fontWeight: "700" },
  buttonTextPrimary: { color: "#fff" },
  buttonTextOutline: { color: "#6366f1" },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { flexGrow: 1, padding: 24, justifyContent: "center" },
  header: { marginBottom: 40 },
  title: { fontSize: 32, fontWeight: "800", color: "#1f2937", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#6b7280" },
  form: { width: "100%" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { color: "#6b7280", fontSize: 15 },
  linkText: { color: "#6366f1", fontWeight: "700", fontSize: 15 },
});



