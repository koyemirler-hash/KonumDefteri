# Konum Defteri - APK Build Rehberi

## ADIM 1: Dosyaları GitHub'a Yükle

Bu klasördeki TÜM dosyaları KonumDefteri repo'na yükle:
- package.json
- capacitor.config.json
- .github/workflows/build-apk.yml
- www/ klasörü (index.html, manifest.json, sw.js, ikonlar)

## ADIM 2: GitHub Actions Çalıştır

GitHub → Repo → Actions sekmesi → "Build APK" → "Run workflow" butonu

## ADIM 3: APK İndir

Build bittikten sonra (5-10 dakika):
Actions → En son workflow → Artifacts bölümünden:
- `konum-defteri-debug` → Test için APK
- `konum-defteri-release-aab` → Play Store için AAB

## ADIM 4: APK'yı Test Et

`app-debug.apk` dosyasını telefonuna aktar ve yükle.
(Bilinmeyen kaynaklardan yüklemeye izin ver)

## ADIM 5: Play Store için İmzala

Release AAB'yi Play Store'a yüklerken Google Play,
imzalamayı otomatik yapar (App Signing by Google Play).

## Play Store Minimum Gereksinimler

- ✅ AAB dosyası
- ✅ Uygulama ikonu (512x512)
- ✅ En az 2 ekran görüntüsü
- ✅ Gizlilik politikası URL'si
- ✅ Uygulama açıklaması
- ✅ 25$ geliştirici hesabı (tek seferlik)

## Gizlilik Politikası URL

https://koyemirler-hash.github.io/KonumDefteri/
(Sayfada Gizlilik Politikası linki var)

## Sorun Yaşarsan

Actions sekmesinde kırmızı X görürsen:
- Workflow loglarını aç
- Hangi adımda hata verdiğini söyle
