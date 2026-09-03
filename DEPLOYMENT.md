# KhelHub Nepal - Sports News Portal 🏆
## Deployment & Setup Guide (Vercel + Supabase)

यस गाइडमा KhelHub Nepal को लागि बनाइएको यो custom-coded news portal लाई **निःशुल्क Vercel र Supabase** मा कसरी सजिलै लाइभ गर्ने भनेर विस्तृत रूपमा व्याख्या गरिएको छ।

---

## 🎯 लागत विवरण (Budget Breakdown: NPR 10,000)

| सेवा (Service) | प्रदायक (Provider) | मूल्य (Cost) |
|---|---|---|
| **वेबसाइट होस्टिङ** | Vercel | **रु ० (Lifetime Free)** |
| **डाटाबेस (PostgreSQL)** | Supabase (Free Tier) | **रु ० (Free 500MB DB)** |
| **फोटो/इमेज स्टोरेज** | Supabase Storage | **रु ० (Free 1GB Storage)** |
| **SSL प्रमाणपत्र (HTTPS)** | Vercel Automated SSL | **रु ० (Free)** |
| **नेपाली डोमेन (.com.np)** | Mercantile Nepal | **रु ० (Lifetime Free)** |
| **अन्तर्राष्ट्रिय डोमेन (.com)** | Namecheap / GoDaddy | **~ रु १,५०० / वर्ष** (दर्ता भएपछि) |
| **तपाईंको नाफा (Your Net Profit)** | — | **रु ८,५०० देखि १०,०००** 🎉 |

---

## 🚀 Step 1: निःशुल्क Supabase डाटाबेस बनाउने (२ मिनेट)

