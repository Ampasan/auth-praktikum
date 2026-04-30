import React, { useState, useEffect } from "react";
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
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    checkBiometrics();
  }, []);

  const checkBiometrics = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    
    const supportsFingerprint = types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT);
    
    setIsBiometricAvailable(hasHardware && isEnrolled && supportsFingerprint);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Mohon isi email dan password.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      const savedEmail = await SecureStore.getItemAsync("user_email");
      if (!savedEmail) {
        Alert.alert(
          "Biometric Login",
          "Apakah Anda ingin mengaktifkan Biometric Login untuk sesi berikutnya?",
          [
            { text: "Tidak", style: "cancel" },
            {
              text: "Ya",
              onPress: async () => {
                await SecureStore.setItemAsync("user_email", email);
                await SecureStore.setItemAsync("user_password", password);
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert("Login Gagal", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const savedEmail = await SecureStore.getItemAsync("user_email");
      const savedPassword = await SecureStore.getItemAsync("user_password");

      if (!savedEmail || !savedPassword) {
        Alert.alert(
          "Biometric Belum Aktif",
          "Silakan login dengan email dan password secara manual terlebih dahulu untuk mengaktifkan login biometric."
        );
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Login dengan Fingerprint",
        fallbackLabel: "Gunakan Password",
        disableDeviceFallback: false,
      });

      if (result.success) {
        setLoading(true);
        try {
          await login(savedEmail, savedPassword);
        } catch (error) {
          Alert.alert("Login Gagal", error.message);
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Terjadi kesalahan saat otentikasi biometric.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Selamat Datang</Text>
          <Text style={styles.subtitle}>Masuk ke akun Anda untuk melanjutkan</Text>
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

          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
            style={styles.forgotContainer}
          >
            <Text style={styles.forgotText}>Lupa Password?</Text>
          </TouchableOpacity>

          <AppButton title="Masuk" onPress={handleLogin} loading={loading} />

          {isBiometricAvailable && (
            <View style={styles.biometricContainer}>
              <View style={styles.divider} />
              <TouchableOpacity
                style={styles.biometricButton}
                onPress={handleBiometricLogin}
                disabled={loading}
              >
                <MaterialCommunityIcons name="fingerprint" size={48} color="#6366f1" />
                <Text style={styles.biometricText}>Gunakan Fingerprint</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Belum punya akun? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.linkText}>Daftar Sekarang</Text>
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
  forgotContainer: { alignSelf: "flex-end", marginBottom: 24 },
  forgotText: { color: "#6366f1", fontWeight: "600" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { color: "#6b7280", fontSize: 15 },
  linkText: { color: "#6366f1", fontWeight: "700", fontSize: 15 },
  biometricContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    width: "100%",
    marginBottom: 20,
  },
  biometricButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  biometricText: {
    marginTop: 8,
    color: "#6366f1",
    fontWeight: "600",
    fontSize: 14,
  },
});


