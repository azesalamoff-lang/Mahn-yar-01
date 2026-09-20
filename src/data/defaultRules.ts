import { TournamentRules } from '../types';

export const DEFAULT_TOURNAMENT_RULES: TournamentRules = {
  title: '“Musiqi Labirinti” — Turnir Əsasnaməsi və Qaydalar',
  subtitle: '18 Sentyabr Milli Musiqi Günü münasibətilə rəsmi yarışma proqramı',
  date: '18.09.2026',
  location: '2 saylı Sumqayıt “ASAN Xidmət”',
  participants: '4 komanda (Hərəsində 4 nəfər)',
  description: '2 saylı Sumqayıt regional “ASAN Xidmət” mərkəzi tərəfindən 18 sentyabr Milli Musiqi günü ilə əlaqədar mərkəz könüllülərinin iştirakı ilə musiqi yarışı təşkil edilir.',
  goal: 'Könüllülərin iştirakı ilə Milli Musiqi Gününün maraqlı, əyləncəli və intellektual aspektdə keçirilməsini təşkil etmək.',
  principle: 'Komandalar musiqiləri tanımaq, sürətli cavab vermək və topladıqları xallarla növbəti mərhələyə keçmək uğrunda yarışırlar.',
  stages: [
    {
      stageNumber: 1,
      name: 'Musiqi Şifrəsi',
      rules: '4 kateqoriyanın hər birində 4 mahnı (Retro mahnılar, 90-cı illər, Kino musiqiləri, Xalq mahnıları). Komandalar nömrələri seçir və səslənən musiqini tapır.',
      points: 'Hər düzgün cavab — 30 xal',
      result: 'Bütün 4 komanda növbəti mərhələyə keçir.'
    },
    {
      stageNumber: 2,
      name: 'Vaxt Dueli',
      rules: '10 mahnı səsləndirilir. İlk işarə edən komanda cavab hüququ qazanır. Səhv verildikdə hüquq digər komandalara keçir.',
      points: 'Hər düzgün cavab — 50 xal',
      result: 'Ən az xallı 1 komanda tərk edir (3 komanda qalır).'
    },
    {
      stageNumber: 3,
      name: 'Ritm Qarşıdurması',
      rules: '8 mahnı səsləndirilir. Komandalardan musiqini neçə saniyədə tapa biləcəkləri soruşulur və tapılma müddətinə uyğun xal verilir.',
      points: '0–10 san: 100 xal | 10–20 san: 70 xal | 20–30 san: 40 xal | 30–40 san: 20 xal | 40–50 san: 10 xal | 50+ san: 0 xal',
      result: 'Ən az xallı 1 komanda tərk edir (Finala 2 komanda yüksəlir).'
    },
    {
      stageNumber: 4,
      name: 'Son Akkordlar',
      rules: 'Finala çıxmış 2 komandanın hər biri 1 nümayəndə seçir. Hər finalçıya 1 dəqiqə ərzində 7 mahnı səsləndirilir.',
      points: 'Düzgün tapılan mahnıların sayı',
      result: 'Daha çox mahnı tapan komanda yarışın ÇEMPİONU olur!'
    }
  ]
};