1. [supabase.com](https://supabase.com) मा जानुहोस् र आफ्नो Google वा GitHub बाट **Sign Up** गर्नुहोस्।
2. **"New Project"** मा क्लिक गर्नुहोस्।
   - **Name:** `khelhub-nepal`
   - **Database Password:** बलियो पासवर्ड राख्नुस् (कतै सुरक्षित टिप्नुहोस्)
   - **Region:** `Singapore (ap-southeast-1)` वा नजिकको रोज्नुहोस्।
3. प्रोजेक्ट बनेपछि बाँया साइडबारको **SQL Editor** (SQL आइकन) मा जानुहोस्।
4. यस प्रोजेक्ट भित्र रहेको `supabase/schema.sql` फाइलको सम्पूर्ण कोड कपी गर्नुहोस् र Supabase SQL Editor मा पेस्ट गरेर **Run** थिच्नुहोस्।
   - यसले स्वचालित रूपमा `news`, `categories`, `ads` टेबलहरू र तस्बिर राख्ने Storage Bucket बनाइदिन्छ।
5. अब बाँया मेनुको **Project Settings (⚙️ Settings)** > **API** मा जानुहोस्:
   - **Project URL** कपी गर्नुहोस्।
   - **Project API Keys** बाट `anon public` र `service_role` (Secret) कुञ्जी कपी गर्नुहोस्।

---

## 🌐 Step 2: GitHub मा कोड अपलोड गर्ने

आफ्नो कम्प्युटरको टर्मिनल (Terminal / Command Prompt) मा यो प्रोजेक्टको फोल्डरमा:

```bash
git add .
git commit -m "Complete KhelHub Nepal News Portal"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/khelhub-nepal.git
git push -u origin main
```

---

## ⚡ Step 3: Vercel मा नि:शुल्क होस्ट गर्ने (१ मिनेट)

1. [vercel.com](https://vercel.com) मा जानुहोस् र आफ्नो GitHub अकाउन्टमार्फत **Log in** गर्नुहोस्।
2. **"Add New..."** > **"Project"** छानेर भर्खरै पुश गरेको `khelhub-nepal` रिपोजिटरी छान्नुहोस् र **Import** मा क्लिक गर्नुहोस्।
3. **"Environment Variables"** सेक्सन खोल्नुहोस् र निम्न भेरिएबलहरू थप्नुहोस्:

| Variable Key | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | तपाईंको Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | तपाईंको Supabase `anon` key |
| `SUPABASE_SERVICE_ROLE_KEY` | तपाईंको Supabase `service_role` key |
| `ADMIN_USERNAME` | `admin` (वा आफ्नो इच्छा अनुसार) |
| `ADMIN_PASSWORD` | `KhelHub@2024!` (वा आफ्नो गोप्य पासवर्ड) |
| `ADMIN_SECRET_KEY` | कुनै पनि लामो र्यान्डम अक्षरहरू (उदा: `khelhub_super_secret_key_2024`) |
| `NEXT_PUBLIC_SITE_URL` | Vercel ले दिने URL (जस्तै: `https://khelhub-nepal.vercel.app`) |

4. **"Deploy"** बटन थिच्नुहोस्!
५० सेकेन्ड भित्र तपाईंको वेबसाइट लाइभ हुनेछ! 🚀

---

## 🔐 Admin Panel (CMS) कसरी प्रयोग गर्ने?

- **Admin Login URL:** `https://your-domain.vercel.app/admin/login`
- **Default Username:** `admin`
- **Default Password:** `KhelHub@2024!`

### सुविधाहरू:
1. **नयाँ समाचार लेख्ने (`/admin/news/new`):**
   - शीर्षक, स्लग (स्वतः बन्ने), वर्ग (फुटबल, क्रिकेट, भलिबल, आदि)
   - कम्प्युटरबाट सिधै फोटो अपलोड (Supabase Storage मा बस्छ) वा इमेज लिंक
   - रिच टेक्स्ट / HTML फर्म्याटिङ (अनुच्छेद, उप-शीर्षक, उद्धरण)
   - ⭐ Hero मा देखाउने (Featured), 🔴 ब्रेकिङ न्यूजमा देखाउने (Breaking Ticker)
2. **खेलकुद वर्ग व्यवस्थापन (`/admin/categories`):**
   - नयाँ खेलकुद वर्ग थप्ने (उदा: ब्याडमिन्टन, टेबलटेनिस, पौडी, कराते)
   - स्वचालित URL Slug जेनेरेसन
   - ब्राण्ड / ब्याज रङ छनोट (Color Picker + Presets)
   - सम्पादन (Edit) वा मेटाउने (Delete) सुविधा
   - यहाँ थपिएका नयाँ वर्गहरू स्वतः नेभिगेसन बार, समाचार लेख्ने फारम र क्याटगोरी पृष्ठमा उपलब्ध हुन्छन्।
3. **विज्ञापन व्यवस्थापन (`/admin/ads`):**
   - हेडर ब्यानर (Header), साइडबार (Sidebar), फुटर (Footer), वा समाचार भित्र (In-Article)
   - ब्यानर फोटो र क्लिक गर्दा खुल्ने लिंक
   - Google AdSense वा कुनै पनि HTML कोड सिधै राख्न मिल्ने सुविधा
   - विज्ञापनलाई १ क्लिकमा Active / Inactive गर्न मिल्ने
3. **ड्यासबोर्ड (`/admin/dashboard`):**
   - कुल समाचार, भ्युज (Views) काउन्टर, सक्रिय विज्ञापन संख्या।

---

## 🏷️ Custom Domain (दर्ता भएपछि कसरी जोड्ने)

जब कम्पनी आधिकारिक रूपमा दर्ता हुन्छ र डोमेन किनिन्छ:
1. **Vercel Project** > **Settings** > **Domains** मा जानुहोस्।
2. आफ्नो डोमेन (उदा: `khelhubnepal.com` वा `khelhub.com.np`) टाइप गर्नुहोस् र **Add** गर्नुहोस्।
3. Vercel ले दिने DNS रेकर्ड (A Record र CNAME) आफ्नो डोमेन प्रदायक (Mercantile वा Registrar) मा अपडेट गर्नुहोस्।
4. SSL प्रमाणपत्र Vercel ले स्वतः निःशुल्क एक्टिभेट गरिदिन्छ।

---

## 💻 Local मा चलाएर जाँच्न:

```bash
npm run dev
```
त्यसपछि ब्राउजरमा `http://localhost:3000` खोल्नुहोस्।
Admin Panel: `http://localhost:3000/admin/login`
