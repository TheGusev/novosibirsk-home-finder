import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { Card, Section, Steps, head } from "@/components/site/ui";
import { LeadForm, fieldCls } from "@/components/site/LeadForm";
import { KeyIcon } from "@/components/site/KeyIcon";
import { ROOMS } from "@/lib/catalog";

const H2 = ({ children }: { children: string }) => (
  <h2 className="flex items-center gap-2 text-2xl font-extrabold text-primary md:text-3xl"><KeyIcon className="h-6 w-6 text-berry" />{children}</h2>
);
const Bullets = ({ items }: { items: string[] }) => (
  <ul className="mt-5 grid gap-3 md:grid-cols-2">
    {items.map((t) => <li key={t} className="flex gap-3 rounded-xl bg-card p-4 text-sm text-primary shadow-soft"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-berry" />{t}</li>)}
  </ul>
);

export const Route = createFileRoute("/prodat-kvartiru")({
  staticData: { sitemap: true },
  head: () => head("Продать квартиру в Новосибирске", "Как «Ключбери» определяет цену, этапы продажи, документы от собственника и бесплатная заявка на оценку квартиры.", "/prodat-kvartiru"),
  component: Sell,
});

function Sell() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 pt-10 md:px-6 md:pt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-berry">Продать</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-extrabold text-primary md:text-5xl">Продать квартиру в Новосибирске</h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">Назначим цену по рынку, подготовим объект и проведём сделку. Сроки продажи зависят от спроса и цены — их мы честно обсуждаем, а не обещаем.</p>
        <a href="#ocenka" className="key-turn mt-6 inline-flex items-center gap-2 rounded-xl bg-berry px-5 py-3 text-sm font-semibold text-berry-foreground shadow-soft hover:brightness-110"><KeyIcon className="h-5 w-5" />Получить оценку</a>
      </div>

      <Section>
        <H2>Как мы определяем цену</H2>
        <p className="mt-3 max-w-3xl text-muted-foreground">Цена — это результат сравнения, а не желание. Показываем расчёт, из которого она получилась.</p>
        <Bullets items={[
          "Сравниваем с похожими квартирами в продаже: дом, этаж, площадь, состояние",
          "Учитываем, по каким ценам похожие объекты реально уходили, а не только цены в объявлениях",
          "Смотрим на особенности: вид, планировка, ремонт, документы, доля ипотечных покупателей",
          "Предлагаем диапазон и стратегию: стартовая цена и когда её пересматривать",
        ]} />
      </Section>

      <Section className="pt-0 md:pt-0">
        <H2>Этапы продажи</H2>
        <div className="mt-5">
          <Steps items={[
            { t: "Оценка и договор", d: "Обсуждаем цену и условия. Всё фиксируем в договоре до начала работы" },
            { t: "Подготовка", d: "Документы, фото, описание, размещение объявлений" },
            { t: "Показы и торг", d: "Организуем показы, отвечаем на вопросы покупателей" },
            { t: "Сделка", d: "Задаток, договор, безопасные расчёты, регистрация, передача ключей" },
          ]} />
        </div>
      </Section>

      <Section className="grid gap-6 pt-0 md:grid-cols-2 md:pt-0">
        <div>
          <H2>Что входит в услугу</H2>
          <ul className="mt-5 grid gap-2 text-sm text-primary">
            {["Оценка и стратегия цены", "Проверка и подготовка документов", "Фото и текст объявления", "Размещение на площадках", "Показы", "Переговоры с покупателями", "Подготовка договоров", "Сопровождение расчётов и регистрации"].map((t) => (
              <li key={t} className="flex gap-2"><span className="text-berry">✓</span>{t}</li>
            ))}
          </ul>
        </div>
        <Card>
          <h3 className="text-lg font-bold text-primary">Стоимость услуги</h3>
          <p className="mt-2 text-2xl font-extrabold text-primary">[заполнить]</p>
          <p className="mt-2 text-sm text-muted-foreground">Точные условия и порядок оплаты прописываются в договоре до начала работы. [заполнить]</p>
        </Card>
      </Section>

      <Section className="pt-0 md:pt-0">
        <H2>Что нужно от собственника</H2>
        <p className="mt-3 max-w-3xl text-sm text-muted-foreground">Общий список. Точный набор зависит от того, как квартира перешла в собственность, — уточним на первой встрече.</p>
        <Bullets items={[
          "Паспорта всех собственников",
          "Документ-основание: договор купли-продажи, дарения, свидетельство о наследстве и т. п.",
          "Выписка из ЕГРН (можем заказать сами)",
          "Согласие супруга, если квартира куплена в браке",
          "Документы по ипотеке или маткапиталу, если они использовались",
          "Справка об отсутствии задолженности по коммунальным платежам",
        ]} />
      </Section>

      <Section id="prodat-i-kupit" className="pt-0 md:pt-0">
        <div className="rounded-2xl bg-primary p-6 text-primary-foreground md:p-10">
          <h2 className="text-2xl font-extrabold md:text-3xl">Продать и купить другую</h2>
          <p className="mt-3 max-w-3xl text-primary-foreground/80">Когда деньги от продажи нужны на покупку, важна последовательность — чтобы не остаться без жилья и не потерять задаток.</p>
          <ol className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              ["Оцениваем вашу квартиру", "Понимаем реальный бюджет на новую покупку с учётом расходов"],
              ["Ищем новую квартиру параллельно", "Определяемся с вариантами, пока идут показы вашей"],
              ["Согласуем сроки обеих сторон", "Покупатель и продавец знают, что сделка связанная, — условия фиксируются в задатках"],
              ["Проводим сделки в один день или по цепочке", "Расчёты и регистрация так, чтобы деньги и ключи переходили согласованно"],
            ].map(([t, d], i) => (
              <li key={t} className="rounded-xl bg-primary-foreground/10 p-5">
                <span className="text-sm font-bold text-berry-foreground/90">{i + 1}.</span> <span className="font-bold">{t}</span>
                <p className="mt-1 text-sm text-primary-foreground/80">{d}</p>
              </li>
            ))}
          </ol>
          <Link to="/prodat-i-kupit" className="mt-6 inline-block text-sm font-semibold underline">Подробнее об альтернативной сделке →</Link>
        </div>
      </Section>

      <Section id="ocenka" className="pt-0 md:pt-0">
        <LeadForm
          kind="valuation"
          title="Получить оценку"
          cta="Получить оценку"
          showName={false}
          showComment={false}
          extra={
            <>
              <input name="address" required maxLength={200} placeholder="Адрес квартиры" className={fieldCls} />
              <div className="grid grid-cols-2 gap-3">
                <select name="rooms" required defaultValue="" className={fieldCls}>
                  <option value="" disabled>Комнаты</option>
                  {ROOMS.map((r) => <option key={r.v} value={r.l}>{r.l}</option>)}
                </select>
                <input name="area" required inputMode="decimal" maxLength={8} placeholder="Площадь, м²" className={fieldCls} />
              </div>
              <select name="condition" required defaultValue="" className={fieldCls}>
                <option value="" disabled>Состояние</option>
                {["Требует ремонта", "Косметический ремонт", "Хороший ремонт", "Новостройка без отделки"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </>
          }
        />
      </Section>
    </SiteLayout>
  );
}
