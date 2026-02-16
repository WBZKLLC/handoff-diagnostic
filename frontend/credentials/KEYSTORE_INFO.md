# Handoff Diagnostic - Android Keystore Credentials

## Upload Keystore for Google Play App Signing

Use this keystore to sign your Android App Bundle (.aab) for upload to Google Play Console.

### Keystore File
- **File:** `upload-keystore.jks`
- **Type:** PKCS12

### Credentials
| Property | Value |
|----------|-------|
| Keystore Password | `HandoffDiag2026!` |
| Key Alias | `handoff-upload-key` |
| Key Password | `HandoffDiag2026!` |

### Certificate Fingerprints
- **SHA1:** `A4:1D:D7:A3:EC:1E:19:1A:06:F2:D4:D8:14:1F:9C:D4:80:03:45:00`
- **SHA256:** `7B:0F:C6:70:83:B3:FF:57:2A:0B:DE:B0:23:CC:69:94:78:DB:12:23:F1:88:C7:C6:6E:EF:93:DD:C6:2C:D9:82`

### Certificate Details
- **Owner:** CN=Handoff Diagnostic, OU=Mobile Development, O=WBZK, L=Berlin, ST=Berlin, C=DE
- **Valid Until:** July 4, 2053
- **Algorithm:** SHA256withRSA, 2048-bit RSA

### Important Notes
1. **Keep this keystore safe!** If you lose it, you won't be able to update your app.
2. When uploading to Google Play, enable "Play App Signing" to let Google manage your release key.
3. This is an "upload key" - Google will re-sign with their own key for distribution.

### Usage with EAS Build
```bash
eas build --platform android --profile production
```

### Manual Signing (if needed)
```bash
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore upload-keystore.jks \
  -storepass HandoffDiag2026! \
  app-release.aab handoff-upload-key
```
