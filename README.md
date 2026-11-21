# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## Индексация и размещение

Сайт использует серверную выдачу HTML (SSR), не является клиентской SPA. Главная, каталог, услуги, карточки и подборки доступны без JavaScript; предварительная генерация не нужна и не включена, чтобы наличие объектов и noindex не устаревали.

- `seo_index_min_objects` в `site_settings` — минимальное число активных объектов для index (сейчас 3).
- `seo_organization` — реальные `address`, `phone`, `openingHours` (формат Schema.org, например `Mo-Fr 09:00-18:00`), `sameAs.twoGis` и `sameAs.yandexBusiness`. Пустые контакты и ссылки не выдаются как выдуманные значения.
- Подборки считают только `active`; забронированные карточки получают noindex. Сложные фильтры (более двух смысловых групп) получают noindex, canonical ведёт к соответствующей подборке или каталогу. Сортировка и режим карты не считаются фильтрами.
- `/sitemap.xml` автоматически читает все публичные активные квартиры и ЖК, включает только подборки с достаточным количеством объектов. Ошибка любого пакета возвращает 503 вместо неполного XML; `lastmod` не выдумывается.
- `src/lib/seo.ts` задаёт публичный адрес canonical и sitemap. Сейчас это действующий адрес Lovable. После реального подключения `kluchberi.ru` замените адрес здесь и Sitemap в `public/robots.txt`, установите постоянное перенаправление со старого адреса и опубликуйте.
- Фотографии существующего демокаталога выдаются в WebP. Для новых объектов загружайте WebP в поле images; название объекта используется как alt. Основные изображения загружаются сразу, остальные — лениво.

### Публикация

На Lovable достаточно опубликовать проект. Изменения поисковых тегов на действующем URL появятся только после новой публикации. После неё добавьте сайт в Яндекс Вебмастер и отправьте `/sitemap.xml`; техническая готовность не гарантирует включение в поиск.

### Собственный сервер

Простая загрузка файлов на статический хостинг или `try_files ... /index.html` недостаточна: нужны серверная выдача HTML, формы и динамическая карта сайта. Текущая конфигурация собирается для Cloudflare Workers. Для этого варианта разверните собранный серверный пакет в совместимой среде Cloudflare Workers и подключите домен; конфигурацию развёртывания и переменные окружения задаёт ваша среда размещения.

Для обычного VPS потребуется отдельно сменить целевую среду сборки на Node-совместимый серверный preset поддерживаемый установленной версией Nitro, собрать проект, запустить выданный серверный entrypoint и направить HTTPS reverse proxy на него. Не переносите только клиентскую папку. Поддержка и запуск VPS в этой задаче не настраивались и не проверялись. Сохраните публичные настройки подключения Cloud, а секреты форм держите в переменных окружения сервера, не в клиентском коде. Перед переключением домена проверьте ответ без JavaScript, `/sitemap.xml` и отправку формы.
