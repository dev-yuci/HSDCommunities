# Google Maps API Kurulum Kılavuzu

Bu kılavuz, HSD Communities projesinde kullanılan Google Maps özelliklerini kullanabilmeniz için gerekli Google Maps API anahtarını oluşturma ve projeye entegre etme adımlarını içerir.

## Google Maps API Anahtarı Oluşturma

1. [Google Cloud Console](https://console.cloud.google.com/)'a gidin ve oturum açın.

2. Yeni bir proje oluşturun:
   - Sağ üst köşedeki proje seçiciyi tıklayın
   - "YENİ PROJE" düğmesine tıklayın
   - Projeye bir isim verin (örn: "HSD-Map")
   - "OLUŞTUR" düğmesine tıklayın

3. Oluşturduğunuz projeyi seçin.

4. Sol menüden "API'ler ve Hizmetler" > "Kütüphane"yi seçin.

5. Arama çubuğuna "Maps JavaScript API" yazın ve sonucun üzerine tıklayın.

6. "Etkinleştir" düğmesine tıklayın.

7. Sol menüden "API'ler ve Hizmetler" > "Kimlik Bilgileri"ni seçin.

8. "Kimlik Bilgisi Oluştur" düğmesine tıklayın ve "API Anahtarı"nı seçin.

9. Yeni oluşturulan API anahtarınızı kopyalayın.

10. API anahtarınızı güvenlik amacıyla kısıtlamak için:
    - Oluşturulan API anahtarına tıklayın
    - "Uygulama kısıtlamaları" bölümünde "HTTP yönlendiricileri (web siteleri)" seçeneğini işaretleyin
    - Uygulamanızın çalışacağı alan adlarını ekleyin (örn: `http://localhost:3000/*` ve deploy edildiğinde kullanılacak alan adı)
    - "API kısıtlamaları" bölümünde "Anahtarı sınırla" seçeneğini işaretleyin
    - "Maps JavaScript API"yi seçin
    - "Kaydet" düğmesine tıklayın

## API Anahtarını Projeye Entegre Etme

1. Proje dizininde `.env.local` dosyasını açın.

2. Google Maps API anahtarını aşağıdaki formatta ekleyin:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=SİZİN_API_ANAHTARINIZ
   ```

3. `SİZİN_API_ANAHTARINIZ` kısmını, Google Cloud Console'dan aldığınız API anahtarı ile değiştirin.

4. Uygulamayı yeniden başlatın.

## Faturalama Notları

- Google Maps Platform, belirli bir kullanım limitine kadar ücretsizdir. Aylık 200$ değerindeki krediler çoğu kullanım durumu için yeterlidir.
- Fatura koruması ayarlamak için:
   - Google Cloud Console'da projenizi seçin
   - "Faturalama" > "Bütçe ve uyarılar" bölümüne gidin
   - Bir bütçe oluşturun ve bildirim eşiklerini ayarlayın

## Sorun Giderme

Harita yüklenirken sorunlar yaşıyorsanız:

1. API anahtarının doğru bir şekilde `.env.local` dosyasına eklendiğinden emin olun.
2. Google Cloud Console'da projenizde "Maps JavaScript API"nin etkinleştirildiğinden emin olun.
3. API anahtarının kısıtlamalarını kontrol edin, geliştirme aşamasında `localhost` için doğru yönlendirici kısıtlaması eklendiğinden emin olun.
4. Tarayıcı konsolunda hata mesajlarını kontrol edin.

Daha fazla bilgi için [Google Maps Platform Belgeleri](https://developers.google.com/maps/documentation?hl=tr)'ni inceleyebilirsiniz. 