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

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleReset = async () => {
    if (!email) {
      Alert.alert("Error", "Mohon isi email Anda.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      Alert.alert(
        "Sukses",
        "Instruksi reset password telah dikirim ke email Anda.",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }]
      );
    } catch (error) {
      Alert.alert("Gagal", error.message);
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
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>← Kembali</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Lupa Password?</Text>
          <Text style={styles.subtitle}>
            Masukkan email Anda untuk reset password.
          </Text>
        </View>

        <View style={styles.form}>
          <AppInput
            label="Email"
            placeholder="Masukkan email terdaftar"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <View style={{ marginTop: 16 }}>
            <AppButton
              title="Kirim Link Reset"
              onPress={handleReset}
              loading={loading}
            />
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
  scrollContent: { flexGrow: 1, padding: 24 },
  header: { marginTop: 40, marginBottom: 40 },
  backButton: { marginBottom: 24 },
  backText: { color: "#6366f1", fontWeight: "600", fontSize: 16 },
  title: { fontSize: 32, fontWeight: "800", color: "#1f2937", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#6b7280", lineHeight: 24 },
  form: { width: "100%" },
});